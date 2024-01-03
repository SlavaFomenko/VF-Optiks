
import { useContext, useEffect, useState } from 'react'
import styles from './menu.module.scss'
import UserContext from '../../context/userContext'
import { getUserByLogin } from '../../api/customerAPI'


enum Roles {
	admin = 'admin',
 	user = 'user'
}

const Menu = ():JSX.Element => {
	
	const [role,setRole] = useState<Roles>(Roles.user) 
	
	const userContext = useContext(UserContext)

	useEffect(()=>{ //! запрос при каждом открытии меню **/*****
    const fetchData = async () => {
      if (userContext != null) {
        try {
          const user = await getUserByLogin(userContext.login);
					
					if(user[0].role  === Roles.admin){
						setRole(Roles.admin)
					} else {
						setRole(Roles.user)
					}

        } catch (error) {
          console.error('Error fetching user data:', error);
					setRole(Roles.user)
        }
      }
    };

    fetchData();
  }, [userContext]);
	
	return(
		<menu className={styles.wrapper_menu}>
			<ul>
				<li>Корзина</li>
				<li>Профіль</li>
				{role === Roles.admin?<li>Адмін панель</li>:''} 
				<li>Вийти</li>
			</ul>
		</menu>
	)
}

export default Menu