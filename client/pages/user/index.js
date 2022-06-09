import Layout from '../../components/Layout.js'
import withUser from '../withUser'

const User = ({ user, token }) => {
    return <Layout>{JSON.stringify(user)} {token}</Layout>
}

export default withUser(User)