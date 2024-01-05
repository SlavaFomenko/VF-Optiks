import { useContext } from 'react'
import UserContext from '../../context/userContext'
import { Navigate, Outlet } from 'react-router'

export const PrivateRoute = ():JSX.Element => {
	const user = useContext(UserContext)
	return (
		user?.user?.role === "admin"?<Outlet/>:<Navigate to="not-found"/>
	)
}

