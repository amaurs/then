import { Navigate } from 'react-router-dom'
import { useAuth } from './Hooks'

const ProtectedRoute = ({ children }) => {
    // This classed is based of https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/
    const { user } = useAuth()
    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}

export default ProtectedRoute
