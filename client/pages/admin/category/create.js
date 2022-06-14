import Layout from '../../../components/Layout.js'
import axios from 'axios'
import withAdmin from '../../withAdmin.js'
import { useState, useEffect, useRef } from 'react'
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts'
import Resizer from "react-image-file-resizer"
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

// Here user, token are coming from withAdmin function.
const createCategory = ({ user, token }) => {

    const fileElement = useRef(null);

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );


    const [state, setState] = useState({
        name: '',
        error: '',
        success: '',
        content: '',
        // formData: process.browser && new FormData(),
        buttonText: 'Create',
        imageUploadText: 'Upload image',
        buttonDisabled: false,
        image: ''
    })

    const { name, error, success, formData, buttonText, image, content, buttonDisabled } = state

    // This is an old method to upload file using form data

    /*
    const handleChange = name => (e) => {
        const value = name === 'image' ? e.target.files[0] : e.target.value
        const imageName = name === 'image' ? e.target.files[0].name : 'Upload image'
        formData.set(name, value)
        setState({ ...state, [name]: value, error: '', success: '', buttonText: 'Create', imageUploadText: imageName })
    }
    */

    const handleChange = name => (e) => {
        setState({ ...state, [name]: e.target.value, error: '', success: '', buttonText: 'Create' })
    }

    const handleImage = (event) => {
        var fileInput = false;
        if (event.target.files[0]) {
            fileInput = true;
        }
        if (fileInput) {
            try {
                Resizer.imageFileResizer(
                    event.target.files[0],
                    300,
                    300,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        setState({ ...state, image: uri, error: '', success: '' });
                    },
                    "base64",
                    200,
                    200
                );
            } catch (err) {
                console.log(err);
            }
        }
    }

    // This is an old method to upload file using form data

    /*
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
    */

    const handleSubmit = async (e) => {
        e.preventDefault()
        setState({ ...state, buttonText: 'Creating...', buttonDisabled: true })
        try {
            const response = await axios.post(`${process.env.API}/category`, { name, content, image }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            fileElement.current.value = ''
            setState({ ...state, name: '', content: '', buttonText: 'Created', imageUploadText: 'Upload Image', success: `Category ${response.data.name} created` })
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
                <textarea onChange={handleChange('content')} value={content} type="text" className='form-control shadow-sm' required />
            </div>
            <div className='form-group mb-3'>
                <lable className="text-muted form-label">Image</lable>
                <input ref={fileElement} onChange={handleImage} type="file" className='form-control shadow-sm' required />
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