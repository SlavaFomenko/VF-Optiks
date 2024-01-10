import { Outlet } from 'react-router'
import { MenuItem } from '../../components/menu-item/menu-item'
import styles from './adminPanel.module.scss'

const AdminPanel = ():JSX.Element => {
return( 
		<main className={styles.wrapper}>
			<menu>
				<ul>
					<MenuItem to="categories" title='Категорії'/>
					<MenuItem to="manufacturers" title='Постачальники'/>
					<MenuItem to="products" title='Товари'/>
					<MenuItem to="users" title='Користувачі'/>
					<MenuItem to="orders" title='Замовлення'/>
				</ul>
			</menu>
			<Outlet/>
		</main>)
}

export default AdminPanel