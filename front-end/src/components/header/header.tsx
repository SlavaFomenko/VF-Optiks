import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/userContext';
import eye_logo from '../../images/header/eye_logo.png';
import styles from './header.module.scss';
import Menu from '../contextMenu/menu';


const Header = (): JSX.Element => {
  const user = useContext(UserContext);
  const [menuIsActive, setMenuIsActive] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
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
          <li onClick={() => navigate('/')}>Головна</li>
          <li onClick={() => navigate('/store')}>Товари</li>
          <li onClick={() => navigate('/about')}>Про нас</li>
        </ul>
      </nav>
      <div className={styles.user} ref={menuRef}>
        {user?.user ? (
          <>
            <a>
              {user.user.first_name} {user.user.last_name}{' '}
            </a>
            <button onClick={() => setMenuIsActive(!menuIsActive)} className={styles.menu_btn_icon_wrapper}></button>
          </>
        ) : (
          <a onClick={() => navigate('/login')}> Login </a>
        )}
      </div>
      {menuIsActive && <Menu />}
    </header>
  );
};

export default Header;
