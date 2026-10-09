import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from "react-redux"

import { lazy,Suspense } from 'react'
import Private from './routes/Private'
import ErrorPage from './screens/ErrorPage'
import Public from './routes/Public'
import SemiVerified from './routes/SemiVerified'
const Splash = lazy(()=>import('./screens/Splash'))
const AdminLayOut = lazy(()=>import('./Layout/AdminLayOut'))
const CustomerLayout = lazy(()=>import('./Layout/CustomerLayout'))
const DashBoard = lazy(()=>import('./screens/admin/DashBoard'))
const MenuManage = lazy(()=>import('./screens/admin/MenuManage'))
const OrderDetail = lazy(()=>import('./screens/admin/OrderDetail'))
//
const Home = lazy(()=>import('./screens/customer/Home'))
const CheckOut = lazy(()=>import('./screens/customer/CheckOut'))
const OrderHistory = lazy(()=>import('./screens/customer/OrderHistory'))
const OrderTrack = lazy(()=>import('./screens/customer/OrderTrack'))
const Cart = lazy(()=>import('./screens/customer/Cart'))

//
const SignIn = lazy(()=>import('./screens/SignIn'))
const SignUp = lazy(()=>import('./screens/SignUp'))
const Forgot = lazy(()=>import('./screens/Forgot'))

const Otp = lazy(()=>import('./screens/Otp'))
const SetPassword = lazy(()=>import('./screens/SetPassword'))

const About = lazy(()=>import('./screens/customer/About'))
const Menu = lazy(()=>import('./screens/customer/Menu'))

const SignupVerify = lazy(()=>import('./screens/SignupVerify'))

const UserManagemant = lazy(()=>import('./screens/admin/UserManagemant'))
const Payment = lazy(()=>import('./screens/admin/Payment'))
const Details = lazy(()=>import('./screens/customer/Details'))
const Contact = lazy(()=>import('./screens/customer/Contact'))
const AddItem = lazy(()=>import('./screens/admin/AddItem'))
const Profile = lazy(()=>import('./screens/admin/Profile'))
const User = lazy(()=>import('./screens/customer/User'))
const Faivrate = lazy(()=>import('./screens/customer/Faivrate'))
// This component runs inside the React tree, so useSelector here is legal
const RedirectRoot = () => {
  const { token } = useSelector((state) => state.user)
  const isSplash = localStorage.getItem('splash') || "true"

  if (isSplash === "true") return <Navigate to="/splash" replace />
  if (token) return <Navigate to="/app" replace />
  return <Navigate to="/signin" replace />
}

// Decides which layout to show based on role, still inside the tree
const AppEntry = () => {
  const {   user } = useSelector((state) => state.user)
  return user?.role === "admin" ? (<Private><AdminLayOut /></Private>) : (<Private><CustomerLayout /></Private>)
}

// Renders correct index page based on role
const AppIndex = () => {
  const {user } = useSelector((state) => state.user)
  return user?.role === "admin" ? <DashBoard /> : <Home />
}

// Router is now static — no Redux state read at module scope
const router = createBrowserRouter([
  {
    path: "/",
    element: <RedirectRoot />
  },
  {
    path: "/app",
    errorElement: <ErrorPage />,
    element: <AppEntry />,
    children: [
      { index: true, element: <AppIndex /> },
      { path: "admin/menu-page", element: <MenuManage /> },
      { path: "admin/order-detail", element: <OrderDetail /> },
      { path: "admin/payment", element: <Payment /> },
      { path: "admin/user-managemant", element: <UserManagemant /> },
      { path: "admin/menu-page/add-item", element: <AddItem /> },
      { path: "admin/profile", element: <Profile /> },
      { path: "/app/customer/cart", element: <Cart /> },
      { path: "/app/customer/user", element: <User /> },
      { path: "/app/customer/faivrate", element: <Faivrate /> },
      { path: "/app/menu", element: <Menu/> },
      { path: "/app/:id", element: <Details/> },
      { path: "/app/about", element: <About/> },
      { path: "/app/contact", element: <Contact/> },
      { path: "/app/customer/check-out", element: <CheckOut /> },
      { path: "/app/customer/order-history", element: <OrderHistory /> },
      { path: "customer/order-track", element: <OrderTrack /> },
    ]
  },
  { path: "/signin", element: (<Public><SignIn /> </Public>)},
  { path: "/signUp", element: (<Public><SignUp /> </Public>) },
  { path: "/forgot", element:  (<Public><Forgot /> </Public>)},
  { path: "/SetPassword", element: (<Public><SetPassword /></Public> ) },
  { path: "/splash", element:  (<Public><Splash /> </Public>)},
  { path: "/otp", element: (<Public><Otp /></Public>) },
  { path: "/signup-verify", element: (<SemiVerified><SignupVerify /></SemiVerified>) },
])

const App = () => {
  return ( <Suspense fallback={<div className="p-6">Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>)
}

export default App