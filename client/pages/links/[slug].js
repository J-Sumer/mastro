import Layout from '../../components/Layout'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './slug.module.css'
import { useState } from 'react'
import { calculateDate } from '../../helpers/dates.js'

const Links = ({ category, links, totalLinksLoaded, linksLimit, linkSkip }) => {
    const router = useRouter()
    const { slug } = router.query

    const [allLinks, setAllLinks] = useState(links)
    const [limit, setLimit] = useState(linksLimit)
    const [skip, setSkip] = useState(linkSkip)
    const [sizeReceived, setSizeReceived] = useState(totalLinksLoaded)

    const loadMoreLinks = async () => {
        let toSkip = skip + sizeReceived
        const response = await axios.post(`${process.env.API}/category/${slug}`, { skip: toSkip, limit })
        setAllLinks([...allLinks, ...response.data.links])
        setSizeReceived(response.data.links.length)
        setSkip(toSkip)
    }

    const loadMoreButton = () => {
        return (
            sizeReceived > 0 && sizeReceived == limit && (
                <div className=''>
                    <button onClick={loadMoreLinks} className={`btn btn-lg btn-light shadow-none ${styles.submitButton}`}>Load more</button>
                </div>
            )
        )
    }

    const incrementClickCount = l => async () => {
        try {
            const result = await axios.put(`${process.env.API}/click-count`, { linkId: l._id })
            const currentLinkIndex = allLinks.findIndex(link => link._id == l._id)
            var tempAllLinks = [...allLinks]
            tempAllLinks[currentLinkIndex].clicks = result.data.clicks
            setAllLinks(tempAllLinks)
        } catch (err) {
            console.error("Error while incrementing the click count")
            console.log(err)
        }
    }

    const listOfLinks = () => {
        return allLinks.map((l, i) => (
            <div key={i} className={`row alert alert-primary p-2 ${styles.linkdiv}`}>
                <div onClick={incrementClickCount(l)} className='col-md-8'>
                    <a href={l.url} target="_blank">
                        <h5 className='pt-2'>{l.title}</h5>
                    </a>
                </div>
                <div className='col-md-4 pt-2'>
                    <span className='pull-right'> {calculateDate(l.createdAt)} by {l.postedBy.name} </span>
                </div>
                <div className='col-md-12'>
                    <span className='badge text-dark'>
                        {l.type} / {l.medium}
                    </span>
                    {l.categories.map((c, k) => {
                        return <span key={k} className='badge text-success'>{c.name}</span>
                    })}
                    <span className='badge text-secondary pull-right'>{l.clicks} clicks</span>
                </div>
            </div>
        ))
    }

    return (
        <Layout>
            <div className='row'>
                <div className='col-md-8'>
                    <h1 className='display-4 font-weight-bold'>{category.name} - URL/Links</h1>
                    <div className='lead alert alert-secondary pt-4'>{category.content}</div>
                </div>
                <div className='col-md-4'>
                    <img src={category.image.url} alt={category.name} className={`${styles.image} `} />
                </div>
            </div>
            <br />
            <hr />
            <div className='row mt-5'>
                <div className={`col-md-8 ${styles.linkTotalDiv}`} >
                    {listOfLinks()}
                    {loadMoreButton()}
                </div>
                <div className='col-md-4'>
                    Popular links
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    let skip = 0;
    let limit = 2;

    const { slug } = context.params

    const response = await axios.post(`${process.env.API}/category/${slug}`, { skip, limit })
    return {
        props: {
            category: response.data.category,
            links: response.data.links,
            totalLinksLoaded: response.data.links.length,
            linksLimit: limit,
            linkSkip: skip
        },
    }
}

export default Links