import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { PATHS } from '../routes/paths.js';

export const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon="alert"
      title="Acceso denegado"
      message="No tiene permisos para acceder a esta seccion del sistema"
      action={<Button onClick={() => navigate(PATHS.DASHBOARD)}>Volver al panel principal</Button>}
    />
  );
};
