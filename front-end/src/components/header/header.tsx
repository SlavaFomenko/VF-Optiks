import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../context/userContext'
import eye_logo from '../../images/header/eye_logo.png'
import styles from './header.module.scss'

interface HeaderProps {
  // setRegisterIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({  }: HeaderProps): JSX.Element => {
  const userContext = useContext(UserContext)
  // console.log(userContext);
  const navigate = useNavigate()
  return (
    <header className={styles.header_wrapper}>
      <div className={styles.logo_wrapper}>
        <div className={styles.logo_image}>
          <img alt={'logo'} src={eye_logo} />
        </div>
        <div className={styles.logo_name}>
          <span>VF Optics</span>
        </div>
      </div>
      <nav className={styles.nav_wrapper}>
        <ul className={styles.ul_list}>
          <li onClick={()=>navigate('/')}>Головна</li>
          <li onClick={()=>navigate('/store')}>Товари</li>
          <li onClick={()=>navigate('/about')}>Про нас</li>
        </ul>
      </nav>
      <div className={styles.user}>
      
      { 
        userContext ? 
        <a>{userContext.first_name} {userContext.last_name} </a> 
        :
        <a onClick={()=>navigate('/login')}> Login </a>
      }
        
      </div>
      {/* {menuVisible && <Menu refs={{ menuRef: menuRef, menuBtn: menuBtn }} onHideMenu={() => setMenuVisible(false)} />} */}
    </header>
  );
}

export default Header