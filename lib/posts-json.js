// Import the Node.js 'fs' (file system) module for file operations.
import fs from 'fs';
// Import the Node.js 'path' module for working with file and directory paths.
import path from 'path';

// Define the directory where post data is stored. 'process.cwd()' gets the current working directory.
const dataDir = path.join(process.cwd(), 'data');

// Function to read and parse the 'posts.json' file.
function readPostsJson() {
    // Construct the full file path to 'posts.json'.
    const filePath = path.join(dataDir, 'posts.json');
    // Read the content of the file synchronously as a UTF-8 string.
    const jsonString = fs.readFileSync(filePath, 'utf8');
    // Parse the JSON string into a JavaScript object and return it.
    return JSON.parse(jsonString);
}

// Function to get all posts data, sorted by title.
export function getSortedPostsData() {
    // Read the raw JSON post data.
    const jsonObj = readPostsJson();
    // Sort the posts alphabetically by their title.
    jsonObj.sort(function (a, b) {
        // Use 'localeCompare' for proper string comparison.
        return a.title.localeCompare(b.title);
    });
    // Map over the sorted objects to return a consistent structure for each post.
    return jsonObj.map(item => {
        return {
            // Convert id to string, ensuring consistency.
            id: item.id.toString(),
            // Include the post title.
            title: item.title,
            // Include the post date.
            date: item.date,
            // Include the post author.
            author: item.author,
        }
    });
}

// Function to get all post IDs for dynamic routing.
export function getAllPostIds() {
    // Read the raw JSON post data.
    const jsonObj = readPostsJson();
    // Map over the posts to return an array of objects with 'params.id'.
    return jsonObj.map(item => {
        return {
            params: {
                // Convert id to string as expected by Next.js dynamic routes.
                id: item.id.toString()
            }
        }
    });
}

// Function to get data for a single post by its ID.
export function getPostData(id) {
    // Read the raw JSON post data.
    const jsonObj = readPostsJson();
    // Filter the posts to find the one that matches the provided ID.
    const objReturned = jsonObj.filter(obj => {
        // Compare the object's ID (converted to string) with the provided ID.
        return obj.id.toString() === id;
    });
    // Check if a post was found.
    if (objReturned.length === 0) {
        // If no post is found, return a 'Not found' object.
        return {
            id: id,
            title: 'Not found',
            date: '',
            contentHtml: 'Not found'
        }
    } else {
        // If a post is found, return the first (and should be only) matching object.
        return objReturned[0];
    }
}