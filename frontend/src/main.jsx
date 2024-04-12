import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import PokemonDetail from './PokemonDetail';
import Login from './Login';
import CreateUser from './CreateUser';
import PWM from './PWM';

const router = createBrowserRouter([
  {
    path: '/pokemon/:pokemonId',
    element: <PokemonDetail />
  },
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
    <RouterProvider router={router } />
  </React.StrictMode>,
)
