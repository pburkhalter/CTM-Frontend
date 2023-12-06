import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Button, Card, Divider} from "antd";
import {AppDispatch, RootState} from '../../store/store';
import TicketsListComponent from './TicketsListComponent';
import {fetchAllProjects, fetchMyProjects} from "../../features/projects/projectsSlice";
import AuthenticatedLayoutComponent from "../layout/AuthenticatedLayoutComponent";
import {ReloadOutlined} from "@ant-design/icons";
import TicketsFullSearchComponent from "./TicketsFullSearchComponent";

const TicketsComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { allProjects, myProjects, loading } = useSelector((state: RootState) => state.projects);

    useEffect(() => {
        dispatch(fetchAllProjects());
        dispatch(fetchMyProjects());
    }, [dispatch]);

    const handleReloadProjects = () => {
        dispatch(fetchAllProjects());
        dispatch(fetchMyProjects());
    };

    const projectsToDisplay = myProjects || [];

    // Filter out projects with no tickets
    const projectsWithTickets = projectsToDisplay.filter(project => project.tickets && project.tickets.length > 0);

    // Extract tickets from each project and flatten them into a single array
    const allTickets = projectsWithTickets.map(project => project.tickets).flat();

    return (
        <AuthenticatedLayoutComponent>

            <Card
                title="Projektübergreifende Suche"
                extra={<Button onClick={handleReloadProjects} icon={<ReloadOutlined />} type="default" />}
            >
                <TicketsFullSearchComponent tickets={allTickets || []}/>
            </Card>

            <Divider></Divider>

            {projectsWithTickets.map(project => (
                <Card
                    key={project.id}
                    title={project.name}
                    extra={<Button onClick={handleReloadProjects} icon={<ReloadOutlined />} type="default" />}
                >
                    <TicketsListComponent tickets={project.tickets || []}/>
                </Card>
            ))}
        </AuthenticatedLayoutComponent>
    );
};

export default TicketsComponent;
