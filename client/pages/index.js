import Layout from '../components/Layout.js'
import axios from 'axios'
import Link from 'next/link.js';

const HomePage = ({ categories }) => {

    const list = categories.map(c => {
        return (
            <Link href="/">
                <a className="bg-light col-md-3" >
                    <div style={{ border: '1px solid black', borderRadius: '5px' }} className='m-1 p-1'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <img src={c.image.url} alt="Image" style={{ width: '70px' }} />
                            </div>
                            <div className='col-md-8'>
                                <h2>{c.name}</h2>
                                {/* {c.name} */}
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
                <h1 className='font-weight-bold'>Browse Tutorials</h1>
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