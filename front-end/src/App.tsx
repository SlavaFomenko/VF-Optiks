// import './App.css';
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import styles from './App.module.scss'
import Header from './components/header/header'
import HomePage from './pages/general/home'
import StorePage from './pages/store/store'
import UserContext from './context/userContext'
import LoginPage from './pages/login/login'
import RegistrationPage from './pages/registration/registration'
import AboutPage from './pages/about/about'
// import  useHistory  from 'react-router-dom'

function App() {
  const [user,setUser] = useState<UserContext | null>(null)
  const [authorizationIsActive , setAuthorizationIsActive] = useState<boolean>(false)
  // const history = useHistory();

  return (
    <div className={styles.App}>
      <UserContext.Provider value={user}>
        {(window.location.pathname !== '/login' && window.location.pathname!=='/registration' && !authorizationIsActive) ? <Header/>:''}
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/store' element={<StorePage/>}/>
          <Route path='/about' element={<AboutPage/>}/>
          <Route path='/login' element={<LoginPage setAuthorizationIsActive={setAuthorizationIsActive} setUser={setUser}/>}/>
          <Route path='/registration' element={<RegistrationPage/>}/>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;