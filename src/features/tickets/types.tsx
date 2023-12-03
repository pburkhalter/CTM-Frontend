export interface Ticket {
    category: string;
    cost: number | null;
    createdAt: string; // ISO date string
    deadline: string | null; // ISO date string or null
    description: string | null;
    hasComments: boolean;
    id: string;
    name: string;
    responsible: {
        email: string | null;
        fullName: string;
        id: string;
    };
}

