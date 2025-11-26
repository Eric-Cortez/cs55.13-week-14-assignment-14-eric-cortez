// Import the Head component from Next.js for managing document head elements
import Head from 'next/head';
// Import the Layout component and siteTitle from the layout component
import Layout, { siteTitle } from '../components/layout';
// Import utility styles from the utils CSS module
import utilStyles from '../styles/utils.module.css';
// Import component-specific styles from the Home CSS module
import styles from '../styles/Home.module.css'
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import date formatter
import Date from '../components/date';

// Import helper that returns blog posts sorted by date
import { getSortedPostsData, getSortedProductData, getSortedOrderData, getSortedCustomerData } from '../lib/data'; // Changed from posts.js to posts-json.js

// Next.js build-time data fetch: runs at build, not on the client
export async function getStaticProps() {
  // Read and sort posts data from the filesystem
  const allPostsData = await getSortedPostsData();
  const allProductsData = await getSortedProductData();
  const allOrdersData = await getSortedOrderData();
  const allCustomersData = await getSortedCustomerData();
  // Return props object that will be passed to the page component
  return {
    // Props key required by Next.js for passing data to the page
    props: {
      // The array of posts made available as a prop to the Home component
      allPostsData,
      allProductsData,
      allOrdersData,
      allCustomersData,
    },
    revalidate: 60, // Re-generate the page at most once every 60 seconds
  };
}

// Define and export the default Home component function and add incoming props
// allPostsData comes from getStaticProps at build time
export default function Home({ allPostsData, allProductsData, allOrdersData, allCustomersData }) {
  // Return the JSX structure for the home page
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p className={`${styles.introText} ${styles.bgColor}`}>
          Hello, I'm Eric. I'm a software engineer with over 4 years of experience in the tech industry.
          I enjoy building dynamic, scalable applications that are intuitive and user-friendly.
          My passion lies in solving complex problems, learning new technologies, and collaborating with others to create impactful software solutions.
          In my free time, I like exploring new programming languages and contributing to open source projects.
        </p>
        <p className={styles.secondaryText}>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Products</h2>
        <ul className={utilStyles.list}>
          {/* Iterate products and render basic details */}
          {allProductsData.map(({ id, date, title, sku, price }) => (
            <li className={`${utilStyles.listItem} ${styles.postListItem}`} key={id}>
              <Link className={styles.postListItemTitle} href={`/products/${id}`}>{title}</Link>
              <br />
              <small className={`${utilStyles.lightText} ${styles.postListItemMeta}`}>
                <Date dateString={date} />
                <p className={utilStyles.authorText}>SKU: {sku}</p>
                <p className={utilStyles.authorText}>Price: {price}</p>
              </small>
            </li>
          ))}
        </ul>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Orders</h2>
        <ul className={utilStyles.list}>
          {/* Iterate orders and render basic details */}
          {allOrdersData.map(({ id, date, item_name, order_number, price, count }) => (
            <li className={`${utilStyles.listItem} ${styles.postListItem}`} key={id}>
              <Link className={styles.postListItemTitle} href={`/orders/${id}`}>{item_name}</Link>
              <br />
              <small className={`${utilStyles.lightText} ${styles.postListItemMeta}`}>
                <Date dateString={date} />
                <p className={utilStyles.authorText}>Order #: {order_number}</p>
                <p className={utilStyles.authorText}>Price: {price}</p>
                <p className={utilStyles.authorText}>Count: {count}</p>
              </small>
            </li>
          ))}
        </ul>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Customers</h2>
        <ul className={utilStyles.list}>
          {/* Iterate customers and render basic details */}
          {allCustomersData.map(({ id, date, name, email, address, age }) => (
            <li className={`${utilStyles.listItem} ${styles.postListItem}`} key={id}>
              <Link className={styles.postListItemTitle} href={`/customers/${id}`}>{name}</Link>
              <br />
              <small className={`${utilStyles.lightText} ${styles.postListItemMeta}`}>
                <Date dateString={date} />
                <p className={utilStyles.authorText}>Email: {email}</p>
                <p className={utilStyles.authorText}>Address: {address}</p>
                <p className={utilStyles.authorText}>Age: {age}</p>
              </small>
            </li>
          ))}
        </ul>
      </section>
      {/* Blog list rendered from build-time data */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Posts</h2>
        <ul className={utilStyles.list}>
          {/* Iterate posts and render basic details */}
          {allPostsData.map(({ id, date, title, author }) => (
            <li className={`${utilStyles.listItem} ${styles.postListItem}`} key={id}>
              <Link className={styles.postListItemTitle} href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={`${utilStyles.lightText} ${styles.postListItemMeta}`}>
                <Date dateString={date} />
                <p className={utilStyles.authorText}>By User-{author}</p>
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
  // End of the Home component function
}
// End of the Home component