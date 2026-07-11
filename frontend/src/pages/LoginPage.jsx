import { useLocation, useNavigate } from 'react-router-dom';

import { Card } from '../components/ui/Card.jsx';
import { LoginForm } from '../features/auth/LoginForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { PATHS } from '../routes/paths.js';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (credentials) => {
    await login(credentials);

    const destination = location.state?.from?.pathname ?? PATHS.DASHBOARD;
    navigate(destination, { replace: true });
  };

  return (
    <Card title="Iniciar sesion">
      <LoginForm onLogin={handleLogin} />
    </Card>
  );
};
