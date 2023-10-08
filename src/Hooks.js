import {
    useEffect,
    useRef,
    useState,
    createContext,
    useContext,
    useMemo,
} from 'react'
import { useNavigate } from 'react-router-dom'

export function useInterval(callback, delay) {
    const savedCallback = useRef()
    const intervalRef = useRef()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        const tick = () => {
            savedCallback.current()
        }
        if (delay !== null) {
            intervalRef.current = setInterval(tick, delay)
            return () => clearInterval(intervalRef.current)
        }
    }, [delay])
}

export function useRequestAnimationFrame(animateCallback) {
    const requestAnimationFrameRef = useRef(animateCallback)
    useEffect(() => {
        const animate = () => {
            animateCallback()
            requestAnimationFrameRef.current = requestAnimationFrame(animate)
        }
        requestAnimationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(requestAnimationFrameRef.current)
        }
    }, [animateCallback])
}

export function useTimeout(callback, delay) {
    const savedCallback = useRef()
    const timeoutRef = useRef()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        if (delay !== null) {
            timeoutRef.current = setTimeout(() => {
                savedCallback.current()
            }, delay)

            return () => clearTimeout(timeoutRef.current)
        }
    }, [delay])
}

export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.log(error)
            return initialValue
        }
    })

    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            console.log(error)
        }
    }

    return [storedValue, setValue]
}


export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}



const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null)
    const navigate = useNavigate()

    // call this function when you want to authenticate the user
    const login = async (data) => {
        setUser(data)
        navigate('/calendar')
    }

    // call this function to sign out logged in user
    const logout = () => {
        setUser(null)
        navigate('/', { replace: true })
    }

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
        }),
        [user]
    )
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}
