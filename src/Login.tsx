import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from './Hooks'
import './Login.css'

const banditHost = import.meta.env.VITE_API_HOST

const Login = () => {
    const { login } = useAuth()
    const [error, setError] = useState(false)

    const handleCredential = async (credentialResponse) => {
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
    }

    if (error) {
        return <div className="Login Login-error">not for you</div>
    }

    return (
        <div className="Login">
            <div className="Login-card">
                <h1 className="Login-title">if → then</h1>
                <p className="Login-tagline">sign in to continue</p>
                <div className="Login-button">
                    <GoogleLogin
                        onSuccess={handleCredential}
                        onError={() => console.log('Google login failed')}
                    />
                </div>
                <footer className="Login-footer">
                    <a href="https://blog.then.gallery/privacy">privacy</a>
                    <span> · </span>
                    <a href="https://blog.then.gallery/terms">terms</a>
                </footer>
            </div>
        </div>
    )
}

export default Login
