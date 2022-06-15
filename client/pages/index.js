import Layout from '../components/Layout.js'
import axios from 'axios'
import Link from 'next/link.js';
import styles from './index.module.css'

const HomePage = ({ categories }) => {

    console.log(categories)

    const list = categories.map((c, i) => {
        return (
            <Link href={`/links/${c.slug}`} key={i}>
                <a className={`${styles.tutorialBox} ${styles.noUnderline} col-md-3`} >
                    <div className={` ${styles.bigBox} mr-1 mb-4 p-2`}>
                        <div className='row'>
                            <div className='col-md-4'>
                                <img src={c.image.url} alt="Image" className={`${styles.image}`} />
                            </div>
                            <div className={` ${styles.boxTextParent} col-md-8`}>
                                <div className={styles.boxText}>{c.name}</div>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
        )
    });

    return <Layout>
        <div className='row'>
            <div className='col-md-12'>
                <h1 className='font-weight-bold'>Browse the following tutorials</h1>
                <br />
                <br />
            </div>
        </div>

        <div className='row'>{list}</div>
    </Layout>
}

export async function getStaticProps() {
    const response = await axios(`${process.env.API}/categories`);

    return {
        props: {
            categories: response.data,
        },
        // Next.js will attempt to re-generate the page every 10 seconds
        revalidate: 10, // In seconds
    }
}

export default HomePage