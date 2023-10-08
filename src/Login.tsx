import { useState, useEffect, ChangeEvent } from 'react'
import { useAuth } from './Hooks'
import './Login.css'

const banditHost = process.env.REACT_APP_API_HOST

export const Login = () => {
    const { login, logout } = useAuth()
    let [password, setPassword] = useState<string>('')

    const handleClick = () => {
        const getToken = async (url: string) => {
            try {
                let payload = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: password,
                    }),
                }

                let response = await fetch(url, payload)
                let json = await response.json()

                if (json.token) {
                    console.log(json.token)
                    login({
                        token: json.token,
                    })
                }
                

                
            } catch (error) {
                console.log(error)
            }
        }

        getToken(banditHost + '/login')
    }

    const handleLogout = () => {
        logout()
    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    return (
        <div className="Login">
            <input type="password" id="password" onChange={handleOnChange}></input>
            <button onClick={handleClick}>login</button>
        </div>
    )
}

export default Login
