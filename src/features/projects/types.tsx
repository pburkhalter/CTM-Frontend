import {Ticket} from "../tickets/types";
import {Status} from "../status/types";
import {User} from "../users/types";

export interface Project {
    id: string;
    isArchived: boolean;
    lastUpdated: string;
    name: string;
    tickets: Ticket[];
    statuses: Status[];
    members: User[]
}
