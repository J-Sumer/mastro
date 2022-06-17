import Layout from '../../../components/Layout.js'
import axios from 'axios'
import withAdmin from '../../withAdmin.js'
import { useState, useEffect, useRef } from 'react'
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts'
import Resizer from "react-image-file-resizer"
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useRouter } from 'next/router'

// Here user, token are coming from withAdmin function.
const UpdateCategory = ({ user, token }) => {

    const fileElement = useRef(null);

    const router = useRouter()
    const { slug } = router.query

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    const [state, setState] = useState({
        name: '',
        error: '',
        success: '',
        content: '',
        buttonText: 'Update',
        imageUploadText: 'Upload image',
        buttonDisabled: false,
        currentImage: '',
        image: ''
    })

    useEffect(() => {
        loadCategory();
    }, [])

    const loadCategory = async () => {
        try {
            const response = await axios.post(`${process.env.API}/category/${slug}`);
            const { name, content } = response.data.category
            const imageUrl = response.data.category.image.url
            setState({
                ...state,
                name, content, currentImage: imageUrl
            })
        } catch (err) {
            console.error("Error loading category");
            console.log(err)
        }
    }

    const { name, error, success, buttonText, image, content, buttonDisabled, currentImage } = state

    const handleChange = name => (e) => {
        setState({ ...state, [name]: e.target.value, error: '', success: '', buttonText: 'Update' })
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setState({ ...state, buttonText: 'Updating...', buttonDisabled: true })
        try {
            const response = await axios.put(`${process.env.API}/category/${slug}`, { name, content, image }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            fileElement.current.value = ''
            setState({ ...state, success: `Category updated`, currentImage: response.data.image.url })
        } catch (err) {
            setState({ ...state, error: err.response.data.error })
        }
    }

    const updateCategoryForm = e => (
        <form onSubmit={handleSubmit}>
            <div className='form-group mb-3'>
                <label className="form-label">Name</label>
                <input onChange={handleChange('name')} value={name} type="text" className='form-control shadow-sm' required />
            </div>
            <div className='form-group mb-3'>
                <label className="text-muted form-label">Content</label>
                <textarea rows="6" onChange={handleChange('content')} value={content} type="text" className='form-control shadow-sm' required />
            </div>
            <div className='form-group mb-3'>
                <img src={currentImage} />
            </div>
            <div className='form-group mb-3'>
                <label className="text-muted form-label">Update Image</label>
                <input ref={fileElement} onChange={handleImage} type="file" className='form-control shadow-sm' />
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
            <h1>Update Category</h1>
            <br />
            {updateCategoryForm()}
        </Layout>
    )
}

export default withAdmin(UpdateCategory)