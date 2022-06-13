import Layout from '../../../components/Layout.js'
import axios from 'axios'
import withAdmin from '../../withAdmin.js'
import { useState, useEffect } from 'react'
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts'

// Here user, token are coming from withAdmin function.
const createCategory = ({ user, token }) => {

    const [state, setState] = useState({
        name: '',
        error: '',
        success: '',
        content: '',
        formData: process.browser && new FormData(),
        buttonText: 'Create',
        imageUploadText: 'Upload image',
        buttonDisabled: false
    })

    const { name, error, success, formData, buttonText, imageUploadText, content, buttonDisabled } = state

    const handleChange = name => (e) => {
        const value = name === 'image' ? e.target.files[0] : e.target.value
        const imageName = name === 'image' ? e.target.files[0].name : 'Upload image'
        formData.set(name, value)
        setState({ ...state, [name]: value, error: '', success: '', buttonText: 'Create', imageUploadText: imageName })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setState({ ...state, buttonText: 'Creating...', buttonDisabled: true })
        try {
            const response = await axios.post(`${process.env.API}/category`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setState({ ...state, name: '', content: '', formData: new FormData(), buttonText: 'Created', imageUploadText: 'Upload Image', success: `Category ${response.data.name} created` })
        } catch (err) {
            setState({ ...state, error: err.response.data.error })
        }
    }

    const createCategoryForm = e => (
        <form onSubmit={handleSubmit}>
            <div className='form-group mb-3'>
                <lable className="form-label">Name</lable>
                <input onChange={handleChange('name')} value={name} type="text" className='form-control shadow-sm' required />
            </div>
            <div className='form-group mb-3'>
                <lable className="text-muted form-label">Content</lable>
                <input onChange={handleChange('content')} value={content} type="text" className='form-control shadow-sm' required />
            </div>
            <div className='form-group mb-3'>
                <lable className="text-muted form-label">Image</lable>
                <input onChange={handleChange('image')} type="file" className='form-control shadow-sm' required />
            </div>
            <br />
            <div className='form-group'>
                <button className='btn btn-outline-dark shadow-none btn-block' disabled={buttonDisabled}>{buttonText}</button>
            </div>
        </form>
    )

    return (
        <Layout>
            {success && showSuccessMessage(success)}
            <h1>Create Category</h1>
            <br />
            {createCategoryForm()}
        </Layout>
    )
}

export default withAdmin(createCategory)