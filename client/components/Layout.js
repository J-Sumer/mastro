import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Router } from "next/router";
import nProgress from 'nprogress';
import "nprogress/nprogress.css"

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

const Layout = ({ children }) => {

    const head = () => {
        return (
            <Head>
                <title>Mastro</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous" />
                <link href='/static/css/styles.css' rel='stylesheet' />
            </Head>
        )
    }

    const nav = () => {
        return (
            <ul className="nav bg-dark">
                <li className="nav-item">
                    <Link href="/">
                        <a className="nav-link text-light" href="">Home</a>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href="/login">
                        <a className="nav-link text-light" href="">Login</a>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href="/register">
                        <a className="nav-link text-light" href="">Register</a>
                    </Link>
                </li>
            </ul>
        )
    }


    return (
        <React.Fragment>
            {head()}
            {nav()}
            <div className='container pt-5 pb-5'>
                {children}
            </div>
        </React.Fragment>
    )
}

export default Layout