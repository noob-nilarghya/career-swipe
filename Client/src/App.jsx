
import About from './pages/About';
import AppLayout from './pages/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Register from './pages/Register';
import CandidateSetup from './pages/CandidateSetup';
import RecruiterSetup from './pages/RecruiterSetup';
import GlobalStyles from './styles/GlobalStyles';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import AccountSetup from './pages/AccountSetup';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthContext } from './context/AuthContext';
import { jwtDecode } from "jwt-decode";
import { useEffect } from 'react';
import { useRoleContext } from './context/RoleContext';
import MessageSmallScreen from './pages/MessageSmallScreen';

// creating react-query instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0
    }
  }
});

function App() {
  const { authUser, setAuthUser } = useAuthContext();
  const {roleUser, setRoleUser} = useRoleContext();
  // If token in the backend expires --> We will autometically clear local storage and setAuthUser to null
  // We will check it after every 1 minute
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = (authUser) ? authUser.token : ""; 
      if (token) {
        const decodedToken = jwtDecode(token); 
        const currentTime = Date.now().valueOf() / 1000;

        if (decodedToken.exp < currentTime) {
          // Token is expired, clear local storage and setAuthUser and redirect to login
          localStorage.removeItem('role-user');
          setRoleUser((val) => null);
          localStorage.removeItem('auth-user');
          setAuthUser((val) => null);
          
          window.location.href = '/login';
        }
      }
    };

    checkTokenExpiration();
    // set an interval to check the token's validity periodically
    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);
  

  return (
    <QueryClientProvider client={queryClient}> {/* react-query provider function (similar to contextAPI) */}
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <AppLayout />
          }>
            <Route index element={<Navigate replace to="/home" />} /> {/* default (or index) route*/}
            <Route path='home' element={<Landing />} />
            <Route path='about' element={<About />} />
          </Route>

          {/* Don't allow to access these route once user is logged in */}
          <Route path='login' element={<Login />} />
          <Route path='password-forgot' element={<ForgotPassword />} />
          <Route path='password-reset/:token' element={<ResetPassword />} />
          <Route path='register' element={<Register />} />

          {/* Protected Route  */}
          <Route path='feed' element={<MainPage />} />
          <Route path='message-small-screen' element={<MessageSmallScreen />} />
          <Route path='edit-candidate' element={<CandidateSetup />} />
          <Route path='edit-recruiter' element={<RecruiterSetup />} />
          <Route path='edit-account' element={<AccountSetup />} />

          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      {/* setting up Toaster (3rd party lib) for displaying nice alert message in notification form */}
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            style: {
              background: 'green'
            },
            duration: 3000,
          },
          error: {
            style: {
              background: 'red'
            },
            duration: 4000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            color: 'white',
            zIndex: '99999',
            textAlign: 'center'
          }
        }}>
      </Toaster>
    </QueryClientProvider>
  );
}

export default App;


