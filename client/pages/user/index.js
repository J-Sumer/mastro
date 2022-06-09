import Layout from '../../components/Layout.js'
import axios from 'axios'
import { getCookie } from '../../helpers/auth.js'

const User = ({ user }) => {
    return <Layout>{JSON.stringify(user)}</Layout>
}

User.getInitialProps = async (context) => {
    const token = getCookie('token', context.req)
    try {
        const response = await axios.get(`${process.env.API}/user`, {
            headers: {
                authorization: `Bearer ${token}`,
                contentType: 'application/json'
            }
        })
        return { user: response.data }
    } catch (err) {
        if (err.response.status == 401) {
            return {
                user: 'no user'
            }
        }
    }
}

export default User