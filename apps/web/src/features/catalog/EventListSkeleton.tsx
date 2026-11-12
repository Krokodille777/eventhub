export function EventListSkeleton(){
    return (
        <ul className = "event-list" aria-busy = "true" aria-label = "Loading events">
            {Array.from({ length: 3 }, (_, i) => (
                <li key = {i} className = "skeleton-card">
                    <div className = "skeleton-line skeleton-line--title"/>
                    <div className = "skeleton-line skeleton-line--text"/>
                    <div className = "skeleton-line skeleton-line--text"/>
                </li>
            ))}
        </ul>
    );
}
