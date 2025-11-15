import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PageEditor from './pages/PageEditor';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit/:pageType"
        element={
          <ProtectedRoute>
            <PageEditor />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
