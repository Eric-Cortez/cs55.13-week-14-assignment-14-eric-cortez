// Import date parsing and formatting utilities from date-fns
import { parseISO, format, isValid } from 'date-fns';

// Component accepts an ISO date string and renders a formatted <time>
export default function Date({ dateString }) {
    // Convert ISO8601 string to a Date object
    // defensive: ensure we have a string and a valid Date to avoid RangeError
    if (!dateString) return null;

    const date = parseISO(dateString);
    if (!isValid(date)) {
        // fallback: render the original string (or nothing) if parsing fails
        return <time dateTime={dateString}>{dateString}</time>;
    }

    return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
}