# Diseno y sistema de diseno

## Prototipo de Figma

Enlace al prototipo: _pendiente de completar por el grupo_

El prototipo debe elaborarse **antes** de escribir el codigo de la interfaz, y el commit que agrega el enlace debe ser anterior a los commits de las paginas.

## Contenido minimo del prototipo

### Frame 0: sistema de diseno

Es el frame mas importante. Todo lo que contiene se traduce despues, token por token, al archivo `frontend/src/styles/base/variables.css`.

- **Paleta**: color de marca (con sus estados normal, hover y activo), colores semanticos (exito, advertencia, error, informacion) y una escala de nueve neutros. Cada combinacion de texto sobre fondo debe verificarse con un contraste minimo de 4.5:1.
- **Tipografia**: familia tipografica y escala de siete tamanos (12, 14, 16, 18, 20, 24 y 32 pixeles), con sus pesos y alturas de linea.
- **Espaciado**: rejilla de 4 pixeles. No existen valores intermedios como 13 o 15 pixeles.
- **Radios, sombras y anillo de foco.**
- **Componentes dibujados**, cada uno con todas sus variantes y todos sus estados (normal, hover, activo, foco, deshabilitado, cargando y error): boton, boton de icono, campo de texto, seleccion, area de texto, casilla de verificacion, campo de formulario, etiqueta, aviso, tarjeta, modal, dialogo de confirmacion, fila de tabla, paginacion, notificacion, indicador de carga y estado vacio.

**Iconografia**: se usa un conjunto de iconos SVG de trazo (estilo Feather o Lucide), de 24 por 24 pixeles. **No se utilizan emojis en ninguna parte de la interfaz.**

### Pantallas

Version de escritorio de 1440 pixeles para todas, y version movil de 375 pixeles al menos para las cuatro principales.

1. Inicio de sesion
2. Registro
3. Panel principal del usuario
4. Panel principal del administrador
5. Catalogo, con buscador, filtros y paginacion
6. Detalle del libro, con la accion de solicitar prestamo
7. Formulario de libro, mostrando el estado de error de validacion en al menos un campo
8. Mis prestamos
9. Gestion de prestamos del administrador
10. Gestion de categorias, con el modal de creacion y edicion
11. Gestion de autores
12. Gestion de usuarios
13. Dialogo de confirmacion de borrado
14. Estados transversales: cargando, vacio y error
15. Acceso denegado y pagina no encontrada

### Prototipo interactivo

Dos flujos navegables:

- `Inicio de sesion -> Panel principal -> Catalogo -> Detalle del libro -> Solicitar prestamo -> Mis prestamos`
- `Inicio de sesion como administrador -> Catalogo -> Nuevo libro -> Confirmacion`

## Trazabilidad entre Figma y el codigo

Cada token de Figma tiene su contraparte exacta en `frontend/src/styles/base/variables.css`, con el mismo nombre. Cada componente dibujado en Figma existe en `frontend/src/components/ui/` con las mismas variantes y los mismos estados.

Si algo se ve distinto en el navegador que en Figma, uno de los dos esta mal y se corrige. No se acepta la divergencia.

## La seccion Sistema de diseno

La aplicacion incluye una seccion de administracion, **Sistema de diseno** (`/admin/design-system`), accesible desde el menu lateral con el rol de administrador.

Documenta la interfaz desde dentro de la propia aplicacion: la paleta completa con sus valores, la escala tipografica, el espaciado, los radios, las sombras, las capas de superposicion, las alturas de control, la iconografia y **todos** los componentes del kit con todas sus variantes, tamanos y estados, incluidos los de carga, error y vacio.

No es una maqueta estatica. La pagina **lee los valores reales de los tokens en tiempo de ejecucion** con `getComputedStyle` sobre el elemento raiz, asi que la documentacion no puede desincronizarse del codigo: si alguien cambia `--color-primary`, la pagina lo refleja de inmediato.

Es el espejo del frame de sistema de diseno de Figma. Abrir ambos en paralelo y compararlos es la forma de detectar, de un vistazo, que dos componentes no combinan entre si.

## Reglas que impiden la deriva visual

El objetivo es que ninguna pantalla se vea distinta de las demas. Eso no se consigue con disciplina, sino eliminando la posibilidad de desviarse.

1. **Ningun valor visual se escribe a mano.** `styles/base/variables.css` es el unico archivo del proyecto donde puede aparecer un color literal. En cualquier otro archivo de estilos se escribe siempre `var(--token)`, nunca un hexadecimal, un valor en pixeles suelto ni un `z-index` numerico. Si hace falta un valor que no esta en la escala, se discute el token; no se rodea la regla.

   Las dimensiones de los componentes del kit tambien son tokens (`--modal-width`, `--toast-width`, `--search-width`, `--cover-height-md`), porque son decisiones del sistema: dos modales deben medir lo mismo. La unica excepcion es el `minmax()` de una rejilla de pagina, que describe como se compone esa pantalla concreta y no forma parte del vocabulario compartido.

2. **Los componentes se ven iguales porque se programan iguales.** Todo el kit comparte el mismo contrato de propiedades: `variant`, `size`, `isLoading`, `disabled`, `fullWidth`, `hasError`. El vocabulario de variantes es el mismo en todos los componentes. Un `Button size="sm"` y un `Input size="sm"` tienen exactamente la misma altura, porque ambos la toman del token `--control-height-sm`.

3. **Cada patron se construye una sola vez.** Ninguna pagina escribe un `button`, `input`, `select` o `table` nativo. Los formularios se montan siempre con `FormField`. Todos los borrados pasan por `ConfirmDialog`. Todos los mensajes de resultado pasan por `showToast`. Los estados de carga, vacio y error de un listado los pinta el propio `DataTable`: una pagina de administracion no decide como se ve el estado de carga, lo decide el sistema.

4. **El sistema de diseno se construye antes que las paginas.** Empezar por las pantallas y unificar los estilos al final es exactamente lo que produce que cada componente termine viendose diferente.
