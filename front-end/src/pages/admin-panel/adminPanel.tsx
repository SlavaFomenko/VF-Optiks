
import { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { MenuItem } from '../../components/menu-item/menu-item'
import UserContext from '../../context/userContext'
import styles from './adminPanel.module.scss'
// import { Routes,Route } from 'react-router'
// import { TabContent } from '../../components/wrapper-adm-panel-tab/wrapper-admin-panel-tab.modules'
// import AdmCategories from './adm-categories/adm-categories'
// import AdmProducts from './adm-products/adm-products'
// import AdmOrders from './adm-orders/adm-orders'
// import AdmCustomers from './adm-customers/adm-customers'
// import AdmManufacturers from './adm-manufacturers/adm-manufacturers'

// import useUserRole from '../../hooks/useUserRole'

const AdminPanel = ():JSX.Element => {
return( 
		<main className={styles.wrapper}>
			<menu>
				<ul>
					<MenuItem to="categories" title='Категорії'/>
					<MenuItem to="products" title='Товари'/>
					<MenuItem to="users" title='Користувачі'/>
					<MenuItem to="orders" title='Замовлення'/>
					<MenuItem to="manufacturers" title='Постачальники'/>
				</ul>
			</menu>
			<Outlet/>
		</main>)
	
}

export default AdminPanel