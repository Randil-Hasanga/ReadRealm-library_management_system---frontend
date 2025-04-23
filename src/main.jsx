import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Loader from './components/Loader';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Books = lazy(() => import('./pages/Books'));
const BorrowedBooks = lazy(() => import('./pages/BorrowedBooks'));
const Fines = lazy(() => import('./pages/Fines'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Borrowers = lazy(() => import('./pages/Borrowers'));
const Authors = lazy(() => import('./pages/Authors'));

const router = createBrowserRouter([
  { path: '/', element: <Suspense fallback={<Loader />}><LoginPage /></Suspense> },
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'dashboard', element: <Suspense fallback={<Loader />}><Dashboard /></Suspense> },
      { path: 'books', element: <Suspense fallback={<Loader />}><Books /></Suspense> },
      { path: 'authors', element: <Suspense fallback={<Loader />}><Authors /></Suspense> },
      { path: 'borrowed-books', element: <Suspense fallback={<Loader />}><BorrowedBooks /></Suspense> },
      { path: 'fines', element: <Suspense fallback={<Loader />}><Fines /></Suspense> },
      { path: 'borrowers', element: <Suspense fallback={<Loader />}><Borrowers /></Suspense> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
