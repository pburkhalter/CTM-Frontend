export interface Project {
    id: string;
    isArchived: boolean;
    lastUpdated: string;
    name: string;
    tickets: any[]; // Define a more specific type for tickets if available
}
