export interface Ticket {
    category: string;
    status: any | null;
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

export interface NewTicket {
    name: string;
    status: string; // Assuming status is a simple string for the new ticket
    deadline: string;
    responsible: string; // Assuming responsible is a simple string for the new ticket
}

export interface TicketsListProps {
    tickets: Ticket[];
}
