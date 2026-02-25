import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function SSOLandingPage() {
  const { ssoLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processSso = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (token) {
        try {
          // Use the dedicated SSO login function
          await ssoLogin(token);
          // On success, redirect to the home page
          navigate('/');
        } catch (error) {
          console.error("SSO Login failed:", error);
          // On failure, redirect to a login page or show an error
          // For now, we'll redirect to the main page, which will likely have a login prompt
          navigate('/');
        }
      } else {
        // If no token is present, just go to the main page.
        navigate('/');
      }
    };

    processSso();
  }, [ssoLogin, location.search, navigate]);

  // Render a loading indicator while processing
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-xl font-semibold">Authenticating...</p>
        <p className="mt-2 text-gray-600">Please wait while we securely log you in.</p>
      </div>
    </div>
  );
}

export default SSOLandingPage;
