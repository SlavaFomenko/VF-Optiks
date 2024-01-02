// import './App.css';
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import styles from './App.module.scss'
import Header from './components/header/header'
import HomePage from './pages/general/home'
import StorePage from './pages/store/store'
import UserContext from './context/userContext'
import LoginPage from './pages/login/login'

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