import { useState } from 'react'
import { useGoogleOneTapLogin } from '@react-oauth/google'
import { useAuth } from './Hooks'

const banditHost = import.meta.env.VITE_API_HOST

const Login = () => {
    const { login } = useAuth()
    const [error, setError] = useState(false)

    useGoogleOneTapLogin({
        disabled: error,
        onSuccess: async (credentialResponse) => {
            try {
                const response = await fetch(`${banditHost}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        credential: credentialResponse.credential,
                    }),
                })
                if (!response.ok) {
                    setError(true)
                    return
                }
                const json = await response.json()
                login({ token: json.token, roles: json.roles })
            } catch (e) {
                console.log(e)
            }
        },
        onError: () => console.log('Google login failed'),
    })

    if (error) {
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

    return null
}

export default Login
