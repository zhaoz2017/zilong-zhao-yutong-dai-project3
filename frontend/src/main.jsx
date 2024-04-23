import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './AuthContext';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Login from './Login';
import CreateUser from './CreateUser';
import PWM from './PWM';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <CreateUser />
  },
  {
    path: '/',
    element: <App />
  },
  {
    path: '/pwm',
    element: <PWM />
  }

])



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>  {/* This now wraps the RouterProvider */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
