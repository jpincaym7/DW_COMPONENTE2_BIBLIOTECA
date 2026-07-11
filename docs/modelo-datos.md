# Modelo de datos

Base de datos: MongoDB Atlas. Cinco colecciones.

## users

| Campo | Tipo | Reglas |
|---|---|---|
| `_id` | ObjectId | Clave primaria |
| `name` | String | Obligatorio, entre 3 y 60 caracteres |
| `email` | String | Obligatorio, unico, en minusculas |
| `password` | String | Obligatorio, hash bcrypt con 10 rondas, `select: false` |
| `role` | String | `admin` o `user`. Por defecto `user` |
| `isActive` | Boolean | Por defecto `true` |
| `createdAt`, `updatedAt` | Date | Automaticos |

Indices: `email` unico.

La contrasena se hashea en un hook `pre('save')` que solo actua si el campo fue modificado. La transformacion `toJSON` elimina `password` y `__v`, de modo que la contrasena nunca puede salir en una respuesta aunque se olvide excluirla en una consulta.

## categories

| Campo | Tipo | Reglas |
|---|---|---|
| `name` | String | Obligatorio, unico, entre 3 y 40 caracteres |
| `description` | String | Hasta 200 caracteres |
| `isActive` | Boolean | Por defecto `true`. Permite el borrado logico |

Indices: `name` unico.

## authors

| Campo | Tipo | Reglas |
|---|---|---|
| `name` | String | Obligatorio, unico, entre 3 y 80 caracteres |
| `nationality` | String | Opcional |
| `birthYear` | Number | Opcional |
| `isActive` | Boolean | Por defecto `true` |

Indices: `name` unico.

## books (entidad principal)

| Campo | Tipo | Reglas |
|---|---|---|
| `title` | String | Obligatorio, entre 2 y 150 caracteres |
| `isbn` | String | Obligatorio, unico, 10 o 13 digitos |
| `author` | ObjectId | Referencia a `authors`, obligatorio |
| `category` | ObjectId | Referencia a `categories`, obligatorio |
| `publisher` | String | Opcional |
| `publicationYear` | Number | Obligatorio, no anterior a 1450 ni posterior al ano actual |
| `description` | String | Hasta 1000 caracteres |
| `coverUrl` | String | Opcional |
| `totalCopies` | Number | Obligatorio, minimo 1 |
| `availableCopies` | Number | Obligatorio, minimo 0 |
| `isActive` | Boolean | Por defecto `true`. Permite el borrado logico |

Indices:

- `isbn` unico
- `title`
- `{ category, isActive }` compuesto, que es el filtro mas frecuente del catalogo
- `{ author, isActive }` compuesto

## loans

| Campo | Tipo | Reglas |
|---|---|---|
| `book` | ObjectId | Referencia a `books`, obligatorio |
| `user` | ObjectId | Referencia a `users`, obligatorio |
| `loanDate` | Date | Por defecto, la fecha actual |
| `dueDate` | Date | Obligatorio. Por defecto, catorce dias despues |
| `returnDate` | Date | Nulo hasta la devolucion |
| `status` | String | `active`, `returned` u `overdue` |
| `notes` | String | Hasta 300 caracteres |

Indices:

- `{ user, status }`
- `{ book, status }`
- `{ dueDate, status }`, para localizar los vencidos
- `{ user, book }` **unico parcial**, con `partialFilterExpression: { status: 'active' }`

Este ultimo indice merece atencion: es la base de datos, y no el codigo de la aplicacion, la que garantiza que un usuario no pueda tener dos prestamos activos del mismo libro. El indice solo aplica a los documentos con estado `active`, por lo que el mismo usuario si puede volver a prestar un libro que ya devolvio.

## Decisiones de diseno

### Referencia frente a documento embebido

| Relacion | Decision | Motivo |
|---|---|---|
| `books.category` | Referencia | Una categoria se comparte entre muchos libros. Si estuviera embebida, renombrarla obligaria a actualizar N documentos. Ademas tiene CRUD propio y se necesita como lista para los filtros y los formularios |
| `books.author` | Referencia | El mismo razonamiento. Es una entidad con identidad propia y consultas propias |
| `loans` | Coleccion aparte | Es una entidad transaccional cuyo numero crece sin limite. Embeberla como un arreglo dentro de `users` produciria documentos que crecen indefinidamente, chocaria con el limite de 16 MB por documento y haria imposible responder a la consulta "todos los prestamos vencidos" sin recorrer todos los usuarios |

### El contador desnormalizado

`availableCopies` podria calcularse contando los prestamos activos de cada libro. No se hace, porque ese valor se lee en cada tarjeta de cada pagina del catalogo, y resolverlo con una agregacion por libro en cada peticion seria costoso.

El precio de esa desnormalizacion es que el contador debe mantenerse consistente. Se logra con **actualizaciones atomicas condicionales**, nunca con una lectura seguida de una escritura:

```
Book.findOneAndUpdate(
  { _id: bookId, isActive: true, availableCopies: { $gt: 0 } },
  { $inc: { availableCopies: -1 } },
  { new: true }
)
```

La condicion `availableCopies > 0` viaja dentro de la propia operacion de escritura. Si dos usuarios solicitan el ultimo ejemplar al mismo tiempo, MongoDB solo puede satisfacer a uno: al otro le devuelve `null` y el servicio responde 409. Un enfoque de leer, restar y guardar permitiria que ambos pasaran la comprobacion y el contador quedaria en negativo.

La devolucion aplica la guarda simetrica, para que el contador nunca supere el total:

```
{ _id: bookId, $expr: { $lt: ['$availableCopies', '$totalCopies'] } }
```

Si la creacion del prestamo falla despues de haber reservado el ejemplar, el servicio compensa devolviendolo al stock.
