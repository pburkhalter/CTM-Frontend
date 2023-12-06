import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Button, Card, Divider} from "antd";
import {AppDispatch, RootState} from '../../store/store';
import OverviewListComponent from './OverviewListComponent';
import {fetchAllProjects, fetchMyProjects} from "../../features/projects/projectSlice";
import AuthenticatedLayoutComponent from "../layout/AuthenticatedLayoutComponent";
import {ReloadOutlined} from "@ant-design/icons";
import moment from 'moment';


const OverviewComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { myProjects, loading } = useSelector((state: RootState) => state.projects);

    useEffect(() => {
        dispatch(fetchMyProjects());
    }, [dispatch]);

    const handleReloadProjects = () => {
        dispatch(fetchMyProjects());
    };

    useEffect(() => {
        dispatch(fetchMyProjects());
    }, [dispatch]);

    const projectsToDisplay = myProjects || [];

    // Extract tickets from each project, include project info, and flatten into a single array
    const allTicketsWithProject = projectsToDisplay.flatMap(project =>
        project.tickets.map(ticket => ({
            ...ticket,
            projectName: project.name // Add project name to each ticket
        }))
    );
    // Calculate the start and end of the current week
    const startOfWeek = moment().startOf('isoWeek'); // Use 'isoWeek' for Monday-Sunday week
    const endOfWeek = moment().endOf('isoWeek');
    const weekNumber = startOfWeek.isoWeek();

    // Format the date range string
    const formattedStart = startOfWeek.format('DD.MM.YYYY');
    const formattedEnd = endOfWeek.format('DD.MM.YYYY');
    const dateRangeString = `Meine Tickets KW${weekNumber} (${formattedStart} - ${formattedEnd})`;


    // Filter tickets that fall within the current week
    const currentWeekTickets = allTicketsWithProject.filter(ticket => {
        const ticketDate = moment(ticket.deadline);
        return ticketDate.isBetween(startOfWeek, endOfWeek, undefined, '[]');
    });

    return (
        <AuthenticatedLayoutComponent>
            <Card title={dateRangeString}>
                <OverviewListComponent tickets={currentWeekTickets || []}/>
            </Card>
        </AuthenticatedLayoutComponent>
    );
};

export default OverviewComponent;
