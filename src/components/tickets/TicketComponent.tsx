import React, {useEffect, useMemo, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Collapse, Divider, Flex, Switch } from "antd";
import { AppDispatch, RootState } from '../../store/store';
import TicketListComponent from './TicketListComponent';
import { fetchMyProjects } from "../../features/projects/projectSlice";
import AuthenticatedLayoutComponent from "../layout/AuthenticatedLayoutComponent";
import TicketFullSearchComponent from "./TicketFullSearchComponent";
import { Project } from "../../features/projects/types";
import { Status } from "../../features/status/types";

const TicketComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { myProjects } = useSelector((state: RootState) => state.projects);
    const [showNonArchivedProjects, setShowNonArchivedProjects] = useState(true);
    const [showProjectsWithActiveTickets, setShowProjectsWithActiveTickets] = useState(true);

    useEffect(() => {
        const savedShowNonArchived = localStorage.getItem('showNonArchivedProjects');
        const savedShowActiveTickets = localStorage.getItem('showProjectsWithActiveTickets');

        if (savedShowNonArchived !== null) {
            setShowNonArchivedProjects(JSON.parse(savedShowNonArchived));
        }

        if (savedShowActiveTickets !== null) {
            setShowProjectsWithActiveTickets(JSON.parse(savedShowActiveTickets));
        }

        dispatch(fetchMyProjects());
    }, [dispatch]);

    const handleReloadProjects = () => {
        dispatch(fetchMyProjects());
    };

    const handleNonArchivedSwitchChange = (checked: boolean) => {
        localStorage.setItem('showNonArchivedProjects', JSON.stringify(checked));
        setShowNonArchivedProjects(checked);
    };

    const handleActiveTicketsSwitchChange = (checked: boolean) => {
        localStorage.setItem('showProjectsWithActiveTickets', JSON.stringify(checked));
        setShowProjectsWithActiveTickets(checked);
    };

    const projectsToDisplay = useMemo(() => myProjects.filter(project => {
        const isNonArchived = !showNonArchivedProjects || !project.isArchived;
        const hasActiveTickets = !showProjectsWithActiveTickets || project.tickets.some(ticket =>
            ['Offen', 'In Bearbeitung', 'Freigemeldet'].includes(ticket.status.name)
        );
        return isNonArchived && hasActiveTickets;
    }), [myProjects, showNonArchivedProjects, showProjectsWithActiveTickets]);

    const allTicketsWithProject = projectsToDisplay.flatMap(project =>
        project.tickets.map(ticket => ({
            ...ticket,
            projectName: project.name
        }))
    );

    const formatProjectHeader = (project: Project) => {
        return (
            <Flex wrap={'wrap'}>
                <div style={{ minWidth: '400px' }}>
                    <span>{project.name}</span>
                </div>
                <Flex>
                    {project.statuses.map((status: Status) => (
                        <div style={{ minWidth: '150px' }}>
                            <span key={status.id} style={{ marginRight: '10px', fontWeight: '500' }}>
                                {status.name}: {status.ticket_count}
                            </span>
                        </div>

                    ))}
                </Flex>
            </Flex>
        );
    };


    return (
        <AuthenticatedLayoutComponent>
            <Card title="Projektübergreifende Suche">
                <TicketFullSearchComponent tickets={allTicketsWithProject}/>
            </Card>

            <Divider />

            <Flex gap={20}>
                <div>
                    <span style={{ marginRight: 10 }}>Nur nicht archivierte Projekte anzeigen</span>
                    <Switch
                        checked={showNonArchivedProjects}
                        onChange={handleNonArchivedSwitchChange}
                    />
                </div>
                <div>
                    <span style={{ marginRight: 10 }}>Nur Projekte mit aktiven Tickets anzeigen</span>
                    <Switch
                        checked={showProjectsWithActiveTickets}
                        onChange={handleActiveTicketsSwitchChange}
                    />
                </div>
            </Flex>

            <Collapse>
                {projectsToDisplay.map(project => (
                    <Collapse.Panel
                        header={formatProjectHeader(project)}
                        key={project.id}
                    >
                        <TicketListComponent project={project}/>
                    </Collapse.Panel>
                ))}
            </Collapse>
        </AuthenticatedLayoutComponent>
    );
};

export default TicketComponent;
