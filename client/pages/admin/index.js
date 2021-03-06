import Layout from '../../components/Layout.js'
import withAdmin from '../withAdmin'
import Link from 'next/link.js'

const Admin = ({ user, token }) => {
    return <Layout>
        <h1>Admin Dashboard</h1>
        <br />
        <div className='row'>
            <div className='col-md-4'>
                <ul className='nav flex-column'>
                    <li className='nav-item'>
                        <Link href="admin/category/create">
                            <a className='nav-link'>
                                Create Category
                            </a>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link href="admin/category/read">
                            <a className='nav-link'>
                                All Categories
                            </a>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className='col-md-8'></div>
        </div>
    </Layout>
}

export default withAdmin(Admin)