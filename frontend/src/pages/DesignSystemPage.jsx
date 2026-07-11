import { ICON_NAMES, Icon } from '../components/icons/Icon.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Alert } from '../components/ui/Alert.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Checkbox } from '../components/ui/Checkbox.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { FormField } from '../components/ui/FormField.jsx';
import { IconButton } from '../components/ui/IconButton.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { SearchInput } from '../components/ui/SearchInput.jsx';
import { Select } from '../components/ui/Select.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Textarea } from '../components/ui/Textarea.jsx';
import { ColorScale, ColorSwatchGrid } from '../features/design-system/ColorSwatch.jsx';
import {
  DesignGroup,
  DesignRow,
  DesignSection,
  DesignStack
} from '../features/design-system/DesignSection.jsx';
import {
  ControlHeightPreview,
  FontSizePreview,
  FontWeightPreview,
  RadiusPreview,
  ShadowPreview,
  SpacingPreview,
  TokenList,
  WidthPreview
} from '../features/design-system/TokenList.jsx';
import {
  BRAND_COLORS,
  CONTROL_TOKENS,
  LAYER_TOKENS,
  MOTION_TOKENS,
  NEUTRAL_COLORS,
  RADIUS_TOKENS,
  SEMANTIC_COLORS,
  SHADOW_TOKENS,
  SIZE_TOKENS,
  SPACING_TOKENS,
  SURFACE_COLORS,
  TYPOGRAPHY_TOKENS,
  WEIGHT_TOKENS
} from '../features/design-system/tokens.js';
import { useModal } from '../hooks/useModal.js';
import { useToast } from '../hooks/useToast.js';
import sharedStyles from '../styles/features/design-system/DesignSystem.module.css';
import styles from '../styles/pages/DesignSystemPage.module.css';

const RULES = [
  {
    title: 'Ningun valor visual se escribe a mano',
    text: 'Los colores, espaciados, tipografias, radios y sombras salen siempre de un token. El archivo styles/base/variables.css es el unico lugar del proyecto donde puede aparecer un color literal.'
  },
  {
    title: 'Los componentes se ven iguales porque se programan iguales',
    text: 'Todo el kit comparte el mismo contrato de propiedades: variant, size, isLoading, disabled y hasError. Un boton pequenio y un campo pequenio miden lo mismo porque ambos leen el token --control-height-sm.'
  },
  {
    title: 'Cada patron se construye una sola vez',
    text: 'Ninguna pantalla escribe un boton, un campo o una tabla nativos. Los formularios usan FormField, los borrados usan ConfirmDialog y los avisos usan el sistema de notificaciones.'
  },
  {
    title: 'El sistema se construye antes que las pantallas',
    text: 'Disenar las pantallas primero y unificar los estilos al final es exactamente lo que produce que cada componente termine viendose distinto.'
  }
];

const SECTIONS = [
  { id: 'color', label: 'Color' },
  { id: 'tipografia', label: 'Tipografia' },
  { id: 'espaciado', label: 'Espaciado' },
  { id: 'formas', label: 'Formas y elevacion' },
  { id: 'medidas', label: 'Medidas' },
  { id: 'iconografia', label: 'Iconografia' },
  { id: 'acciones', label: 'Acciones' },
  { id: 'formularios', label: 'Formularios' },
  { id: 'retroalimentacion', label: 'Retroalimentacion' },
  { id: 'datos', label: 'Datos' },
  { id: 'superposiciones', label: 'Superposiciones' }
];

const VARIANTS = ['primary', 'secondary', 'danger', 'ghost'];
const SIZES = ['sm', 'md', 'lg'];
const SEMANTIC_VARIANTS = ['success', 'warning', 'danger', 'info', 'neutral'];

const SAMPLE_COLUMNS = [
  { key: 'title', header: 'Titulo' },
  { key: 'author', header: 'Autor' },
  {
    key: 'status',
    header: 'Estado',
    align: 'center',
    render: () => <Badge variant="success">Disponible</Badge>
  }
];

const SAMPLE_ROWS = [
  { _id: '1', title: 'Clean Code', author: 'Robert C. Martin' },
  { _id: '2', title: 'Dune', author: 'Frank Herbert' }
];

const SELECT_OPTIONS = [
  { value: 'novela', label: 'Novela' },
  { value: 'tecnologia', label: 'Tecnologia' }
];

export const DesignSystemPage = () => {
  const modal = useModal();
  const confirmDialog = useModal();
  const { showToast } = useToast();

  return (
    <>
      <PageHeader
        title="Sistema de diseno"
        subtitle="Referencia unica de los tokens y componentes que construyen la interfaz"
      />

      <div className={styles.intro}>
        <Card title="Reglas que impiden la deriva visual">
          <div className={styles.rules}>
            {RULES.map((rule, index) => (
              <div key={rule.title} className={styles.rule}>
                <span className={styles.ruleNumber}>{index + 1}</span>
                <span>
                  <span className={styles.ruleTitle}>{rule.title}. </span>
                  <span className={styles.ruleText}>{rule.text}</span>
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <nav className={styles.index} aria-label="Secciones del sistema de diseno">
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`} className={styles.indexLink}>
            {section.label}
          </a>
        ))}
      </nav>

      <DesignSection
        id="color"
        title="Color"
        description="Los componentes consumen unicamente los colores semanticos. La escala de neutros es la capa primitiva que los alimenta y no se usa directamente."
      >
        <DesignGroup title="Marca">
          <ColorSwatchGrid colors={BRAND_COLORS} />
        </DesignGroup>

        <DesignGroup title="Semanticos">
          <ColorSwatchGrid colors={SEMANTIC_COLORS} />
        </DesignGroup>

        <DesignGroup title="Superficies y texto">
          <ColorSwatchGrid colors={SURFACE_COLORS} />
        </DesignGroup>

        <DesignGroup title="Escala de neutros">
          <ColorScale colors={NEUTRAL_COLORS} />
        </DesignGroup>
      </DesignSection>

      <DesignSection
        id="tipografia"
        title="Tipografia"
        description="Siete tamanios y cuatro pesos. Cualquier texto de la aplicacion usa uno de ellos."
      >
        <DesignGroup title="Tamanios">
          <TokenList tokens={TYPOGRAPHY_TOKENS} renderPreview={FontSizePreview} />
        </DesignGroup>

        <DesignGroup title="Pesos">
          <TokenList tokens={WEIGHT_TOKENS} renderPreview={FontWeightPreview} />
        </DesignGroup>
      </DesignSection>

      <DesignSection
        id="espaciado"
        title="Espaciado"
        description="Rejilla de cuatro pixeles. No existen valores intermedios: si un margen necesita trece pixeles, la respuesta es revisar el diseno, no escribir el valor a mano."
      >
        <TokenList tokens={SPACING_TOKENS} renderPreview={SpacingPreview} />
      </DesignSection>

      <DesignSection
        id="formas"
        title="Formas y elevacion"
        description="Tres sombras y cuatro radios. La sombra mayor esta reservada para los elementos que flotan sobre el contenido."
      >
        <DesignGroup title="Radios">
          <TokenList tokens={RADIUS_TOKENS} renderPreview={RadiusPreview} />
        </DesignGroup>

        <DesignGroup title="Sombras">
          <TokenList tokens={SHADOW_TOKENS} renderPreview={ShadowPreview} />
        </DesignGroup>

        <DesignGroup title="Capas">
          <TokenList tokens={LAYER_TOKENS} />
        </DesignGroup>

        <DesignGroup title="Movimiento">
          <TokenList tokens={MOTION_TOKENS} />
        </DesignGroup>
      </DesignSection>

      <DesignSection
        id="medidas"
        title="Medidas"
        description="Las alturas de control son el motivo por el que un boton y un campo del mismo tamanio quedan alineados al ponerlos uno junto al otro."
      >
        <DesignGroup title="Altura de los controles">
          <TokenList tokens={CONTROL_TOKENS} renderPreview={ControlHeightPreview} />
        </DesignGroup>

        <DesignGroup title="Anchos del sistema">
          <TokenList tokens={SIZE_TOKENS} renderPreview={WidthPreview} />
        </DesignGroup>
      </DesignSection>

      <DesignSection
        id="iconografia"
        title="Iconografia"
        description="Un unico componente Icon con un conjunto cerrado de trazos SVG que heredan el color del contexto. La interfaz no utiliza emojis en ningun lugar."
      >
        <div className={sharedStyles.iconGrid}>
          {ICON_NAMES.map((name) => (
            <div key={name} className={sharedStyles.iconCell}>
              <Icon name={name} size="lg" />
              <span className={sharedStyles.iconName}>{name}</span>
            </div>
          ))}
        </div>
      </DesignSection>

      <DesignSection
        id="acciones"
        title="Acciones"
        description="Cuatro variantes y tres tamanios. La variante indica la importancia de la accion, no su color."
      >
        <DesignStack>
          <DesignGroup title="Variantes">
            <DesignRow>
              {VARIANTS.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant}
                </Button>
              ))}
            </DesignRow>
          </DesignGroup>

          <DesignGroup title="Tamanios">
            <DesignRow>
              {SIZES.map((size) => (
                <Button key={size} size={size}>
                  Tamanio {size}
                </Button>
              ))}
              {SIZES.map((size) => (
                <IconButton key={size} icon="edit" label={`Editar ${size}`} size={size} />
              ))}
            </DesignRow>
          </DesignGroup>

          <DesignGroup title="Estados">
            <DesignRow>
              <Button>Normal</Button>
              <Button isLoading>Cargando</Button>
              <Button disabled>Deshabilitado</Button>
              <Button variant="danger">Destructivo</Button>
              <Button variant="danger" disabled>
                Destructivo deshabilitado
              </Button>
              <IconButton icon="trash" label="Eliminar" variant="danger" />
            </DesignRow>
          </DesignGroup>

          <DesignGroup title="Alineacion entre controles">
            <DesignRow>
              <SearchInput value="" onChange={() => {}} placeholder="Buscar" />
              <Button>Buscar</Button>
              <Select options={SELECT_OPTIONS} placeholder="Filtrar" onChange={() => {}} value="" />
            </DesignRow>
          </DesignGroup>
        </DesignStack>
      </DesignSection>

      <DesignSection
        id="formularios"
        title="Formularios"
        description="Todo campo se monta con FormField, que resuelve la etiqueta, el mensaje de error y la accesibilidad. Por eso un error de validacion se ve identico en todas las pantallas."
      >
        <div className={sharedStyles.formGrid}>
          <FormField label="Campo normal" name="normal">
            {(fieldProps) => <Input {...fieldProps} placeholder="Texto de ejemplo" />}
          </FormField>

          <FormField label="Campo obligatorio" name="obligatorio" required>
            {(fieldProps) => <Input {...fieldProps} placeholder="Texto de ejemplo" />}
          </FormField>

          <FormField label="Campo con ayuda" name="ayuda" hint="Texto de apoyo para el usuario">
            {(fieldProps) => <Input {...fieldProps} placeholder="Texto de ejemplo" />}
          </FormField>

          <FormField label="Campo con error" name="error" error="Este campo es obligatorio">
            {(fieldProps) => <Input {...fieldProps} placeholder="Texto de ejemplo" />}
          </FormField>

          <FormField label="Campo deshabilitado" name="deshabilitado">
            {(fieldProps) => <Input {...fieldProps} placeholder="No editable" disabled />}
          </FormField>

          <FormField label="Seleccion" name="seleccion">
            {(fieldProps) => <Select {...fieldProps} options={SELECT_OPTIONS} />}
          </FormField>

          <FormField label="Seleccion con error" name="seleccionError" error="Seleccione una opcion">
            {(fieldProps) => <Select {...fieldProps} options={SELECT_OPTIONS} />}
          </FormField>

          <FormField label="Area de texto" name="descripcion">
            {(fieldProps) => <Textarea {...fieldProps} placeholder="Descripcion" />}
          </FormField>
        </div>

        <DesignRow>
          <Checkbox label="Casilla de verificacion" />
          <Checkbox label="Casilla marcada" defaultChecked />
          <Checkbox label="Casilla deshabilitada" disabled />
        </DesignRow>
      </DesignSection>

      <DesignSection
        id="retroalimentacion"
        title="Retroalimentacion"
        description="El aviso permanece en la pantalla, la notificacion es momentanea. Los estados de carga y vacio pertenecen al sistema, no a cada pantalla."
      >
        <DesignStack>
          <DesignGroup title="Etiquetas">
            <DesignRow>
              {SEMANTIC_VARIANTS.map((variant) => (
                <Badge key={variant} variant={variant}>
                  {variant}
                </Badge>
              ))}
            </DesignRow>
          </DesignGroup>

          <DesignGroup title="Avisos">
            <DesignStack>
              <Alert variant="success" title="Operacion exitosa">
                El registro se guardo correctamente.
              </Alert>
              <Alert variant="warning" title="Advertencia">
                Existen prestamos proximos a vencer.
              </Alert>
              <Alert variant="danger" title="Error">
                No fue posible completar la operacion.
              </Alert>
              <Alert variant="info" title="Informacion">
                El prestamo tiene una duracion de catorce dias.
              </Alert>
            </DesignStack>
          </DesignGroup>

          <DesignGroup title="Notificaciones">
            <DesignRow>
              {SEMANTIC_VARIANTS.filter((variant) => variant !== 'neutral').map((variant) => (
                <Button
                  key={variant}
                  variant="secondary"
                  onClick={() => showToast({ type: variant, message: `Notificacion de tipo ${variant}` })}
                >
                  Mostrar {variant}
                </Button>
              ))}
            </DesignRow>
          </DesignGroup>

          <DesignGroup title="Carga">
            <DesignRow>
              {SIZES.map((size) => (
                <Spinner key={size} size={size} />
              ))}
            </DesignRow>
          </DesignGroup>

          <DesignGroup title="Contenido en carga">
            <DesignStack>
              <Skeleton height="var(--space-6)" />
              <Skeleton width="60%" />
            </DesignStack>
          </DesignGroup>

          <DesignGroup title="Estado vacio">
            <EmptyState
              title="Sin resultados"
              message="No se encontraron registros con los criterios actuales"
              action={<Button variant="secondary">Limpiar filtros</Button>}
            />
          </DesignGroup>
        </DesignStack>
      </DesignSection>

      <DesignSection
        id="datos"
        title="Datos"
        description="La tabla resuelve por si misma sus estados de carga, error y vacio. Una pantalla de administracion no decide como se ve un listado cargando."
      >
        <DesignStack>
          <DesignGroup title="Tabla con datos">
            <DataTable columns={SAMPLE_COLUMNS} rows={SAMPLE_ROWS} />
          </DesignGroup>

          <DesignGroup title="Tabla cargando">
            <DataTable columns={SAMPLE_COLUMNS} rows={[]} isLoading />
          </DesignGroup>

          <DesignGroup title="Tabla vacia">
            <DataTable columns={SAMPLE_COLUMNS} rows={[]} />
          </DesignGroup>

          <DesignGroup title="Tabla con error">
            <DataTable columns={SAMPLE_COLUMNS} rows={[]} error="No fue posible conectar con el servidor" />
          </DesignGroup>

          <DesignGroup title="Paginacion">
            <Pagination page={2} totalPages={5} total={42} onPageChange={() => {}} />
          </DesignGroup>
        </DesignStack>
      </DesignSection>

      <DesignSection
        id="superposiciones"
        title="Superposiciones"
        description="Existe un unico modal y un unico dialogo de confirmacion. Toda accion destructiva del sistema pasa por el mismo dialogo."
      >
        <DesignRow>
          <Button onClick={() => modal.open()}>Abrir modal</Button>
          <Button variant="danger" onClick={() => confirmDialog.open()}>
            Abrir confirmacion de borrado
          </Button>
        </DesignRow>
      </DesignSection>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="Modal de ejemplo"
        footer={
          <>
            <Button variant="secondary" onClick={modal.close}>
              Cancelar
            </Button>
            <Button onClick={modal.close}>Guardar</Button>
          </>
        }
      >
        <p>
          El modal se cierra con la tecla Escape, con el boton de cerrar o haciendo clic fuera de el, y
          bloquea el desplazamiento del fondo mientras esta abierto.
        </p>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Eliminar registro"
        message="Esta seguro de eliminar este registro? Esta accion no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={confirmDialog.close}
        onCancel={confirmDialog.close}
      />
    </>
  );
};
