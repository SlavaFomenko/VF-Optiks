import styles from './menu-item.module.scss'
import React from 'react';
import { Link } from 'react-router-dom';

interface MenuItemProps {
  title:string,
	to:string
}
export const MenuItem:React.FC<MenuItemProps>= ({title,to}):JSX.Element =>{
	return(
		<li className={styles.wrapper}>
			<Link to={to}>
        <button>{title}</button>
      </Link>
		</li>
	)
}

