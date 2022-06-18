import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NProgress from 'nprogress';
import "nprogress/nprogress.css"
import { isAuth, signOut } from '../helpers/auth'
const Layout = ({ children }) => {

    const [hasMounted, setHasMounted] = useState(false);

    const router = useRouter()

    useEffect(() => {
        const handleStart = (url) => {
            console.log(`Loading: ${url}`)
            NProgress.start()
        }
        const handleStop = () => {
            NProgress.done()
        }

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleStop)
        router.events.on('routeChangeError', handleStop)
        setHasMounted(true);

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleStop)
            router.events.off('routeChangeError', handleStop)
        }
    }, [router])

    if (!hasMounted) {
        return null;
    }

    const head = () => {
        return (
            <Head>
                <title>Mastro</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous" />
                <link href='/static/css/styles.css' rel='stylesheet' />
            </Head>
        )
    }

    const authDetails = isAuth();

    const logout = async () => {
        authDetails && signOut();
        await router.push('/login')
    }

    const nav = () => {
        return (
            <ul className="nav bg-dark" style={{ position: "fixed", width: "100%", zIndex: "100" }}>
                <li className="nav-item">
                    <Link href="/">
                        <a className="nav-link text-light" href="#">Home</a>
                    </Link>
                </li>
                {
                    authDetails && (
                        <li className="nav-item">
                            <Link href="/user/link/create">
                                <a className="nav-link text-light" href="#">Submit Link</a>
                            </Link>
                        </li>
                    )
                }
                {
                    !authDetails && (
                        <React.Fragment>

                            <li className="nav-item ms-auto">
                                <Link href="/login">
                                    <a className="nav-link text-light" href="#">Login</a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/register">
                                    <a className="nav-link text-light" href="#">Register</a>
                                </Link>
                            </li>
                        </React.Fragment>
                    )
                }
                {
                    authDetails && authDetails.role === 'admin' && (
                        <li className="nav-item ms-auto">
                            <Link href="/admin">
                                <a className="nav-link text-light" href="#">Admin</a>
                            </Link>
                        </li>
                    )
                }
                {
                    authDetails && authDetails.role !== 'admin' && (
                        <li className="nav-item ms-auto">
                            <Link href="/user">
                                <a className="nav-link text-light" href="#">{authDetails.name}</a>
                            </Link>
                        </li>
                    )
                }
                {
                    authDetails && (

                        <li className="nav-item">
                            <a onClick={logout} className="nav-link text-light" href="#">Logout</a>
                        </li>
                    )
                }
            </ul>
        )
    }

    return (
        <React.Fragment>
            {head()}
            {nav()}
            <div className='container pt-5 pb-5' style={{ minHeight: "90vh" }}>
                {children}
            </div>
            <footer style={{ height: "200px", borderTop: "2px solid black", backgroundColor: "black" }}>

            </footer>
        </React.Fragment>
    )
}

export default Layout