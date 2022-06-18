import axios from 'axios'
import { getCookie } from '../helpers/auth'

const withUser = Page => {

    const WithAuthUser = props => <Page {...props} />

    WithAuthUser.getInitialProps = async context => {
        const token = getCookie('token', context.req)
        let user = null;
        let userLinks = null;
        try {
            const response = await axios.get(`${process.env.API}/user`, {
                headers: {
                    authorization: `Bearer ${token}`,
                    contentType: 'application/json'
                }
            })
            user = response.data.user
            userLinks = response.data.links
        } catch (err) {
            if (err.response.status == 401) {
                user = null
            }
        }
        if (user === null) {
            context.res.writeHead(302, {
                Location: '/'
            })
            context.res.end();
        } else {
            console.table({ user, token, userLinks })
            return {
                // ...Page(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
                user, token, userLinks
            }
        }
    }

    return WithAuthUser
}

export default withUser
