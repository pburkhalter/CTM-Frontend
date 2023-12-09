import {Project} from "../projects/types";

export interface Ticket {
    category: string | null;
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
    status: {
        name: string;
        id: string;
    };
}

export interface NewTicketWithAPI {
    projectId: string,
    responsibleId: string,
    name: string,
    description: string,
    deadline: string,
    statusId: string
}

export interface TicketStatusUpdate {
    id: string,
    statusId: string
}

export interface TicketsListProps {
    project: Project;
}
