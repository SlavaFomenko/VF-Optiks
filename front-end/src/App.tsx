// import './App.css';
import { Route, Routes } from 'react-router-dom'
import styles from './App.module.scss'
import Header from './components/header/header'
import UserContext from './context/userContext'
import HomePage from './components/main/general/home'
import StorePage from './components/main/store/store'
import AboutPage from './components/main/about/about'
import LoginPage from './components/authorization/login/login'
import { useState } from 'react'

function App() {

  const [authorizationIsActive , setAuthorizationIsActive] = useState<boolean>(false)

  return (
    <div className={styles.App}>
      <UserContext.Provider value={null}>
          {(window.location.pathname !== '/login' && window.location.pathname!=='/registration' && !authorizationIsActive) ? <Header/>:''}
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/store' element={<StorePage/>}/>
          {/* <Route path='/about' element={<AboutPage setAuthorizationIsActive={setAuthorizationIsActive} />}/> */}
          <Route path='/login' element={<LoginPage setAuthorizationIsActive={setAuthorizationIsActive}/>}/>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;