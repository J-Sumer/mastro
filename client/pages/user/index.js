import Link from 'next/link'
import Layout from '../../components/Layout.js'
import withUser from '../withUser'
import { calculateDate } from '../../helpers/dates.js'
import { useRouter } from 'next/router'
import axios from 'axios'

const User = ({ user, token, userLinks }) => {

    const router = useRouter()

    const confirmDelete = async (slug, _id, e) => {
        e.preventDefault();
        const userResponse = confirm("Are you sure you want to delete");
        if (userResponse) {
            try {
                console.log("Trying to delete")
                console.log(token)
                const response = await axios.delete(`${process.env.API}/link/${_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                router.push('/user')
            } catch (err) {
                console.error("Error deleting the category")
            }
        }
    }

    const listOfLinks = () => (
        userLinks.map((l, i) => (

            <div className='row p-2 mb-3' key={i} style={{ backgroundColor: "#f0f0f0", borderRadius: "10px" }}>
                {console.log(l)}
                <div className='col-md-7'>
                    <a href={l.url} target="_blank" style={{ textDecoration: 'none', color: "black" }}>
                        <h5 className='pt-2'>{l.title}</h5>
                        <h6 className='pt-2' style={{ fontSize: '12px', color: "blue" }}>{l.url}</h6>
                    </a>
                </div>
                <div className='col-md-3 pt-2'>
                    <span className='pull-right'>{calculateDate(l.createdAt)}</span>
                    <div>
                        {l.categories.map((c, k) => {
                            return <span key={k} className='badge text-success'>{c.name}</span>
                        })}
                    </div>
                    <div>
                        <span className='badge text-dark'>
                            {l.type} / {l.medium}
                        </span>
                    </div>
                </div>
                <div className='col-md-2 pt-2 pb-2'>
                    <Link href={`/user/link/update/${l._id}`}>
                        <button className='btn btn-sm btn-outline-secondary w-100 mb-2 shadow-sm'>Edit</button>
                    </Link>
                    <button onClick={(e) => confirmDelete(l.slug, l._id, e)} className='btn btn-sm btn-outline-danger w-100 shadow-sm'>Delete</button>
                </div>
            </div>
        ))
    )

    return <Layout>
        <h1>{user.name}'s dashboard</h1>
        <hr />
        <div className='row'>
            <div className='col-md-4'>
                <ul className='nav flex-column'>
                    <li className='nav-item'>
                        <Link href="/user/link/create">Create</Link>
                    </li>
                    <li className='nav-item'>
                        <Link href="/user/profile/update">Update profile</Link>
                    </li>
                </ul>
            </div>
            <div className='col-md-8'>
                <h2>Your Links</h2>
                <hr />
                <p>{listOfLinks()}</p>
            </div>

        </div>
    </Layout>
}

export default withUser(User)