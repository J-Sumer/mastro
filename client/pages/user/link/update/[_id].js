import Layout from "../../../../components/Layout"
import axios from "axios"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import styles from './update.module.css'
import React from "react"
import withUser from "../../../withUser"
import { showSuccessMessage } from '../../../../helpers/alerts'

const UpdateLink = ({ token }) => {

    const router = useRouter();
    const { _id } = router.query;

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

    const fetchLinkDetails = async () => {
        try {
            const linkDetails = await axios.get(`${process.env.API}/link/${_id}`)
            const categoryList = await axios.get(`${process.env.API}/categories`)
            const { title, url, type, medium, categories } = linkDetails.data
            console.log("categories", categories)
            setState({
                ...state,
                title,
                url,
                type,
                medium,
                loadedCategories: categoryList.data,
                categories
            })
        } catch (err) {
            console.error("Error fetching details of the link")
            console.log(err)
        }
    }

    useEffect(() => {
        if (_id) {
            fetchLinkDetails();
        }
    }, [router])

    const { title, url, categories, loadedCategories, success, error, type, medium } = state

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${process.env.API}/link/${_id}`, { title, url, categories, type, medium }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setState({
                ...state,
                success: 'Succesfully updated link'
            })
        } catch (err) {
            console.log(err)
        }
    }

    const handleCategoryToggle = c => (e) => {
        var checkedCategories = [...categories]
        var index = checkedCategories.indexOf(c)
        if (e.target.checked) {
            if (index === -1) {
                checkedCategories.push(c)
            }
        } else {
            if (index !== -1) {
                checkedCategories.splice(index, 1)
            }
        }
        setState({ ...state, categories: checkedCategories })
    }

    const handleTitleChange = (e) => {
        setState({ ...state, title: e.target.value, error: '', success: '' })
    }

    const handleURLChange = (e) => {
        setState({ ...state, url: e.target.value, error: '', success: '' })
    }

    const isChecked = (_id) => {
        return categories.indexOf(_id) !== -1 ? true : false
    }

    const showCategories = () => {
        return loadedCategories && loadedCategories.map((c, i) => (
            <li className='list-unstyled' key={c._id}>
                <input className='mr-2' type="checkbox" onChange={handleCategoryToggle(c._id)} checked={isChecked(c._id)} />
                <label className='form-check-label ms-2'>{c.name}</label>
            </li>
        ))
    }

    const showTypes = () => (
        <React.Fragment>
            <li className='list-unstyled'>
                <input type="radio" value="free" name="type" defaultChecked /> Free
            </li>
            <li className='list-unstyled'>
                <input type="radio" value="paid" name="type" /> Paid
            </li>
        </React.Fragment>
    )

    const handleTypeChange = (e) => {
        setState({ ...state, type: e.target.value, success: '' })
    }

    const showMedium = () => (
        <React.Fragment>
            <li className='list-unstyled'>
                <input type="radio" value="video" name="medium" defaultChecked /> Video
            </li>
            <li className='list-unstyled'>
                <input type="radio" value="book" name="medium" /> Book
            </li>
        </React.Fragment>
    )

    const handleMediumChange = (e) => {
        setState({ ...state, medium: e.target.value, success: '' })
    }


    const submitLinkForm = () => (
        <form onSubmit={handleSubmit}>
            <div className='form-group mb-3'>
                <label htmlFor="title" className="form-label">Title</label>
                <input onChange={handleTitleChange} type="text" className="form-control shadow-sm" id="title" aria-describedby="titleHelp" value={title} required />
            </div>
            <div className='form-group mb-3'>
                <label htmlFor="URL" className="form-label">URL</label>
                <input onChange={handleURLChange} type="text" className="form-control shadow-sm" id="URL" aria-describedby="URLHelp" value={url} required />
            </div>
            <div className='form-group'>
                <button className='btn btn-outline-dark shadow-none'>Update</button>
            </div>
        </form>
    )

    return (
        <Layout>
            {
                success && showSuccessMessage(success)
            }
            <div className='row'>
                <div className='col-md-12'>
                    <h1>Update Link/URL</h1>
                    <br />
                    <div className='row'>
                        <div className='col-md-3'>
                            <div className='form-group'>
                                <label className='text-muted mb-2'>Categories</label>
                                <div className={`${styles.label}`}>
                                    {showCategories()}
                                </div>
                            </div>
                            <div className='form-group'>
                                <label className='text-muted mb-2'>Type</label>
                                <div onChange={handleTypeChange} >
                                    {showTypes()}
                                </div>
                            </div>
                            <div className='form-group'>
                                <label className='text-muted mb-2'>Medium</label>
                                <div onChange={handleMediumChange} >
                                    {showMedium()}
                                </div>
                            </div>
                        </div>
                        <div className='col-md-5'>
                            {submitLinkForm()}
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default withUser(UpdateLink)