import { useState, useEffect } from 'react'
import Layout from '../../../components/Layout'
import axios from 'axios'

const Create = () => {
    const [state, setState] = useState({
        title: '',
        url: '',
        categories: [],
        loadedCategories: [],
        success: '',
        error: '',
        type: '',
        medium: ''
    })

    const { title, url, categories, loadedCategories, success, error, type, medium } = state

    useEffect(() => {
        loadCategories()
    }, [success])

    const loadCategories = async () => {
        const response = await axios.get(`${process.env.API}/categories`)
        setState({ ...state, loadedCategories: response.data })

    }

    return (
        <Layout>
            <div className='row'>
                <div className='col-md-12'>
                    <h1>Submit Link/URL</h1>
                    {JSON.stringify(loadedCategories)}
                </div>
            </div>
        </Layout>
    )


}

export default Create