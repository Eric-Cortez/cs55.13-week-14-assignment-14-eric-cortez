// Import the shared page layout component
import Layout from '../../components/layout';
// Import date formatter
import Date from '../../components/date';
// Import css stylesheet
import utilStyles from '../../styles/utils.module.css';

// Import helpers: one to list all ids, one to read a single post
import { getAllPostIds, getPostData } from '../../lib/data'; // Changed from posts.js to posts-json.js
// Import Next.js <Head> to set page-specific metadata
import Head from 'next/head';

// Next.js: fetch data for a single post at build time
export async function getStaticProps({ params }) {
    // Read post content/metadata for the given dynamic route id
    const postData = await getPostData(params.id);
    // Provide the data to the page component as props
    return {
        props: {
            postData,
        },
    };
}


export async function getStaticPaths() {
    // Fetch all post ids to build the list of paths
    const paths = await getAllPostIds();
    // Return the paths array and disable fallback for unknown routes
    return {
        paths,
        fallback: false,
    };
}


// Page component receives the postData prop from getStaticProps
export default function Post({ postData }) {
    // return JSX components
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article className={utilStyles.article}>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                    <p className={utilStyles.authorText}>By User-{postData.author}</p>
                </div>
                <div className={utilStyles.articleContent} dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    );
}