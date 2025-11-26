import got from 'got';

// WP REST API Products endpoint (custom post type 'product')
const dataURL = 'https://dev-srjc-fall-2025-cs-55-13.pantheonsite.io/wp-json/wp/v2/product';

// Helper: fetch products from the WP REST API and return as JSON array.
async function fetchProducts() {
    try {
        // Cache-bust to avoid stale data during development/builds
        const urlWithCacheBust = `${dataURL}?cacheBust=${new Date().getTime()}`;
        const response = await got(urlWithCacheBust);
        return JSON.parse(response.body);
    } catch (error) {
        // Log the error and return an empty array so pages can still build.
        console.error('Error fetching products from WP API:', error.message || error);
        return [];
    }
}

// Helper: fetch a single product by ID from WP REST API
async function fetchProductById(id) {
    try {
        const url = `${dataURL}/${encodeURIComponent(id)}?cacheBust=${new Date().getTime()}`;
        const response = await got(url);
        return JSON.parse(response.body);
    } catch (error) {
        console.error(`Error fetching product id=${id} from WP API:`, error.message || error);
        return null;
    }
}

// Primary exported functions used by the pages in this project.

// Return a list of products sorted by title. Each item is { id, title, date, author, contentHtml }
// Map product item to the shape expected by pages
function mapProduct(item) {
    const acf = item && item.acf ? item.acf : {};
    const titleFromACF = acf.product_name;
    const descFromACF = acf.description;
    return {
        id: (item.id || '').toString(),
        title: titleFromACF || (item.title && item.title.rendered) || 'Untitled',
        date: item.date || '',
        author: item.author || '',
        // prefer ACF description; fall back to content.rendered
        contentHtml: descFromACF || (item.content && item.content.rendered) || '',
    };
}

// Return a list of products sorted by title. Each item is { id, title, date, author, contentHtml }
export async function getSortedList() {
    const items = await fetchProducts();

    items.sort((a, b) => {
        const ta = (a.acf && a.acf.product_name) || (a.title && a.title.rendered) || '';
        const tb = (b.acf && b.acf.product_name) || (b.title && b.title.rendered) || '';
        return ta.localeCompare(tb);
    });

    return items.map(mapProduct);
}

// Return array of path params for Next.js dynamic routes: [{ params: { id } }, ...]
export async function getAllPostIds() {
    return getAllIds();
}

// Return data for a single product/post by ID.
export async function getPostData(id) {
    return getData(id);
}

// ----- Aliases: some guides/examples use different function names. Export aliases so
// the user's request names (getAllIds, getSortedList, getData) are available too.
export async function getAllIds() {
    const items = await fetchProducts();
    return items.map((item) => ({ params: { id: (item.id || '').toString() } }));
}
export async function getData(id) {
    // Try fetching the single product directly
    const found = await fetchProductById(id);
    if (!found) {
        return {
            id,
            title: 'Not found',
            date: '',
            author: '',
            contentHtml: '<p>Content not found</p>',
        };
    }
    return mapProduct(found);
}

// Backwards-compatible wrapper used in existing pages
export async function getSortedPostsData() {
    return getSortedList();
}