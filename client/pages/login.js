import Layout from '../components/Layout.js'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { useRouter } from 'next/router'
import axios from 'axios'
import { showErrorMessage, showSuccessMessage } from '../helpers/alerts.js'
import { authenticate, isAuth } from '../helpers/auth.js'

const Login = () => {

    const router = useRouter()

    const [state, setState] = useState({
        email: "mjyothisumer@gmail.com",
        password: "password",
        error: "",
        buttonText: "Login"
    })

    const { email, password, error, buttonText } = state;

    const handleChange = (name) => (event) => {
        setState({
            ...state,
            [name]: event.target.value,
            error: "",
            buttonText: "Login"
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setState({
                ...state,
                buttonText: 'Logging in..'
            })
            const res = await axios.post(`${process.env.API}/login`, { email, password });
            authenticate(res);
            Router.push("/")
        } catch (err) {
            console.log(err)
            setState({
                ...state,
                buttonText: 'Login',
                error: err.response.data.error,
                success: ''
            })
        }
    }

    const loginForm = () => {

        return (
            <form onSubmit={handleSubmit}>
                <div className='form-group mb-3'>
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input onChange={handleChange('email')} type="text" className="form-control shadow-sm" id="email" aria-describedby="emailHelp" value={email} required />
                </div>

                <div className='form-group mb-3'>
                    <label htmlFor="password" className="form-label">Password</label>
                    <input onChange={handleChange('password')} type="password" className="form-control shadow-sm" id="password" aria-describedby="passwordHelp" value={password} required />
                </div>

                <div className='form-group'>
                    <button className='btn btn-outline-dark shadow-none'>{buttonText}</button>
                </div>
            </form>
        )
    }

    return <Layout>
        {error && showErrorMessage(error)}
        <h1>Login</h1>
        <br />
        {loginForm()}
    </Layout>
}

export default Login