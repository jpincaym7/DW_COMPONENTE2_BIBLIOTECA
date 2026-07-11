# Sistema de Gestion de Biblioteca

Sistema web completo para la administracion de un catalogo de libros y el control de prestamos, desarrollado con el stack MERN.

## Stack tecnologico

| Capa | Tecnologia |
|---|---|
| Frontend | React 18, React Router 6, Vite, CSS Modules |
| Backend | Node.js, Express 4 |
| Base de datos | MongoDB Atlas (Mongoose 8) |
| Autenticacion | JWT en cookie httpOnly, con soporte de header Bearer |
| Validacion | Zod (esquemas compartidos entre frontend y backend) |
| Pruebas de API | Postman |
| Diseno | Figma |
| Control de versiones | Git y GitHub |

## Estructura del proyecto

Monorepo con npm workspaces y tres paquetes.

```
DESARROLLO-WEB/
├── shared/      Constantes y esquemas Zod compartidos por backend y frontend
├── backend/     API REST en Node.js + Express
├── frontend/    Aplicacion React
└── docs/        Contrato de API, modelo de datos, Figma y coleccion de Postman
```

El paquete `shared` es la pieza que evita duplicar codigo: define **un solo esquema de validacion por entidad**, que el backend usa en su middleware `validate()` y el frontend usa en el hook `useForm()`. Una unica definicion de cada regla y de cada mensaje de error.

### Backend

```
backend/src/
├── config/       Variables de entorno, conexion a la base de datos, CORS
├── models/       Esquemas de Mongoose con sus indices
├── routes/       Metodo, ruta y cadena de middlewares
├── controllers/  Leen la peticion, llaman al servicio y responden
├── services/     Reglas de negocio y consultas
├── middlewares/  Autenticacion, autorizacion, validacion, manejo de errores
├── utils/        AppError, asyncHandler, respuestas, JWT, cookies, consultas
└── seeds/        Carga de datos iniciales
```

### Frontend

```
frontend/src/
├── api/          Cliente HTTP centralizado y un modulo por recurso
├── context/      AuthContext y ToastContext
├── hooks/        useAuth, useForm, useApi, useCrudList, useDebounce, useModal, useToast
├── routes/       Router, rutas protegidas y constantes de rutas
├── layouts/      MainLayout y AuthLayout
├── components/   Kit de UI reutilizable, componentes de layout e iconos SVG
├── features/     Componentes de dominio (libros, prestamos, categorias, autores, auth)
├── pages/        Una pagina por ruta
├── utils/        Formateadores y normalizacion de errores
└── styles/       Toda la capa visual, separada de la logica
```

### La capa de estilos

Los archivos de estilo **no se mezclan con los componentes**. Viven en su propio arbol, que espeja la estructura de la aplicacion, de modo que para cada archivo de estilo se identifica de inmediato a que pertenece.

```
frontend/src/styles/
├── base/                 Fundamentos que se cargan una sola vez
│   ├── variables.css     Tokens de diseno. Unica fuente de verdad de la capa visual
│   ├── reset.css         Normalizacion del navegador
│   └── global.css        Estilos globales. Importa variables y reset
├── components/
│   ├── ui/               Un modulo por componente del kit reutilizable
│   └── layout/           Navbar, Sidebar, PageHeader, Footer
├── layouts/              MainLayout y AuthLayout
├── features/
│   ├── auth/             Formularios de inicio de sesion y registro
│   ├── books/            Tarjeta y filtros del catalogo
│   └── shared/           FormLayout, la rejilla comun a todos los formularios de entidad
└── pages/                Un modulo por pagina que necesite estilos propios
```

Cada componente importa unicamente su propio modulo. Por ejemplo, `components/ui/Button.jsx` importa `styles/components/ui/Button.module.css`.

`features/shared/FormLayout.module.css` merece una nota: es la rejilla de formulario (`.form`, `.grid`, `.actions`) que comparten los formularios de libro, categoria y autor. Antes cada uno de ellos importaba el CSS del formulario de libros, lo que acoplaba tres entidades distintas a una de ellas. Extraerlo a `shared` elimina ese acoplamiento y deja explicito que es un recurso comun, no propiedad de una entidad.

## Requisitos previos

- Node.js 18 o superior
- Una cuenta de MongoDB Atlas con un cluster creado
- La IP de cada integrante agregada en Network Access de Atlas

## Instalacion

```bash
git clone <url-del-repositorio>
cd DESARROLLO-WEB
npm install
```

El `npm install` debe ejecutarse **en la raiz**: es lo que crea los enlaces entre los tres workspaces.

## Configuracion

Copie los archivos de ejemplo y complete los valores.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Variables del backend (`backend/.env`):

| Variable | Descripcion |
|---|---|
| `PORT` | Puerto de la API. Por defecto 5000 |
| `NODE_ENV` | `development` o `production` |
| `MONGODB_URI` | Cadena de conexion de MongoDB Atlas |
| `JWT_SECRET` | Cadena larga y aleatoria para firmar los tokens |
| `JWT_EXPIRES_IN` | Vigencia del token. Por defecto `7d` |
| `CLIENT_URL` | Origen del frontend, para CORS |
| `SEED_*` | Credenciales de las cuentas de demostracion |

El archivo `.env` **no se sube al repositorio**. El `JWT_SECRET` real nunca debe entrar a Git.

## Ejecucion

```bash
npm run seed      # Carga categorias, autores, libros y usuarios de demostracion
npm run dev:api   # Levanta la API en http://localhost:5000
npm run dev:web   # Levanta el frontend en http://localhost:5173
```

Ejecute `dev:api` y `dev:web` en dos terminales distintas.

En desarrollo, Vite hace proxy de `/api` hacia el backend, asi que el navegador ve todo como un mismo origen y CORS no interviene.

### Credenciales de demostracion

| Rol | Correo | Contrasena |
|---|---|---|
| Administrador | `admin@biblioteca.com` | `Admin1234` |
| Usuario | `usuario@biblioteca.com` | `Usuario1234` |

## Autenticacion

El token JWT se entrega por **dos vias simultaneas**:

1. **Cookie httpOnly** (mecanismo principal). El navegador la envia automaticamente y JavaScript no puede leerla, por lo que el token es inmune a ataques XSS. El frontend nunca guarda el token en `localStorage`: reconstruye la sesion llamando a `GET /api/auth/me` al iniciar.
2. **Header `Authorization: Bearer`** (mecanismo secundario). El login tambien devuelve el token en el cuerpo de la respuesta, lo que permite probar la API comodamente desde Postman.

El middleware `protect` acepta ambas vias: primero busca la cookie y, si no existe, lee el header.

### Sobre el cierre de sesion

Un JWT es **stateless**: el servidor no guarda sesiones. Al cerrar sesion, el backend borra la cookie y el frontend limpia su estado, pero el token en si sigue siendo criptograficamente valido hasta que expira. Mitigarlo por completo exigiria una lista de revocacion o refresh tokens con rotacion, lo que queda fuera del alcance de este proyecto. Se documenta de forma explicita por transparencia.

## Modelo de datos

Cinco colecciones: `users`, `categories`, `authors`, `books` (entidad principal) y `loans`.

Decisiones de diseno relevantes:

- **`category` y `author` van por referencia, no embebidos.** Se comparten entre muchos libros, tienen CRUD propio y se necesitan como listas para los filtros. Embeberlos obligaria a actualizar N documentos al renombrar uno.
- **`loans` es una coleccion aparte.** Es una entidad transaccional de crecimiento ilimitado; embeberla como arreglo dentro de `users` chocaria con el limite de 16 MB por documento y haria inviable consultar los prestamos vencidos.
- **`availableCopies` es un contador desnormalizado** dentro de `books`, para no tener que contar prestamos en cada listado del catalogo. Se mantiene consistente con actualizaciones atomicas condicionales (`findOneAndUpdate` con guarda `availableCopies > 0`), no con lectura y escritura por separado.
- **Indice unico parcial** sobre `{ user, book }` cuando `status` es `active`: la base de datos garantiza que un usuario no pueda tener dos prestamos activos del mismo libro.

El detalle completo esta en [docs/modelo-datos.md](docs/modelo-datos.md).

## API REST

El contrato completo, con todos los endpoints, codigos de estado y ejemplos, esta en [docs/api-contract.md](docs/api-contract.md).

Todas las respuestas siguen el mismo formato:

```json
{ "success": true, "message": "...", "data": {}, "meta": {} }
```

```json
{ "success": false, "message": "...", "errors": [{ "field": "isbn", "message": "..." }] }
```

## Postman

La coleccion y el entorno estan en [docs/postman/](docs/postman/).

1. Importe `biblioteca.postman_collection.json` y `biblioteca.postman_environment.json`.
2. Seleccione el entorno **Biblioteca Local**.
3. Ejecute la peticion **Login administrador**: un script guarda automaticamente el token en el entorno.
4. El resto de peticiones ya heredan la autenticacion `Bearer {{token}}`.

La coleccion cubre el camino feliz y **tambien los casos de error**: 401 sin token, 403 con rol insuficiente, 400 con datos invalidos, 404 y 409 (ISBN duplicado, sin ejemplares, borrado con dependencias).

## Diseno

El prototipo de Figma y el sistema de diseno estan documentados en [docs/figma.md](docs/figma.md).

La aplicacion incluye una ruta interna `/styleguide` que renderiza **todos** los componentes del kit con sus variantes, tamanios y estados. Es el espejo del frame de Design System de Figma y sirve para detectar cualquier incoherencia visual de un vistazo.

### Reglas del sistema de diseno

- `frontend/src/styles/base/variables.css` es la **unica** fuente de verdad de la capa visual y el unico archivo donde puede aparecer un color literal. En cualquier otro archivo de estilos se usa siempre `var(--token)`.
- Todos los componentes del kit comparten el mismo contrato de propiedades: `variant`, `size`, `isLoading`, `disabled`, `hasError`.
- Un `Button size="sm"` y un `Input size="sm"` tienen exactamente la misma altura, porque ambos la toman del token `--control-height-sm`.
- Ninguna pagina escribe elementos `button`, `input`, `select` o `table` nativos: siempre pasa por el kit.
- Los formularios usan `FormField`, los borrados usan `ConfirmDialog` y los mensajes usan `showToast`. No hay dos maneras de hacer lo mismo.
- La iconografia se resuelve con SVG en linea a traves del componente `Icon`.

## Convenciones de codigo

- **Identificadores, modelos, rutas y campos: en ingles.** **Texto visible al usuario: en espanol.**
- **El codigo no lleva comentarios.** Cuando un bloque parece necesitar uno, se extrae a una funcion con nombre descriptivo.
- Validaciones en **ambos lados**, a partir del mismo esquema de `shared`.
- Los errores se manejan de forma centralizada con `AppError`, `asyncHandler` y el middleware `errorHandler`. No hay bloques `try/catch` repetidos en los controladores.

## Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev:api` | Levanta la API con recarga en caliente |
| `npm run dev:web` | Levanta el frontend |
| `npm run seed` | Reinicia la base de datos con los datos de demostracion |
| `npm run build` | Compila el frontend para produccion |
