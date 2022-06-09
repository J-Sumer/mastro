import Cookie from 'js-cookie'
import Router from 'next/router'

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

export const getCookie = (key, req) => {
    // if (process.browser) {
    //     return Cookie.get(key)
    // }
    return process.browser ? getCookieFromBrowser(key) : getCookieFromServer(key, req)
}

const getCookieFromBrowser = (key) => {
    return Cookie.get(key)
}

const getCookieFromServer = (key, req) => {
    if (!req.headers.cookie) {
        return undefined
    }
    let token = req.headers.cookie.split(";").find(c => c.trim().startsWith(`${key}=`))
    if (!token) return undefined
    return token.split('=')[1]
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
            } else {
                return false
            }
        }
    }
}

export const signOut = () => {
    if (process.browser) {
        removeCookie("token")
        removeLocalStorage("user")
    }
    // Router.push("/login")
}