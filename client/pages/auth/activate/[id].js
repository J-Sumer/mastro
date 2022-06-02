import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts.js'
import Layout from '../../../components/Layout.js'

const ActivateAccount = () => {
    const router = useRouter()

    const [state, setState] = useState({
        name: '',
        token: '',
        buttonText: 'Activate account',
        success: '',
        error: ''
    });

    const { name, token, buttonText, success, error } = state;

    useEffect(() => {
        const token = router.query.id
        if (token) {
            try {
                const { name, email, password } = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
                setState({
                    ...state,
                    name,
                    token
                })
            } catch (err) {
                console.log(err)
            }
        }
    }, [router]) // here to get values in router, it will take time, so when router is updated we will set the state

    const handleSubmit = async (event) => {
        event.preventDefault();
        setState({ ...state, buttonText: 'Activating' })

        try {
            const response = await axios.post(`${API}/register/activate`, { token })
            setState({ ...state, buttonText: 'Activated', success: 'Account has been activated', error: '' })
        } catch (err) {
            setState({ ...state, buttonText: 'Activate account', success: '', error: 'There is an issue with the activation' })
            console.log(err)
        }
    }

    return <Layout>
        <div className='row'>
            <div className='col-md-6 offset-md-3'>
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                <h1>Hi {name}... Please confirm activation of your account</h1>
                <button className="btn btn-outline-dark shadow-none" onClick={handleSubmit}>{buttonText}</button>
            </div>
        </div>
    </Layout>
}

export default ActivateAccount