import { useGoogleOneTapLogin } from '@react-oauth/google'
import { useAuth } from './Hooks'

const banditHost = import.meta.env.VITE_API_HOST

const Login = () => {
    const { login } = useAuth()

    useGoogleOneTapLogin({
        onSuccess: async (credentialResponse) => {
            try {
                const response = await fetch(`${banditHost}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        credential: credentialResponse.credential,
                    }),
                })
                const json = await response.json()
                if (json.token) {
                    login({ token: json.token, roles: json.roles })
                }
            } catch (error) {
                console.log(error)
            }
        },
        onError: () => console.log('Google login failed'),
    })

    return null
}

export default Login
