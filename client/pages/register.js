import Layout from '../components/Layout.js'
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

const Register = () => {

    const router = useRouter()

    const [state, setState] = useState({
        name: "",
        email: "",
        password: "",
        error: "",
        success: "",
        buttonText: "Register"
    })

    const { name, email, password, error, success, buttonText } = state;

    const handleChange = (name) => (event) => {
        setState({
            ...state,
            [name]: event.target.value,
            error: ""
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        axios.post('http://localhost:8000/api/register', {
            name, email, password
        }).then(res => console.log(res))
            .catch(err => console.log(err))
    }

    const registerForm = () => {

        return (
            <form onSubmit={handleSubmit}>
                <div className='form-group mb-3'>
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input onChange={handleChange('name')} type="text" className="form-control shadow-sm" id="name" aria-describedby="nameHelp" value={name} />
                </div>

                <div className='form-group mb-3'>
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input onChange={handleChange('email')} type="text" className="form-control shadow-sm" id="email" aria-describedby="emailHelp" value={email} />
                    <div id="email" className="form-text">We'll never share your email with anyone else.</div>
                </div>

                <div className='form-group mb-3'>
                    <label htmlFor="password" className="form-label">Password</label>
                    <input onChange={handleChange('password')} type="password" className="form-control shadow-sm" id="password" aria-describedby="passwordHelp" value={password} />
                </div>

                <div className='form-group'>
                    <button className='btn btn-outline-dark shadow-none'>{buttonText}</button>
                </div>
            </form>
        )
    }

    return <Layout>
        <h1>Register!</h1>
        <br />
        {registerForm()}
    </Layout>
}

export default Register