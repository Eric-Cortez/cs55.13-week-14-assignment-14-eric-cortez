import got from 'got';

const dataURL = 'https://dev-srjc-fall-2025-cs-55-13.pantheonsite.io/wp-json/twentytwentyone-child/v1/latest-posts/1';

// Helper function to fetch and parse post data
async function fetchPosts() {
    try {
        // Add a cache-busting query parameter to prevent stale data
        const urlWithCacheBust = `${dataURL}?cacheBust=${new Date().getTime()}`;
        const response = await got(urlWithCacheBust);
        return JSON.parse(response.body);
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array on error
    }
}

// Function to get all posts data, sorted by title.
export async function getSortedPostsData() {
    const jsonObj = await fetchPosts();

    // Sort the posts alphabetically by their title.
    jsonObj.sort((a, b) => a.post_title.localeCompare(b.post_title));

    // Map over the sorted objects to return a consistent structure.
    return jsonObj.map(item => ({
        id: item.ID.toString(),
        title: item.post_title,
        date: item.post_date.replace(' ', 'T'),
        author: item.post_author,
    }));
}

// Function to get all post IDs for dynamic routing.
export async function getAllPostIds() {
    const jsonObj = await fetchPosts();

    // Map over the posts to return an array of objects with 'params.id'.
    return jsonObj.map(item => ({
        params: {
            id: item.ID.toString(),
        },
    }));
}

// Function to get data for a single post by its ID.
export async function getPostData(id) {
    const jsonObj = await fetchPosts();
    const foundObj = jsonObj.find(obj => obj.ID.toString() === id);

    if (!foundObj) {
        return {
            id: id,
            title: 'Not found',
            date: '',
            post_content: 'Post not found'
        };
    }

    // If a post is found, return a formatted object.
    return {
        id: foundObj.ID.toString(),
        title: foundObj.post_title,
        date: foundObj.post_date.replace(' ', 'T'),
        author: foundObj.post_author,
        post_content: foundObj.post_content
    };
}

// -------------------------------------------------------
// Products data source:

// WP REST API Products endpoint (custom post type 'product')
const productDataURL = 'https://dev-srjc-fall-2025-cs-55-13.pantheonsite.io/wp-json/wp/v2/product';

// Helper: fetch products from the WP REST API and return as JSON array.
async function fetchProducts() {
    try {
        // Cache-bust to avoid stale data during development/builds
        const urlWithCacheBust = `${productDataURL}?cacheBust=${new Date().getTime()}`;
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
        // Use the product endpoint (productDataURL) when fetching a single product by id.
        const url = `${productDataURL}/${encodeURIComponent(id)}?cacheBust=${new Date().getTime()}`;
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
    const skuFromACF = acf.sku;
    return {
        id: (item.id || '').toString(),
        title: titleFromACF || (item.title && item.title.rendered) || 'Untitled',
        date: item.date || '',
        author: item.author || '',
        sku: skuFromACF || '',
        // prefer ACF description; fall back to content.rendered
        contentHtml: descFromACF || (item.content && item.content.rendered) || '',
    };
}

// Return a list of products sorted by title. Each item is { id, title, date, author, contentHtml }
export async function getSortedProductData() {
    const items = await fetchProducts();

    items.sort((a, b) => {
        const ta = (a.acf && a.acf.product_name) || (a.title && a.title.rendered) || '';
        const tb = (b.acf && b.acf.product_name) || (b.title && b.title.rendered) || '';
        return ta.localeCompare(tb);
    });

    return items.map(mapProduct);
}

// ----- Aliases: some guides/examples use different function names. Export aliases so
// the user's request names (getAllIds, getSortedList, getData) are available too.
export async function getAllProductIds() {
    const items = await fetchProducts();
    return items.map((item) => ({ params: { id: (item.id || '').toString() } }));
}
export async function getProductData(id) {
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


// -------------------------------------------------------

// Order data source:
const orderDataURL = 'https://dev-srjc-fall-2025-cs-55-13.pantheonsite.io/wp-json/wp/v2/product_order';

async function fetchOrders() {
    try {
        const urlWithCacheBust = `${orderDataURL}?cacheBust=${new Date().getTime()}`;
        const response = await got(urlWithCacheBust);
        return JSON.parse(response.body);
    } catch (error) {
        console.error('Error fetching orders from WP API:', error.message || error);
        return [];
    }
}

async function fetchOrderById(id) {
    try {
        const url = `${orderDataURL}/${encodeURIComponent(id)}?cacheBust=${new Date().getTime()}`;
        const response = await got(url);
        return JSON.parse(response.body);
    } catch (error) {
        console.error(`Error fetching order id=${id} from WP API:`, error.message || error);
        return null;
    }
}

function mapOrder(item) {
    const acf = item && item.acf ? item.acf : {};
    return {
        id: (item.id || '').toString(),
        item_name: acf.item_name || (item.title && item.title.rendered) || 'Unnamed item',
        order_number: acf.order_number || '',
        price: acf.price || '',
        date: item.date || '',
        contentHtml: acf.description || (item.content && item.content.rendered) || '',
    };
}

export async function getSortedOrderData() {
    const items = await fetchOrders();
    items.sort((a, b) => {
        const ta = (a.acf && a.acf.item_name) || (a.title && a.title.rendered) || '';
        const tb = (b.acf && b.acf.item_name) || (b.title && b.title.rendered) || '';
        return ta.localeCompare(tb);
    });
    return items.map(mapOrder);
}

export async function getAllOrderIds() {
    const items = await fetchOrders();
    return items.map((item) => ({ params: { id: (item.id || '').toString() } }));
}

export async function getOrderData(id) {
    const found = await fetchOrderById(id);
    if (!found) {
        return {
            id,
            item_name: 'Not found',
            order_number: '',
            price: '',
            date: '',
            contentHtml: '<p>Order not found</p>',
        };
    }
    return mapOrder(found);
}

// -------------------------------------------------------

// Customer data source:
const customerDataURL = 'https://dev-srjc-fall-2025-cs-55-13.pantheonsite.io/wp-json/wp/v2/customer';

async function fetchCustomers() {
    try {
        const urlWithCacheBust = `${customerDataURL}?cacheBust=${new Date().getTime()}`;
        const response = await got(urlWithCacheBust);
        return JSON.parse(response.body);
    } catch (error) {
        console.error('Error fetching customers from WP API:', error.message || error);
        return [];
    }
}

async function fetchCustomerById(id) {
    try {
        const url = `${customerDataURL}/${encodeURIComponent(id)}?cacheBust=${new Date().getTime()}`;
        const response = await got(url);
        return JSON.parse(response.body);
    } catch (error) {
        console.error(`Error fetching customer id=${id} from WP API:`, error.message || error);
        return null;
    }
}

function mapCustomer(item) {
    const acf = item && item.acf ? item.acf : {};
    return {
        id: (item.id || '').toString(),
        name: acf.name || (item.title && item.title.rendered) || 'Unnamed',
        address: acf.address || '',
        email: acf.email || '',
        date: item.date || '',
        contentHtml: acf.notes || (item.content && item.content.rendered) || '',
    };
}

export async function getSortedCustomerData() {
    const items = await fetchCustomers();
    items.sort((a, b) => {
        const ta = (a.acf && a.acf.name) || (a.title && a.title.rendered) || '';
        const tb = (b.acf && b.acf.name) || (b.title && b.title.rendered) || '';
        return ta.localeCompare(tb);
    });
    return items.map(mapCustomer);
}

export async function getAllCustomerIds() {
    const items = await fetchCustomers();
    return items.map((item) => ({ params: { id: (item.id || '').toString() } }));
}

export async function getCustomerData(id) {
    const found = await fetchCustomerById(id);
    if (!found) {
        return {
            id,
            name: 'Not found',
            address: '',
            email: '',
            date: '',
            contentHtml: '<p>Customer not found</p>',
        };
    }
    return mapCustomer(found);
}

// -------------------------------------------------------