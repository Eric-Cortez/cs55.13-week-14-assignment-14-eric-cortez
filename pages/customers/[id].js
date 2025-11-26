// Import the shared page layout component
import Layout from '../../components/layout';
// Import date formatter
import Date from '../../components/date';
// Import css stylesheet
import utilStyles from '../../styles/utils.module.css';

// Import helpers: one to list all ids, one to read a single customer's data
import { getAllCustomerIds, getCustomerData } from '../../lib/data';

// Import Next.js <Head> to set page-specific metadata
import Head from 'next/head';

// Next.js: fetch data for a single customer at build time
export async function getStaticProps({ params }) {
    // Read customer content/metadata for the given dynamic route id
    const customerData = await getCustomerData(params.id);
    // Provide the data to the page component as props
    return {
        props: {
            customerData,
        },
        revalidate: 60, // Re-generate the page at most once every 60 seconds
    };
}

export async function getStaticPaths() {
    // Fetch all customer ids to build the list of paths
    const paths = await getAllCustomerIds();
    // Return the paths array and disable fallback for unknown routes
    return {
        paths,
        fallback: false,
    };
}

// Page component receives the customerData prop from getStaticProps
export default function Customer({ customerData }) {
    // return JSX components
    return (
        <Layout>
            <Head>
                <title>{customerData.name}</title>
            </Head>
            <article className={utilStyles.article}>
                <h1 className={utilStyles.headingXl}>{customerData.name}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={customerData.date} />
                    <p className={utilStyles.authorText}>Email: {customerData.email}</p>
                    <p className={utilStyles.authorText}>Address: {customerData.address}</p>
                </div>
                <div className={utilStyles.articleContent} dangerouslySetInnerHTML={{ __html: customerData.contentHtml }} />
            </article>
        </Layout>
    );
}
