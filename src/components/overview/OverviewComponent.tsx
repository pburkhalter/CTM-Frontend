import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Divider } from 'antd';
import { AppDispatch, RootState } from '../../store/store';
import OverviewListComponent from './OverviewListComponent';
import { fetchMyProjects } from '../../features/projects/projectSlice';
import AuthenticatedLayoutComponent from '../layout/AuthenticatedLayoutComponent';
import moment from 'moment';

const OverviewComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { myProjects } = useSelector((state: RootState) => state.projects);

    useEffect(() => {
        dispatch(fetchMyProjects());
    }, [dispatch]);

    const projectsToDisplay = myProjects || [];

    const allTicketsWithProject = projectsToDisplay.flatMap(project =>
        project.tickets.map(ticket => ({
            ...ticket,
            projectName: project.name
        }))
    );

    // Overdue tickets calculations, excluding closed tickets
    const overdueTickets = allTicketsWithProject.filter(ticket => {
        // Check if deadline exists and is not null
        if (!ticket.deadline) {
            return false;
        }

        // Parse the deadline as ISO 8601 format
        const deadlineMoment = moment(ticket.deadline);

        return deadlineMoment.isValid() &&
            deadlineMoment.isBefore(moment(), 'day') &&
            ticket.status.name !== 'Geschlossen';
    });

    // Current week calculations
    const startOfCurrentWeek = moment().startOf('isoWeek');
    const endOfCurrentWeek = moment().endOf('isoWeek');
    const currentWeekNumber = startOfCurrentWeek.isoWeek();
    const currentWeekDateRange = `Tickets KW${currentWeekNumber} (${startOfCurrentWeek.format('DD.MM.YYYY')} - ${endOfCurrentWeek.format('DD.MM.YYYY')})`;

    const currentWeekTickets = allTicketsWithProject.filter(ticket =>
        moment(ticket.deadline).isBetween(startOfCurrentWeek, endOfCurrentWeek, undefined, '[]')
    );

    // Next week calculations
    const startOfNextWeek = moment().add(1, 'weeks').startOf('isoWeek');
    const endOfNextWeek = moment().add(1, 'weeks').endOf('isoWeek');
    const nextWeekNumber = startOfNextWeek.isoWeek();
    const nextWeekDateRange = `Tickets KW${nextWeekNumber} (${startOfNextWeek.format('DD.MM.YYYY')} - ${endOfNextWeek.format('DD.MM.YYYY')})`;

    const nextWeekTickets = allTicketsWithProject.filter(ticket =>
        moment(ticket.deadline).isBetween(startOfNextWeek, endOfNextWeek, undefined, '[]')
    );

    return (
        <AuthenticatedLayoutComponent>
            {/* Overdue Tickets Card (only shown if there are overdue tickets) */}
            {overdueTickets.length > 0 && (
                <>
                    <Card title="Überfällige Tickets">
                        <OverviewListComponent tickets={overdueTickets}/>
                    </Card>
                    <Divider />
                </>
            )}

            {/* Current Week Tickets Card */}
            <Card title={currentWeekDateRange}>
                <OverviewListComponent tickets={currentWeekTickets || []}/>
            </Card>

            {/* Next Week Tickets Card */}
            <Card title={nextWeekDateRange}>
                <OverviewListComponent tickets={nextWeekTickets || []}/>
            </Card>
        </AuthenticatedLayoutComponent>
    );
};

export default OverviewComponent;