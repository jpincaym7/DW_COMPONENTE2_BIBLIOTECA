import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Alert } from '../components/ui/Alert.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Checkbox } from '../components/ui/Checkbox.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { FormField } from '../components/ui/FormField.jsx';
import { IconButton } from '../components/ui/IconButton.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Select } from '../components/ui/Select.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Textarea } from '../components/ui/Textarea.jsx';
import { useModal } from '../hooks/useModal.js';
import { useToast } from '../hooks/useToast.js';
import styles from '../styles/pages/StyleguidePage.module.css';

const COLOR_TOKENS = [
  { className: 'primary', token: '--color-primary' },
  { className: 'success', token: '--color-success' },
  { className: 'warning', token: '--color-warning' },
  { className: 'danger', token: '--color-danger' },
  { className: 'surface', token: '--color-surface' },
  { className: 'bg', token: '--color-bg' },
  { className: 'border', token: '--color-border' },
  { className: 'text', token: '--color-text' }
];

const SPACING_TOKENS = [
  { className: 'spacing1', token: '--space-1' },
  { className: 'spacing2', token: '--space-2' },
  { className: 'spacing3', token: '--space-3' },
  { className: 'spacing4', token: '--space-4' },
  { className: 'spacing6', token: '--space-6' },
  { className: 'spacing8', token: '--space-8' },
  { className: 'spacing12', token: '--space-12' }
];

const TYPOGRAPHY_TOKENS = [
  { className: 'size3xl', token: '--font-size-3xl' },
  { className: 'size2xl', token: '--font-size-2xl' },
  { className: 'sizeXl', token: '--font-size-xl' },
  { className: 'sizeLg', token: '--font-size-lg' },
  { className: 'sizeBase', token: '--font-size-base' },
  { className: 'sizeSm', token: '--font-size-sm' },
  { className: 'sizeXs', token: '--font-size-xs' }
];

const VARIANTS = ['primary', 'secondary', 'danger', 'ghost'];
const SIZES = ['sm', 'md', 'lg'];
const SEMANTIC_VARIANTS = ['success', 'warning', 'danger', 'info', 'neutral'];

const SAMPLE_COLUMNS = [
  { key: 'title', header: 'Titulo' },
  { key: 'author', header: 'Autor' },
  { key: 'status', header: 'Estado', align: 'center', render: () => <Badge variant="success">Activo</Badge> }
];

const SAMPLE_ROWS = [
  { _id: '1', title: 'Clean Code', author: 'Robert C. Martin' },
  { _id: '2', title: 'Dune', author: 'Frank Herbert' }
];

const SELECT_OPTIONS = [
  { value: 'novela', label: 'Novela' },
  { value: 'historia', label: 'Historia' }
];

export const StyleguidePage = () => {
  const modal = useModal();
  const { showToast } = useToast();

  return (
    <>
      <PageHeader
        title="Guia de estilos"
        subtitle="Todos los componentes del sistema con sus variantes, tamanios y estados"
      />

      <div className={styles.section}>
        <Card title="Color">
          <div className={styles.swatches}>
            {COLOR_TOKENS.map((item) => (
              <div key={item.token} className={styles.swatch}>
                <div className={`${styles.color} ${styles[item.className]}`} />
                <span className={styles.token}>{item.token}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <Card title="Tipografia">
          <div className={styles.scale}>
            {TYPOGRAPHY_TOKENS.map((item) => (
              <div key={item.token} className={styles.spacingItem}>
                <span className={styles[item.className]}>Sistema de gestion de biblioteca</span>
                <span className={styles.token}>{item.token}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <Card title="Espaciado">
          <div className={styles.scale}>
            {SPACING_TOKENS.map((item) => (
              <div key={item.token} className={styles.spacingItem}>
                <span className={`${styles.spacingBar} ${styles[item.className]}`} />
                <span className={styles.token}>{item.token}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <Card title="Botones">
          <div className={styles.stack}>
            <div className={styles.row}>
              {VARIANTS.map((variant) => (
                <Button key={variant} variant={variant}>
                  Variante {variant}
                </Button>
              ))}
            </div>

            <div className={styles.row}>
              {SIZES.map((size) => (
                <Button key={size} size={size}>
                  Tamanio {size}
                </Button>
              ))}
            </div>

            <div className={styles.row}>
              <Button disabled>Deshabilitado</Button>
              <Button isLoading>Cargando</Button>
              <Button variant="danger" disabled>
                Deshabilitado
              </Button>
              <IconButton icon="edit" label="Editar" />
              <IconButton icon="trash" label="Eliminar" variant="danger" />
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <Card title="Controles de formulario">
          <div className={styles.formGrid}>
            <FormField label="Campo normal" name="normal">
              {(fieldProps) => <Input {...fieldProps} placeholder="Texto de ejemplo" />}
            </FormField>

            <FormField label="Campo con error" name="conError" error="Este campo es obligatorio">
              {(fieldProps) => <Input {...fieldProps} placeholder="Texto de ejemplo" />}
            </FormField>

            <FormField label="Campo con ayuda" name="conAyuda" hint="Texto de ayuda para el usuario">
              {(fieldProps) => <Input {...fieldProps} placeholder="Texto de ejemplo" />}
            </FormField>

            <FormField label="Campo deshabilitado" name="deshabilitado">
              {(fieldProps) => <Input {...fieldProps} placeholder="No editable" disabled />}
            </FormField>

            <FormField label="Seleccion" name="seleccion" required>
              {(fieldProps) => <Select {...fieldProps} options={SELECT_OPTIONS} />}
            </FormField>

            <FormField label="Seleccion con error" name="seleccionError" error="Seleccione una opcion">
              {(fieldProps) => <Select {...fieldProps} options={SELECT_OPTIONS} />}
            </FormField>

            <FormField label="Area de texto" name="areaTexto">
              {(fieldProps) => <Textarea {...fieldProps} placeholder="Descripcion" />}
            </FormField>
          </div>

          <div className={styles.row}>
            <Checkbox label="Casilla de verificacion" />
            <Checkbox label="Casilla deshabilitada" disabled />
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <Card title="Etiquetas y avisos">
          <div className={styles.stack}>
            <div className={styles.row}>
              {SEMANTIC_VARIANTS.map((variant) => (
                <Badge key={variant} variant={variant}>
                  {variant}
                </Badge>
              ))}
            </div>

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
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <Card title="Estados de carga y vacio">
          <div className={styles.stack}>
            <div className={styles.row}>
              {SIZES.map((size) => (
                <Spinner key={size} size={size} />
              ))}
            </div>

            <Skeleton height="var(--space-6)" />
            <Skeleton width="60%" />

            <EmptyState
              title="Sin resultados"
              message="No se encontraron registros con los criterios actuales"
              action={<Button variant="secondary">Limpiar filtros</Button>}
            />
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <Card title="Tabla de datos">
          <DataTable columns={SAMPLE_COLUMNS} rows={SAMPLE_ROWS} />
        </Card>
      </div>

      <div className={styles.section}>
        <Card title="Superposiciones">
          <div className={styles.row}>
            <Button onClick={() => modal.open()}>Abrir modal</Button>
            <Button
              variant="secondary"
              onClick={() => showToast({ type: 'success', message: 'Notificacion de ejemplo' })}
            >
              Mostrar notificacion
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="Modal de ejemplo"
        footer={
          <>
            <Button variant="secondary" onClick={modal.close}>
              Cancelar
            </Button>
            <Button onClick={modal.close}>Confirmar</Button>
          </>
        }
      >
        <p>Contenido del modal. Se cierra con la tecla Escape o haciendo clic fuera.</p>
      </Modal>
    </>
  );
};
