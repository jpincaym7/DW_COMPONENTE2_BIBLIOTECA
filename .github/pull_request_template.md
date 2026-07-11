## Descripcion

Explique brevemente que resuelve este cambio.

Issue relacionado: #

## Tipo de cambio

- [ ] Nueva funcionalidad
- [ ] Correccion de error
- [ ] Refactorizacion
- [ ] Documentacion

## Checklist obligatoria

### Restricciones del proyecto

- [ ] El codigo **no contiene comentarios**
- [ ] El codigo y la interfaz **no contienen emojis**
- [ ] No quedan `console.log` ni codigo muerto

### Sistema de diseno

- [ ] **Ningun valor visual escrito a mano**: cero hexadecimales, cero `rgb(`, cero pixeles sueltos y cero `z-index` numericos fuera de `styles/base/variables.css`. Todo pasa por `var(--token)`
- [ ] **Las dimensiones de los componentes del kit son tokens** (`--modal-width`, `--toast-width`, `--search-width`). La unica excepcion permitida es el `minmax()` de una rejilla de pagina, que es composicion local de esa pantalla y no una decision del sistema
- [ ] **Los archivos de estilo viven en `src/styles/`**, en la carpeta que corresponde a su capa, y no junto al componente
- [ ] **No se creo ningun componente visual fuera de `components/ui/`**, ni se uso un `button`, `input`, `select` o `table` nativo dentro de una pagina
- [ ] Los componentes nuevos respetan el contrato de propiedades (`variant`, `size`, `isLoading`, `disabled`, `hasError`) y tienen sus estados `hover`, `active`, `focus-visible` y `disabled`
- [ ] Los formularios usan `FormField`, los borrados usan `ConfirmDialog` y los mensajes usan `showToast`

### Calidad

- [ ] Los endpoints nuevos estan en la coleccion de Postman y pasan sus pruebas
- [ ] Las validaciones existen en backend **y** frontend, a partir del mismo esquema de `shared`
- [ ] Los errores se manejan con `AppError` y `asyncHandler`, sin bloques `try/catch` sueltos en los controladores
- [ ] No se duplica logica que ya existe en `utils/`, `hooks/` o `shared/`
- [ ] Nombres descriptivos: en ingles en el codigo, en espanol en la interfaz

## Como probarlo

1.
2.
