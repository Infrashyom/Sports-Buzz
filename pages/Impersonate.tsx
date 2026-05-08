import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const Impersonate = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
      window.location.replace('/school/dashboard');
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-slate-800">Logging you in...</h2>
      </div>
    </div>
  );
};
