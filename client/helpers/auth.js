import Cookie from 'js-cookie'
import { useRouter } from 'next/router'

export const setCookie = (key, value) => {
    if (process.browser) {
        Cookie.set(key, value, {
            expires: 1
        })
    }
}

export const removeCookie = (key) => {
    if (process.browser) {
        Cookie.remove(key)
    }
}

export const getCookie = (key) => {
    if (process.browser) {
        return Cookie.get(key)
    }
}

export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

export const removeLocalStorage = (key) => {
    if (process.browser) {
        localStorage.removeItem(key)
    }
}

export const authenticate = (response, next) => {
    setCookie("token", response.data.token)
    setLocalStorage("user", response.data.user)
    if (next) next();
}

export const isAuth = () => {
    if (process.browser) {
        const cookie = getCookie("token")
        if (cookie) {
            const user = localStorage.getItem("user")
            if (user) {
                return JSON.parse(user)
            }
        }
    }
}

export const signOut = () => {
    const router = useRouter()
    if (process.browser) {
        removeCookie("token")
        removeLocalStorage("user")
    }
    router.push("/login")
}