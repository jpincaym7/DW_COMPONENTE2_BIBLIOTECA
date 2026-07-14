# Tecnologias utilizadas y como se usaron

Documento de referencia para la sustentacion. Explica que se uso, donde se uso y **por que** se eligio, que es lo que realmente se defiende.

## Resumen

| Capa | Tecnologia | Version |
|---|---|---|
| Entorno | Node.js | 22.17 |
| Backend | Express | 4.22 |
| Base de datos | MongoDB Atlas con Mongoose | 8.24 |
| Autenticacion | jsonwebtoken + bcryptjs | 9.0 / 2.4 |
| Validacion | Zod (compartido entre backend y frontend) | 3.25 |
| Frontend | React + React Router + Vite | 18.3 / 6.30 / 5.4 |
| Cliente HTTP | Axios | 1.18 |
| Estilos | CSS Modules con variables nativas de CSS | - |
| Pruebas de API | Postman | - |
| Diseno | Figma | - |
| Control de versiones | Git y GitHub | - |

Volumen construido: 32 endpoints REST, 5 modelos, 7 servicios, 7 controladores, 5 middlewares, 7 esquemas de validacion compartidos, 19 componentes de interfaz reutilizables, 8 hooks propios y 14 paginas.

---

## Organizacion general: monorepo con npm workspaces

El proyecto no son dos carpetas sueltas, sino **tres paquetes** gestionados por npm workspaces: `backend`, `frontend` y `shared`.

```
DESARROLLO-WEB/
├── shared/     Constantes y esquemas de validacion
├── backend/    API REST
├── frontend/   Aplicacion React
└── docs/       Contrato de API, modelo de datos, Figma y Postman
```

**Por que.** El paquete `shared` es lo que permite cumplir el requisito de "validaciones tanto en frontend como backend" **sin escribir la regla dos veces**. Un unico `npm install` en la raiz enlaza los tres paquetes.

---

# Backend

## Node.js y Express

Express organiza la API en capas con responsabilidades separadas. Cada capa tiene prohibido invadir la siguiente.

| Capa | Responsabilidad | Lo que tiene prohibido |
|---|---|---|
| `routes/` | Declarar metodo, ruta y cadena de middlewares | Contener logica de negocio |
| `controllers/` | Leer la peticion, llamar al servicio, responder | Tocar Mongoose directamente |
| `services/` | Reglas de negocio y consultas a la base de datos | Conocer `req` o `res` |
| `models/` | Esquema, indices, hooks y validaciones de esquema | Consultas complejas |
| `middlewares/` | Autenticacion, autorizacion, validacion y errores | - |
| `utils/` | Ayudantes puros y reutilizables | Mantener estado |

**Por que esta separacion importa.** Los controladores quedan en cinco o diez lineas y los servicios no saben que existe HTTP. Un servicio como `loan.service.js` podria invocarse desde una tarea programada o desde una prueba sin levantar un servidor. Esa es la diferencia entre "codigo organizado" y "carpetas con nombres bonitos".

Ejemplo real de una ruta, donde se lee de un vistazo quien puede entrar y que se valida:

```
router.post('/', protect, authorize(ROLES.ADMIN), validate(createBookSchema), postBook);
```

## Autenticacion: JWT en cookie httpOnly, con soporte Bearer

Es la decision tecnica mas importante del proyecto y conviene entenderla bien.

**Como funciona.** Al iniciar sesion, el servidor hace **dos cosas a la vez**:

1. Envia el token en una **cookie `httpOnly`**. El navegador la adjunta sola en cada peticion y **JavaScript no puede leerla**. Por eso el token es inmune a un ataque XSS: aunque alguien lograra inyectar un script en la pagina, no podria robarlo.
2. Devuelve el token tambien en el **cuerpo de la respuesta**, lo que permite usarlo como `Authorization: Bearer <token>` desde Postman.

El middleware `protect` acepta las dos vias: primero busca la cookie y, si no existe, lee la cabecera.

```
const extractToken = (req) => {
  if (req.cookies?.[AUTH_COOKIE_NAME]) return req.cookies[AUTH_COOKIE_NAME];
  const authorization = req.headers.authorization;
  if (authorization?.startsWith('Bearer ')) return authorization.slice(7);
  return null;
};
```

**Por que ambas.** La rubrica pide "almacenamiento seguro del token" y ademas probar la API en Postman. La cookie resuelve lo primero; el Bearer resuelve lo segundo. Cuesta tres lineas y se obtienen las dos cosas.

**El frontend nunca guarda el token.** No lo escribe en `localStorage` ni en ningun sitio: ignora deliberadamente el token que viene en el cuerpo. Al arrancar la aplicacion llama a `GET /api/auth/me` y reconstruye la sesion desde la cookie. Se puede comprobar abriendo las herramientas del navegador: la cookie `token` esta marcada como `HttpOnly` y `localStorage` esta vacio.

**Contrasenas.** Se hashean con bcrypt (10 rondas) en un hook `pre('save')` de Mongoose que solo actua si el campo cambio. Ademas, el modelo define `password` con `select: false` y una transformacion `toJSON` que lo elimina: la contrasena **no puede** salir en una respuesta ni por descuido.

**Cierre de sesion y su limitacion, dicha con honestidad.** Un JWT es *stateless*: el servidor no guarda sesiones. Al cerrar sesion se borra la cookie y se limpia el estado del cliente, pero el token en si sigue siendo criptograficamente valido hasta que expira. Eliminarlo del todo exigiria una lista de revocacion o refresh tokens con rotacion, que quedan fuera del alcance. **Se documenta en lugar de disimularlo**: entender el compromiso vale mas que fingir que no existe.

## Autorizacion por rol

Dos roles, `admin` y `user`, con un middleware parametrizado:

```
export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError('No tiene permisos para realizar esta accion', 403));
  }
  return next();
};
```

El caso "el dueno del prestamo o un administrador" **no** se resuelve con un middleware, sino dentro del servicio, porque necesita el documento ya cargado para saber quien es el dueno. Poner esa comprobacion en un middleware habria obligado a consultar la base de datos dos veces.

## Manejo de errores centralizado

Tres piezas que trabajan juntas y eliminan todos los `try/catch` repetidos:

1. **`AppError`**: una clase de error con `statusCode`, `errors[]` e `isOperational`.
2. **`asyncHandler`**: envuelve cada controlador y captura cualquier promesa rechazada.
   ```
   const asyncHandler = (handler) => (req, res, next) =>
     Promise.resolve(handler(req, res, next)).catch(next);
   ```
3. **`errorHandler`**: el ultimo middleware de la aplicacion. Traduce los errores de infraestructura a respuestas coherentes de la API.

| Error que llega | Respuesta que sale |
|---|---|
| `AppError` | Su propio codigo y mensaje |
| `CastError` de Mongoose | 400 "El identificador enviado no es valido" |
| Clave duplicada (codigo 11000) | 409 "Ya existe un registro con ese campo" |
| `ValidationError` de Mongoose | 400 con el detalle por campo |
| `TokenExpiredError` | 401 "La sesion ha expirado" |
| Cualquier otro | 500, sin filtrar detalles internos |

**El resultado practico:** en todo el backend **no hay un solo `try/catch` dentro de un controlador**. Un servicio simplemente lanza `throw new AppError('No hay ejemplares disponibles', 409)` y el sistema hace el resto.

## Validacion con Zod, no con express-validator

**Por que Zod.** `express-validator` esta atado a Express y no puede reutilizarse en React. Habria obligado a escribir cada regla dos veces, con la garantia de que tarde o temprano se desincronizan. Zod es una libreria independiente: **el mismo esquema valida en los dos lados**.

El middleware `validate` es generico:

```
export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    return next(new AppError('Datos invalidos', 400, errors));
  }
  ...
};
```

Un beneficio adicional: Zod **coacciona y limpia** los datos. `z.coerce.number()` convierte el `page=2` que llega como texto en un numero de verdad, asi que el servicio recibe tipos correctos sin `parseInt` repartidos por el codigo.

## Seguridad y utilidades

| Paquete | Para que |
|---|---|
| `helmet` | Cabeceras de seguridad HTTP |
| `cors` | Permite el origen del frontend con `credentials: true`, obligatorio para que viaje la cookie |
| `cookie-parser` | Leer `req.cookies.token` |
| `express-rate-limit` | Limita el inicio de sesion y el registro a 10 intentos cada 15 minutos, contra ataques de fuerza bruta |
| `morgan` | Registro de peticiones en desarrollo |
| `dotenv` | Carga el archivo `.env`, que **nunca** se sube al repositorio |

**Detalle de CORS que suele fallar:** `credentials: true` es **incompatible** con `origin: '*'`. Hay que declarar el origen exacto. En desarrollo, ademas, Vite hace de proxy de `/api`, con lo que el navegador ve todo como el mismo origen y CORS ni siquiera interviene.

---

# Base de datos

## MongoDB Atlas con Mongoose

Cinco colecciones: `users`, `categories`, `authors`, `books` (entidad principal) y `loans`.

## Referencia frente a documento embebido

Es la pregunta que mas probablemente hara el evaluador.

| Relacion | Decision | Justificacion |
|---|---|---|
| `books.category` | **Referencia** | Una categoria se comparte entre cientos de libros. Si estuviera embebida, renombrar "Ciencia Ficcion" obligaria a actualizar N documentos. Ademas tiene su propio CRUD y se necesita como lista en los filtros y formularios |
| `books.author` | **Referencia** | El mismo razonamiento: entidad con identidad propia y consultas propias |
| `loans` | **Coleccion aparte** | Es una entidad transaccional de crecimiento ilimitado. Embeberla como arreglo dentro de `users` produciria documentos que crecen sin freno, chocaria con el limite de 16 MB por documento y haria **imposible** responder a "todos los prestamos vencidos" sin recorrer todos los usuarios |

Las relaciones se resuelven con `populate`, pidiendo solo los campos necesarios:

```
const BOOK_POPULATE = [
  { path: 'author', select: 'name nationality' },
  { path: 'category', select: 'name' }
];
```

## El contador desnormalizado y la concurrencia

`books.availableCopies` **podria** calcularse contando los prestamos activos. No se hace: ese valor se lee en cada tarjeta de cada pagina del catalogo, y resolverlo con una agregacion por libro en cada peticion seria costoso. Se guarda como contador.

El precio de esa desnormalizacion es mantenerlo consistente. **Aqui esta la parte importante.** Lo ingenuo seria:

```
if (book.availableCopies > 0) {
  book.availableCopies -= 1;
  await book.save();
}
```

Eso tiene una **condicion de carrera**: si dos usuarios piden el ultimo ejemplar a la vez, ambos leen `1`, ambos pasan la comprobacion, y el contador termina en `-1`. La solucion usada mete la condicion **dentro de la propia escritura**, de forma atomica:

```
Book.findOneAndUpdate(
  { _id: bookId, isActive: true, availableCopies: { $gt: 0 } },
  { $inc: { availableCopies: -1 } },
  { new: true }
)
```

MongoDB solo puede satisfacer a uno de los dos; al otro le devuelve `null` y el servicio responde 409. La devolucion aplica la guarda simetrica (`$expr: { $lt: ['$availableCopies', '$totalCopies'] }`) para que el contador nunca supere el total. Y si la creacion del prestamo falla despues de reservar el ejemplar, el servicio lo compensa devolviendolo al stock.

## Indices

| Coleccion | Indice | Para que |
|---|---|---|
| `users` | `email` unico | Impide correos repetidos |
| `books` | `isbn` unico | Impide ISBN repetidos |
| `books` | `{ category, isActive }` | El filtro mas frecuente del catalogo |
| `loans` | `{ dueDate, status }` | Localizar los vencidos |
| `loans` | **`{ user, book }` unico parcial** | Ver abajo |

El ultimo merece atencion. Se declara asi:

```
loanSchema.index(
  { user: 1, book: 1 },
  { unique: true, partialFilterExpression: { status: LOAN_STATUS.ACTIVE } }
);
```

Es **la base de datos**, y no el codigo de la aplicacion, la que garantiza que un usuario no pueda tener dos prestamos activos del mismo libro. Como el indice solo aplica a los documentos con estado `active`, el mismo usuario **si** puede volver a prestar un libro que ya devolvio. Una regla de negocio garantizada a nivel de motor no se puede saltar por un error de programacion.

## Borrado logico

Libros, categorias y autores no se eliminan fisicamente: se marcan con `isActive: false`. Ademas, el sistema **impide** borrar una categoria o un autor que tenga libros asociados, y un libro que tenga prestamos activos, devolviendo 409 con un mensaje claro. Se preserva la integridad referencial sin claves foraneas.

---

# Frontend

## React con Vite

Vite es el servidor de desarrollo y el empaquetador. Aporta arranque casi instantaneo, recarga en caliente y, sobre todo, el **proxy** que evita todo el problema de CORS en desarrollo:

```
server: { proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } } }
```

## Enrutado y proteccion de rutas

React Router v6 con **un unico componente** de guardia, parametrizado por rol:

```
<Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
  <Route element={<MainLayout />}>
    <Route path={PATHS.ADMIN_USERS} element={<UsersPage />} />
    ...
```

`ProtectedRoute` hace tres cosas en orden: si la sesion aun se esta verificando muestra un indicador de carga; si no hay usuario redirige a `/login` recordando a donde queria ir; si el rol no basta, redirige a `/403`.

**Ese primer paso no es un adorno.** Sin el, al pulsar F5 en una ruta privada la aplicacion vería `user = null` durante un instante y expulsaria al usuario al login. Es el error clasico en las aplicaciones con JWT y el flag `isLoading` es lo que lo evita.

Las rutas viven en constantes (`PATHS`), nunca escritas a mano:

```
BOOK_EDIT: (id = ':id') => `/books/${id}/edit`
```

## Estado: sin Redux ni React Query

**Estado global:** solo dos contextos, `AuthContext` (usuario y sesion) y `ToastContext` (notificaciones).

**Estado del servidor:** hooks propios. `useApi` encapsula el ciclo `cargando / datos / error`, y `useCrudList` compone `useApi` + `useDebounce` + paginacion + refresco.

**`useCrudList` es la pieza de reutilizacion mas rentable del frontend**: implementa una sola vez el patron "listar con filtros, buscar, paginar y refrescar", y lo reutilizan **cinco paginas** (catalogo, categorias, autores, usuarios y prestamos). Sin el, ese ciclo estaria copiado cinco veces.

**Por que no Redux.** La aplicacion tiene exactamente dos piezas de estado global. Redux resolveria un problema que aqui no existe, a cambio de mucho codigo repetitivo.

## Cliente HTTP: una sola puerta de salida

`httpClient.js` es una instancia de Axios con dos interceptores:

- En **exito**, devuelve directamente `response.data`, de modo que ningun componente escribe `res.data.data`.
- En **error**, normaliza la respuesta a `{ message, errors, status }`. Y si es un 401 **que no venga del login**, emite un evento que `AuthContext` escucha para cerrar la sesion y redirigir.

**Esa excepcion del login es importante y sutil:** sin ella, escribir mal la contrasena provocaria una redireccion en lugar de mostrar "Las credenciales son incorrectas".

Ningun componente llama a `httpClient` directamente: solo a los modulos `books.api.js`, `loans.api.js`, etc. Si una ruta de la API cambia, **se toca un unico archivo**.

## Formularios controlados y validacion, sin librerias

No se usa Formik ni React Hook Form. El hook `useForm` (unas 100 lineas) resuelve todo:

- Los campos son **controlados**: el valor vive en el estado de React.
- `handleBlur` valida **solo ese campo** al salir de el.
- `handleSubmit` valida el objeto completo y, si falla, no llama a la API.
- Si el backend devuelve un 400 con errores por campo, se vuelcan al formulario.

**Y aqui esta la clave del proyecto:** valida con el **mismo esquema Zod que usa el backend**, importado desde `shared`.

```
import { createBookSchema } from '@biblioteca/shared';
const form = useForm({ initialValues, schema: createBookSchema, onSubmit });
```

Consecuencia practica: la regla "el ISBN debe tener 10 o 13 digitos" **existe una sola vez en todo el sistema**. El mensaje de error que ve el usuario es literalmente el mismo texto tanto si lo bloquea el navegador como si lo bloquea el servidor. Es imposible que se desincronicen.

## Sistema de diseno

Estilos con **CSS Modules** (clases con ambito local, sin colisiones) sobre **variables nativas de CSS**. Sin Tailwind y sin librerias de componentes: el kit es propio.

Toda la capa visual esta separada de la logica, en su propio arbol:

```
frontend/src/styles/
├── base/          variables.css, reset.css, global.css
├── components/    ui/ y layout/
├── layouts/
├── features/
└── pages/
```

**La regla que lo sostiene todo:** `styles/base/variables.css` es el **unico** archivo donde puede aparecer un color literal. En cualquier otro sitio se escribe `var(--color-primary)`, nunca un hexadecimal ni un valor en pixeles suelto. No es una recomendacion: se verifica en cada revision de codigo y esta en la lista de comprobacion de las peticiones de integracion.

**Los componentes se ven iguales porque se programan iguales.** Los 19 componentes comparten el mismo contrato de propiedades: `variant`, `size`, `isLoading`, `disabled`, `hasError`. Detalle concreto: un `Button size="sm"` y un `Input size="sm"` tienen **exactamente la misma altura** porque los dos leen el token `--control-height-sm`. Es lo que hace que un buscador con su boton al lado no quede desalineado.

**Cada patron se construye una sola vez.** Ninguna pagina escribe un `button`, `input`, `select` o `table` nativo. Los formularios se montan siempre con `FormField`, todos los borrados pasan por `ConfirmDialog`, y `DataTable` resuelve por si mismo sus estados de carga, error y vacio: una pagina de administracion **no decide** como se ve un listado cargando, lo decide el sistema.

**Iconografia:** un componente `Icon` con un conjunto cerrado de trazos SVG que heredan el color del contexto. La interfaz no usa emojis en ningun lugar.

Todo esto es inspeccionable dentro de la propia aplicacion, en la seccion de administracion **Sistema de diseno** (`/admin/design-system`), que ademas **lee los valores reales de los tokens en tiempo de ejecucion**, de modo que la documentacion no puede desincronizarse del codigo.

---

# Como se evita la duplicacion de codigo

Es un requisito explicito de la rubrica. Se cumple con siete mecanismos concretos:

1. **`shared/validation/`**: un esquema Zod por entidad, consumido por el middleware `validate()` del backend y por el hook `useForm()` del frontend.
2. **`shared/constants/`**: `ROLES`, `LOAN_STATUS`, `MAX_ACTIVE_LOANS`, `LOAN_DAYS`. La cadena `'admin'` **no se escribe a mano en ningun lugar del proyecto**.
3. **Formato unico de respuesta**: `apiResponse.js` en el backend, interceptor de Axios en el frontend.
4. **Formato unico de error**: `errorHandler` en el backend, `errorMessage.js` en el frontend.
5. **`buildListQuery`**: busqueda, filtros, paginacion y orden implementados **una vez** y reutilizados por los servicios de libros, prestamos y usuarios.
6. **`useCrudList` + `DataTable` + `Modal` + `ConfirmDialog`**: el patron CRUD implementado **una vez**, reutilizado por cinco paginas.
7. **`FormLayout.module.css`**: la rejilla comun a los formularios de libro, categoria y autor.

---

# Postman

La coleccion (`docs/postman/`) cubre los 32 endpoints organizados en siete carpetas, y **no solo el camino feliz**: incluye deliberadamente los casos de error, que es donde se demuestra que la API esta bien construida.

- **401** sin token
- **403** con rol insuficiente
- **400** con datos invalidos
- **404** recurso inexistente
- **409** ISBN duplicado, sin ejemplares disponibles, borrado con dependencias

Un script guarda el token automaticamente en el entorno al iniciar sesion, de modo que la coleccion entera se ejecuta de un tiron con el Collection Runner.

---

# Buenas practicas aplicadas

| Practica | Como se materializa |
|---|---|
| Nombres descriptivos | Identificadores y rutas en ingles, texto de interfaz en espanol. Nunca mezclados |
| Separacion de responsabilidades | Capas del backend con prohibiciones explicitas; estilos separados de la logica |
| Codigo limpio | **Cero comentarios en el codigo.** Cuando un bloque parece necesitar uno, se extrae a una funcion con nombre: `assertBookIsAvailable`, `buildListQuery`, `getFieldErrors` |
| Reutilizacion | 19 componentes, 8 hooks y 7 esquemas compartidos |
| Manejo de errores | Centralizado. Ningun `try/catch` repetido en los controladores |
| Validaciones | En ambos lados, desde un unico esquema |
| Modularizacion | Monorepo de tres paquetes; un modulo de API por recurso |
| Interfaz | Sin emojis en ningun lugar |
