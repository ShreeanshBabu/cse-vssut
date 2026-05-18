import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { LoadingScreen } from './components/LoadingScreen.jsx';

const Home = lazy(() => import('./pages/Home.jsx').then(m => ({ default: m.Home })));
const People = lazy(() => import('./pages/People.jsx').then(m => ({ default: m.People })));
const Academics = lazy(() => import('./pages/Academics.jsx').then(m => ({ default: m.Academics })));
const Resources = lazy(() => import('./pages/Resources.jsx').then(m => ({ default: m.Resources })));
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx').then(m => ({ default: m.AdminDashboard })));
const Alumni = lazy(() => import('./pages/Alumni.jsx').then(m => ({ default: m.Alumni })));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/people" element={<People />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
