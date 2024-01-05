
import { useContext} from 'react'
import styles from './menu.module.scss'
import UserContext from '../../context/userContext'
import { useNavigate } from 'react-router'


enum Roles {
	admin = 'admin',
 	user = 'user'
}

const Menu = ():JSX.Element => {
	
	const user = useContext(UserContext)
	const navigate = useNavigate()

	return(
		<menu className={styles.wrapper_menu}>
			<ul>
				<li onClick={()=>navigate('profile')}>Профіль</li>
				<li onClick={()=>navigate('/cart')}>Корзина</li>
				{user?.user && user.user.role === Roles.admin?<li onClick={()=>navigate('/admin-panel')}>Адмін панель</li>:''} 
				<li onClick={()=>{user?.setUser(null);navigate('/')}}>Вийти</li>
			</ul>
		</menu>
	)
}

export default Menu