import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { PATHS } from '../routes/paths.js';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon="search"
      title="Pagina no encontrada"
      message="La pagina que intenta abrir no existe o fue movida"
      action={<Button onClick={() => navigate(PATHS.DASHBOARD)}>Volver al panel principal</Button>}
    />
  );
};
