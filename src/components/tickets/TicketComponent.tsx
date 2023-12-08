import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Divider, Switch } from "antd";
import { AppDispatch, RootState } from '../../store/store';
import TicketListComponent from './TicketListComponent';
import { fetchAllProjects, fetchMyProjects } from "../../features/projects/projectSlice";
import AuthenticatedLayoutComponent from "../layout/AuthenticatedLayoutComponent";
import { ReloadOutlined } from "@ant-design/icons";
import TicketFullSearchComponent from "./TicketFullSearchComponent";

const TicketComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { myProjects, loading } = useSelector((state: RootState) => state.projects);
    const [showOnlyProjectsWithTickets, setShowOnlyProjectsWithTickets] = useState(false);

    useEffect(() => {
        dispatch(fetchMyProjects());
    }, [dispatch]);

    const handleReloadProjects = () => {
        dispatch(fetchMyProjects());
    };

    const handleSwitchChange = (checked: boolean) => {
        setShowOnlyProjectsWithTickets(checked);
    };

    const projectsToDisplay = showOnlyProjectsWithTickets
        ? myProjects?.filter(project => project.tickets && project.tickets.length > 0)
        : myProjects || [];

    // Extract tickets from each project and flatten them into a single array
    const allTickets = projectsToDisplay.map(project => project.tickets).flat();

    return (
        <AuthenticatedLayoutComponent>
            <Card
                title="Projektübergreifende Suche"
                extra={
                        <Button onClick={handleReloadProjects} icon={<ReloadOutlined />} type="default" />
                }
            >
                <TicketFullSearchComponent tickets={allTickets || []}/>
            </Card>

            <Divider />

            {/* Wrap Switch in a div for better styling */}
            <div style={{ padding: '0 24px', textAlign: 'left' }}> {/* Adjust styling as needed */}
                <span style={{ marginRight: 10 }}>Nur Projekte mit Tickets anzeigen</span>
                <Switch
                    checked={showOnlyProjectsWithTickets}
                    onChange={handleSwitchChange}
                />
            </div>

            {projectsToDisplay.map(project => (
                <Card
                    key={project.id}
                    title={project.name}
                    extra={<Button onClick={handleReloadProjects} icon={<ReloadOutlined />} type="default" />}
                >
                    {/* Pass only the tickets for this specific project */}
                    <TicketListComponent tickets={project.tickets || []}/>
                </Card>
            ))}
        </AuthenticatedLayoutComponent>
    );
};

export default TicketComponent;
