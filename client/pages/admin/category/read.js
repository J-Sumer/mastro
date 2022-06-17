import Layout from '../../../components/Layout.js'
import axios from 'axios'
import withAdmin from '../../withAdmin.js'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './read.module.css'

const AllCategories = ({ user, token }) => {
    const [state, setState] = useState({
        categories: [],
        error: '',
        success: ''
    })

    const { categories, error, success } = state;

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        const response = await axios.get(`${process.env.API}/categories`);
        setState({
            ...state,
            categories: response.data
        })
    }

    const confirmDelete = async (slug, e) => {
        e.preventDefault();
        const userResponse = confirm("Are you sure you want to delete");
        if (userResponse) {
            try {
                const response = await axios.delete(`${process.env.API}/category/${slug}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                console.log(response)

                const currentCategoryIndex = categories.findIndex(link => link.slug == slug)
                console.log("currentCategoryIndex", currentCategoryIndex)
                var tempAllCategories = [...categories]
                tempAllCategories.splice(currentCategoryIndex, 1)
                console.log("tempAllCategories", tempAllCategories)
                setState({
                    ...state,
                    success: response.data.message,
                    categories: [...tempAllCategories]
                })
            } catch (err) {
                console.error("Error deleting the category")
            }
        }
    }

    const listOfCategories = () => (
        categories.map((c, i) => {
            return (
                <Link href={`/links/${c.slug}`} key={i}>
                    <a className={`${styles.tutorialBox} ${styles.noUnderline} col-md-6`} >
                        <div className={` ${styles.bigBox} mr-1 mb-4 p-2`}>
                            <div className='row'>
                                <div className='col-md-2'>
                                    <img src={c.image.url} alt="Image" className={`${styles.image}`} />
                                </div>
                                <div className={` ${styles.boxTextParent} col-md-6`}>
                                    <div className={styles.boxText}>{c.name}</div>
                                </div>
                                <div className={`col-md-4`}>
                                    <Link href={`/admin/category/${c.slug}`}>
                                        <button className='btn btn-sm btn-outline-secondary w-75 mb-2 shadow-sm'>Edit</button>
                                    </Link>
                                    <button onClick={(e) => confirmDelete(c.slug, e)} className='btn btn-sm btn-outline-danger w-75 shadow-sm'>Delete</button>
                                </div>
                            </div>
                        </div>
                    </a>
                </Link>
            )
        })
    )

    return (
        <Layout>
            <div className='row'>
                <div className='col'>
                    <h1>List of categories</h1>
                    <br />
                </div>
            </div>

            <div className='row'>
                {listOfCategories()}
            </div>
        </Layout>
    )

}

export default withAdmin(AllCategories)