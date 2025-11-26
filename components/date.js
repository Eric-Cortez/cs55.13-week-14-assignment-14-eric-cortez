// Import date parsing and formatting utilities from date-fns
import { parseISO, format } from 'date-fns';

// Component accepts an ISO date string and renders a formatted <time>
export default function Date({ dateString }) {
    // Convert ISO8601 string to a Date object
    const date = parseISO(dateString);
    return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
}