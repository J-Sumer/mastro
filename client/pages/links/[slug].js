import Layout from '../../components/Layout'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './slug.module.css'
import { useState } from 'react'

const Links = ({ category, links, totalLinksLoaded, linksLimit, linkSkip }) => {
    const router = useRouter()
    const { slug } = router.query

    const [allLinks, setAllLinks] = useState(links)
    const [limit, setLimit] = useState(linksLimit)
    const [skip, setSkip] = useState(linkSkip)
    const [sizeReceived, setSizeReceived] = useState(totalLinksLoaded)

    // console.table({ links, totalLinksLoaded, linksLimit, linkSkip })

    const calculateDate = (date) => {
        var currentDateFull = new Date()
        var listDateFull = new Date(date)

        if (!date) return undefined

        const [currentMinutes, currentHours, currentDate, currentMonth, currentYear] = [currentDateFull.getMinutes(), currentDateFull.getHours(), currentDateFull.getDate(), currentDateFull.getMonth(), currentDateFull.getFullYear()]
        const [listMinutes, listHours, listDate, listMonth, listYear] = [listDateFull.getMinutes(), listDateFull.getHours(), listDateFull.getDate(), listDateFull.getMonth(), listDateFull.getFullYear()]
        const yearDiff = currentYear - listYear;
        if (yearDiff > 0) {
            return yearDiff === 1 ? `1 year ago` : `${yearDiff} years ago`
        }
        const monthDiff = currentMonth - listMonth;
        if (monthDiff > 0) {
            return monthDiff === 1 ? `1 month ago` : `${monthDiff} months ago`
        }
        const dayDiff = currentDate - listDate;
        if (dayDiff > 0) {
            return dayDiff === 1 ? `1 day ago` : `${dayDiff} days ago`
        }
        const hourDiff = currentHours - listHours;
        if (hourDiff > 0) {
            return hourDiff === 1 ? '1 hour ago' : `${hourDiff} hours ago`
        }
        const minuteDiff = currentMinutes - listMinutes
        if (minuteDiff > 0) {
            return minuteDiff === 1 ? '1 minute ago' : `${minuteDiff} minutes ago`
        }
        return `1 minute ago`
    }

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
                <button onClick={loadMoreLinks} className='btn btn-lg'>Load more</button>
            )
        )
    }

    const listOfLinks = () => {
        return allLinks.map((l, i) => (
            <div key={i} className='row alert alert-primary p-2'>
                <div className='col-md-8'>
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
                    <img src={category.image.url} alt={category.name} className={`${styles.image}`} />
                </div>
            </div>
            <br />
            <hr />
            <div className='row mt-5'>
                <div className='col-md-8'>
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