// Import the shared page layout component
import Layout from '../../components/layout';
// Import date formatter
import Date from '../../components/date';
// Import css stylesheet
import utilStyles from '../../styles/utils.module.css';

// Import helpers: one to list all ids, one to read a single order's data
import { getAllOrderIds, getOrderData } from '../../lib/data';

// Import Next.js <Head> to set page-specific metadata
import Head from 'next/head';

// Next.js: fetch data for a single order at build time
export async function getStaticProps({ params }) {
    // Read order content/metadata for the given dynamic route id
    const orderData = await getOrderData(params.id);
    // Provide the data to the page component as props
    return {
        props: {
            orderData,
        },
        revalidate: 60, // Re-generate the page at most once every 60 seconds
    };
}

export async function getStaticPaths() {
    // Fetch all order ids to build the list of paths
    const paths = await getAllOrderIds();
    // Return the paths array and disable fallback for unknown routes
    return {
        paths,
        fallback: false,
    };
}

// Page component receives the orderData prop from getStaticProps
export default function Order({ orderData }) {
    // return JSX components
    return (
        <Layout>
            <Head>
                <title>{orderData.item_name}</title>
            </Head>
            <article className={utilStyles.article}>
                <h1 className={utilStyles.headingXl}>{orderData.item_name}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={orderData.date} />
                    <p className={utilStyles.authorText}>Order Number: {orderData.order_number}</p>
                    <p className={utilStyles.authorText}>Price: {orderData.price}</p>
                </div>
                <div className={utilStyles.articleContent} dangerouslySetInnerHTML={{ __html: orderData.contentHtml }} />
            </article>
        </Layout>
    );
}
