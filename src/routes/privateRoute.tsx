import React, { useEffect } from 'react'
import { RootState, useAppSelector } from '../redux/store'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'

type Props = {
    children: React.ReactNode
}

const PrivateRoute = ({ children }: Props) => {
    const navigate = useNavigate()
    const userData = useAppSelector((state: RootState) => state.user)

    useEffect(() => {
        if (!userData.loggedIn) {
            navigate('/login')
        }
    }, [navigate, userData.loggedIn]) 

    if (userData.loggedIn) {
        return (
            <div>
                <Navbar>
                    {children}
                </Navbar>
            </div>
        )
    }
    
    return null
}

export default PrivateRoute
