import { useNavigate } from 'react-router'
import styles from './notFound.module.scss'

const NotFoundPage = ():JSX.Element => {
	const navigate = useNavigate()
	return(
		<main className={styles.wrapper}>
			<span>Сторінку не знайдено :{' ~('} </span>
			<button onClick={()=>navigate('/')}>Повернутися на головну!</button> 
		</main>
	)
}

export default NotFoundPage