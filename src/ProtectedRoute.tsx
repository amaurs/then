import { useAuth } from './Hooks'
import Login from './Login'

interface Props {
    children: React.ReactNode
    requiredRole?: string
}

const hasRole = (roles: string[], requiredRole: string): boolean => {
    if (requiredRole === 'owner') return roles.includes('owner')
    return roles.includes(requiredRole) || roles.includes('owner')
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
    const { user } = useAuth()

    if (!user || !Array.isArray(user.roles)) return <Login />

    if (requiredRole && !hasRole(user.roles ?? [], requiredRole)) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    fontFamily: "'LubalinGraphStd-Medium', serif",
                    fontSize: '4rem',
                    color: 'magenta',
                }}
            >
                not for you
            </div>
        )
    }

    return children
}

export default ProtectedRoute
