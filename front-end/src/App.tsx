// import './App.css';
import { useContext, useEffect, useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import styles from './App.module.scss'
import Header from './components/header/header'
import HomePage from './pages/general/home'
import StorePage from './pages/store/store'
import UserContext, { User } from './context/userContext';
import LoginPage from './pages/login/login'
import RegistrationPage from './pages/registration/registration'
import AboutPage from './pages/about/about'
import AdminPanel from './pages/admin-panel/adminPanel'
import ProfilePage from './pages/profile/profile'
import NotFoundPage from './pages/notFound/notFound'
import { TabContent } from './components/wrapper-adm-panel-tab/wrapper-admin-panel-tab.modules'
import AdmCategories from './pages/admin-panel/adm-categories/adm-categories'
import AdmProducts from './pages/admin-panel/adm-products/adm-products'
import AdmCustomers from './pages/admin-panel/adm-customers/adm-customers'
import AdmManufacturers from './pages/admin-panel/adm-manufacturers/adm-manufacturers'
import AdmOrders from './pages/admin-panel/adm-orders/adm-orders'
import { PrivateRoute } from './utils/routes/PrivateRoutes'
import ProductPage from './pages/product/product'


function App() {


  const storedUser = sessionStorage.getItem('user');
  const [cartIsOpen,setCartIsOpen] = useState<boolean>(true)
  const initialUser: User | null = 
    storedUser !== undefined && storedUser !== null 
    ? 
    JSON.parse(storedUser) 
    :
     null;
  
  const [user,setUser] = useState<User | null>(initialUser)

  useEffect(()=>{
    sessionStorage.setItem('user',JSON.stringify(user))
  },[user])

  const [authorizationIsActive , setAuthorizationIsActive] = useState<boolean>(false)


  return (
      <UserContext.Provider value={{ user, setUser: setUser }} >
        <div className={styles.App}>
        {(window.location.pathname !== '/login' && window.location.pathname!=='/registration' && !authorizationIsActive) ? <Header/>:''}
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='store' element={<StorePage/>}/>
          <Route path='product/:productId' element={<ProductPage/>}/>
          <Route path='about' element={<AboutPage/>}/>
          <Route path='login' element={<LoginPage setAuthorizationIsActive={setAuthorizationIsActive} />}/>
          <Route path='registration' element={<RegistrationPage/>}/>
          <Route element={<PrivateRoute/>}>
            <Route path='admin-panel/*' element={<AdminPanel/>}>
              <Route path=" " element={<TabContent><section>Виберіть пункт меню</section></TabContent>} />
  			      <Route path="categories" element={<TabContent><AdmCategories /></TabContent>} />
  			      <Route path="products" element={<TabContent><AdmProducts/></TabContent>} />
  			      <Route path="orders" element={<TabContent><AdmOrders/></TabContent>} />
  			      <Route path="users" element={<TabContent><AdmCustomers/></TabContent>} />
  			      <Route path="manufacturers" element={<TabContent><AdmManufacturers/></TabContent>} />
            </Route>
          </Route>
          <Route path='profile' element={<ProfilePage/>}/>
          <Route path='*' element={<NotFoundPage/>}/>
        </Routes>
        {/* {!cartIsOpen || <CartPage/>} */}
        </div>
      </UserContext.Provider>
  );
}

export default App;