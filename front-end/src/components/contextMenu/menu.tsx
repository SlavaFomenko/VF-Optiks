import { useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import UserContext from '../../context/userContext'
import CartPage from '../../pages/cart/cart'
import styles from './menu.module.scss'

enum Roles {
  admin = 'admin',
  user = 'user',
}

const Menu = (): JSX.Element => {
  const user = useContext(UserContext)
  const navigate = useNavigate()

  const [isVisible, setIsVisible] = useState<boolean>(false)
	console.log(isVisible);
	
  return (
    <menu className={styles.wrapper_menu}>
      <ul>
        <li onClick={() => navigate('profile')}>Профіль</li>
        <li onClick={() => setIsVisible(true)}>Корзина</li>
        {user?.user && user.user.role === Roles.admin ? (
          <li onClick={() => navigate('/admin-panel')}>Адмін панель</li>
        ) : (
          ''
        )}
        <li
          onClick={() => {
            user?.setUser(null)
            navigate('/')
          }}
        >
          Вийти
        </li>
      </ul>
      {isVisible ? <CartPage />:''}
      {/* Отобразите корзину, если isVisible равно true */}
      {/* <CartPage /> */}
    </menu>
  )
}

export default Menu
