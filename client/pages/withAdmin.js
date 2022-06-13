import axios from 'axios'
import { getCookie } from '../helpers/auth'

const withAdmin = Page => {

    const WithAuthAdmin = props => <Page {...props} />

    WithAuthAdmin.getInitialProps = async context => {
        const token = getCookie('token', context.req)
        let user = null;
        try {
            const response = await axios.get(`${process.env.API}/admin`, {
                headers: {
                    authorization: `Bearer ${token}`,
                    contentType: 'application/json'
                }
            })
            user = response.data
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
            return {
                // ...Page(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
                user, token
            }
        }
    }

    return WithAuthAdmin
}

export default withAdmin
