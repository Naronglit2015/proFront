import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LoginForm from '../layout/LoginForm';
import RegisterForm from '../layout/RegisterForm';
import useAuth from '../hooks/useAuth';
import Header from '../layout/Header';
import UserHome from '../layout/UserHome';
import ProductPage from '../components/ProductPage '; 
import TableReservations from '../components/TableReservations';
import Confirm from '../components/Confrim'; 
import Test001 from '../components/test001';
import AdminHome from '../layout/AdminPage';
import AddProductForm from '../components/Adproduct';
import UserProfileForm from '../components/UserProfile';
import EditUserProfile from '../components/EditUserProfile';
import AdminOrder from '../components/AdminOrder';
import Profile from '../layout/profile';
import EditProfile  from '../layout/EditProfile';
import TbResrall from '../layout/TableReserall';
import Dashborad from '../layout/dashborad';

const guestRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      // { index: true, element: <UserHome /> },
      { index: true, element: <LoginForm /> },
      
      { path: '/userhome', element: <UserHome /> },
      { path: '/tbResrall', element: <TbResrall /> },
      { path: '/', element: <LoginForm /> },
      { path: '/register', element: <RegisterForm /> }
    ]
  }
]);

const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      { index: true, element: <ProductPage /> },
      { path: '/products', element: <ProductPage /> },
      { path: '/table-reservations', element: <TableReservations /> },
      { path: '/confirm', element: <Confirm /> },
      { path: '/test001', element: <Test001 /> },
      { path: '/profile', element: <Profile /> },
      { path: '/EditProfile', element: <EditProfile  /> },

    ]
  }
]);
const staffRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      { index: true, element: <TableReservations /> },
      { path: '/', element: <TableReservations /> },
      { path: '/confirm', element: <Confirm /> },
      { path: '/products', element: <ProductPage /> },
      { path: '/Adproduct', element: <AddProductForm /> },
      { path: '/AdminOrder/', element: <AdminOrder /> },
      { path: '/profile', element: <Profile /> },
      { path: '/EditProfile', element: <EditProfile  /> },




     

    ]
  }
]);
const adminRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      { index: true, element: <ProductPage /> },
      { path: '/table-reservations', element: <TableReservations /> },
      { path: '/confirm', element: <Confirm /> },
      { path: '/products', element: <ProductPage /> },
      { path: '/Adproduct', element: <AddProductForm /> },
      { path: '/UserProfile', element: <UserProfileForm /> },
      { path: '/EditUserProfile/:userId', element: <EditUserProfile /> },
      { path: '/AdminOrder/', element: <AdminOrder /> },
      { path: '/profile', element: <Profile /> },
      { path: '/EditProfile', element: <EditProfile  /> },
      { path: '/Dashborad', element: <Dashborad  /> },




     

    ]
  }
]);

export default function AppRouter() {
  const { user } = useAuth();
  const finalRouter = user?.id
    ? user.role === 'ADMIN'
      ? adminRouter
      : user.role === 'STAFF'
      ? staffRouter
      : userRouter
    : guestRouter;
    
  return (
    <RouterProvider router={finalRouter} />
  );
}
