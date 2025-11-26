// Import the shared page layout component
import Layout from '../../components/layout';
// Import date formatter
import Date from '../../components/date';
// Import css stylesheet
import utilStyles from '../../styles/utils.module.css';

// Import helpers: one to list all ids, one to read a single product's data
import { getAllProductIds, getProductData } from '../../lib/data';

// Import Next.js <Head> to set page-specific metadata
import Head from 'next/head';

// Next.js: fetch data for a single product at build time
export async function getStaticProps({ params }) {
    // Read product content/metadata for the given dynamic route id
    const productData = await getProductData(params.id);
    // Provide the data to the page component as props
    return {
        props: {
            productData,
        },
    };
}


export async function getStaticPaths() {
    // Fetch all product ids to build the list of paths
    const paths = await getAllProductIds();
    // Return the paths array and disable fallback for unknown routes
    return {
        paths,
        fallback: false,
    };
}


// Page component receives the productData prop from getStaticProps
export default function Product({ productData }) {

    console.log(productData)
    // return JSX components
    return (
        <Layout>
            <Head>
                <title>{productData.title}</title>
            </Head>
            <article className={utilStyles.article}>
                <h1 className={utilStyles.headingXl}>{productData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={productData.date} />
                    {productData.sku && (
                        <p className={utilStyles.authorText}>SKU: {productData.sku}</p>
                    )}
                </div>
                <div className={utilStyles.articleContent} dangerouslySetInnerHTML={{ __html: productData.contentHtml }} />
            </article>
        </Layout>
    );
}