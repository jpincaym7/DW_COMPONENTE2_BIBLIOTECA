import { useNavigate } from 'react-router-dom';

import { Card } from '../components/ui/Card.jsx';
import { RegisterForm } from '../features/auth/RegisterForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import { PATHS } from '../routes/paths.js';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (payload) => {
    await register(payload);

    showToast({ type: 'success', message: 'Cuenta creada correctamente' });
    navigate(PATHS.DASHBOARD, { replace: true });
  };

  return (
    <Card title="Crear cuenta">
      <RegisterForm onRegister={handleRegister} />
    </Card>
  );
};
