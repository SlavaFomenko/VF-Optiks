import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { openCart } from '../../actions/cartActions';
import UserContext from '../../context/userContext';
import styles from './menu.module.scss';

enum Roles {
  admin = 'admin',
  user = 'user',
}

const Menu = (): JSX.Element => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    user?.user !== null ? (
      <menu className={styles.wrapper_menu}>
        <ul>
          <li onClick={() => navigate('profile')}>Профіль</li>
          <li onClick={() => dispatch(openCart())}>Корзина</li>
          {user?.user && user.user.role === Roles.admin ? (
            <li onClick={() => navigate('/admin-panel')}>Адмін панель</li>
          ) : (
            ''
          )}
          <li 
          onClick={() => {
              user?.setUser(null);
              navigate('/');
            }}
          >
            Вийти
          </li>
        </ul>
      </menu>
    ) : (
      <></>
    )
  );
};

export default Menu;
