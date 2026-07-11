# Contrato de la API REST

Base: `http://localhost:5000/api`

## Formato de respuesta

Todas las respuestas, sin excepcion, siguen uno de estos dos formatos.

Exito:

```json
{
  "success": true,
  "message": "Libros obtenidos correctamente",
  "data": [],
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}
```

El campo `meta` solo aparece en los listados paginados.

Error:

```json
{
  "success": false,
  "message": "Datos invalidos",
  "errors": [{ "field": "isbn", "message": "El ISBN debe tener 10 o 13 digitos" }]
}
```

El arreglo `errors` viene vacio cuando el error no es de validacion por campo.

## Codigos de estado

| Codigo | Significado |
|---|---|
| 200 | Operacion exitosa |
| 201 | Recurso creado |
| 400 | Datos invalidos o identificador mal formado |
| 401 | Sin token, token invalido o token expirado |
| 403 | Rol insuficiente o cuenta desactivada |
| 404 | El recurso no existe |
| 409 | Conflicto: duplicado, sin ejemplares, o borrado con dependencias |
| 429 | Demasiados intentos de inicio de sesion |
| 500 | Error interno del servidor |

## Autenticacion

El token se acepta por cookie httpOnly (automatica en el navegador) o por header `Authorization: Bearer <token>` (util en Postman).

| Metodo | Ruta | Auth | Rol | Cuerpo |
|---|---|---|---|---|
| POST | `/auth/register` | No | - | `{ name, email, password }` |
| POST | `/auth/login` | No | - | `{ email, password }` |
| POST | `/auth/logout` | Si | Cualquiera | - |
| GET | `/auth/me` | Si | Cualquiera | - |

`register` y `login` devuelven `{ user, token }` y ademas establecen la cookie.

Ambos endpoints estan limitados a 10 intentos cada 15 minutos por direccion IP.

## Libros (entidad principal)

| Metodo | Ruta | Auth | Rol | Notas |
|---|---|---|---|---|
| GET | `/books` | Si | Cualquiera | Query: `q`, `category`, `author`, `available`, `page`, `limit`, `sort` |
| GET | `/books/:id` | Si | Cualquiera | Incluye autor y categoria poblados |
| POST | `/books` | Si | Administrador | 409 si el ISBN ya existe |
| PUT | `/books/:id` | Si | Administrador | Actualizacion parcial permitida |
| DELETE | `/books/:id` | Si | Administrador | Borrado logico. 409 si tiene prestamos activos |

Cuerpo de creacion:

```json
{
  "title": "Clean Code",
  "isbn": "978-0-13-235088-4",
  "author": "<id del autor>",
  "category": "<id de la categoria>",
  "publisher": "Prentice Hall",
  "publicationYear": 2008,
  "description": "Manual de buenas practicas",
  "coverUrl": "https://ejemplo.com/portada.jpg",
  "totalCopies": 5
}
```

El ISBN se normaliza en el servidor: se eliminan guiones y espacios antes de guardarlo.

`coverUrl` debe ser un **enlace directo al archivo de imagen**, no a la pagina que la contiene. Un enlace a una pagina devuelve `text/html` y el navegador no puede decodificarlo como imagen. El servidor solo valida que sea una URL bien formada, porque no puede saber si el recurso remoto seguira existiendo; la interfaz muestra una vista previa en vivo al escribir el enlace y, si la imagen no carga, sustituye la portada por un icono de respaldo en lugar de dejar un hueco vacio.

`availableCopies` no se envia: el servidor lo inicializa igual a `totalCopies`.

Al actualizar `totalCopies`, el servidor recalcula `availableCopies` respetando los ejemplares ya prestados y devuelve 409 si se intenta reducir por debajo de ellos.

## Categorias y autores

Mismo contrato para ambos recursos.

| Metodo | Ruta | Auth | Rol |
|---|---|---|---|
| GET | `/categories`, `/authors` | Si | Cualquiera |
| GET | `/categories/:id`, `/authors/:id` | Si | Cualquiera |
| POST | `/categories`, `/authors` | Si | Administrador |
| PUT | `/categories/:id`, `/authors/:id` | Si | Administrador |
| DELETE | `/categories/:id`, `/authors/:id` | Si | Administrador |

El borrado es logico y devuelve 409 si existen libros asociados.

## Prestamos

| Metodo | Ruta | Auth | Rol | Notas |
|---|---|---|---|---|
| POST | `/loans` | Si | Cualquiera | Cuerpo: `{ book, dueDate?, notes? }`. El administrador puede enviar `user` |
| GET | `/loans` | Si | Administrador | Query: `status`, `user`, `book`, `page`, `limit` |
| GET | `/loans/me` | Si | Cualquiera | Prestamos del usuario autenticado |
| GET | `/loans/:id` | Si | Dueno o administrador | 403 si no es el dueno |
| PATCH | `/loans/:id/return` | Si | Administrador | 409 si ya fue devuelto |
| DELETE | `/loans/:id` | Si | Administrador | Devuelve el ejemplar al stock si estaba activo |

Reglas de negocio verificadas por el servidor:

- 409 si no hay ejemplares disponibles.
- 409 si el usuario ya tiene un prestamo activo de ese mismo libro (garantizado por un indice unico parcial).
- 409 si el usuario alcanzo el maximo de prestamos activos simultaneos.
- La fecha de devolucion se calcula por defecto a catorce dias.
- Un prestamo activo cuya fecha de devolucion ya paso se reporta con estado `overdue`.

## Usuarios

| Metodo | Ruta | Auth | Rol | Cuerpo |
|---|---|---|---|---|
| GET | `/users` | Si | Administrador | Query: `q`, `role`, `page`, `limit` |
| GET | `/users/:id` | Si | Administrador | - |
| PATCH | `/users/:id/role` | Si | Administrador | `{ "role": "admin" \| "user" }` |
| PATCH | `/users/:id/status` | Si | Administrador | `{ "isActive": true \| false }` |

Un administrador no puede modificar su propio rol ni desactivar su propia cuenta, y el sistema impide desactivar al ultimo administrador activo.

## Estadisticas

| Metodo | Ruta | Auth | Rol | Respuesta |
|---|---|---|---|---|
| GET | `/stats/summary` | Si | Administrador | `{ totalBooks, totalUsers, activeLoans, overdueLoans, topCategories }` |
| GET | `/stats/me` | Si | Cualquiera | `{ activeLoans, overdueLoans, returnedLoans, availableBooks }` |

## Salud del servicio

| Metodo | Ruta | Auth |
|---|---|---|
| GET | `/health` | No |
