import React, { useState } from 'react';
import {Button, Input, Select, Space, Table} from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { Ticket } from "../../features/tickets/types";
import moment from 'moment';
import { SorterResult } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";

interface TicketsListProps {
    tickets: Ticket[];
}

const TicketFullSearchComponent: React.FC<TicketsListProps> = ({ tickets }) => {
    const [, setSortedInfo] = useState<SorterResult<Ticket>>({});
    const [searchText, setSearchText] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [showOnlyMyTickets, setShowOnlyMyTickets] = useState<boolean>(false);

    const formatDateTime = (date: string | null) => date ? moment(date).format('DD.MM.YYYY HH:mm') : 'n/A';

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const clearAll = () => {
        setSortedInfo({});
        setSearchText('');
    };

    const statusOptions = Array.from(new Set(tickets.map(ticket => ticket.status?.name).filter(Boolean)));

    const statusFilters = statusOptions.map(status => ({
        text: status,
        value: status,
    }));

    const handleShowMyTickets = () => {
        const currentUserFullName = localStorage.getItem('fullName');
        if (showOnlyMyTickets) {
            setSearchText('');
        } else {
            setSearchText(currentUserFullName || '');
        }
        setShowOnlyMyTickets(prev => !prev);
    };

    const filteredTickets = (searchText.trim() || selectedStatuses.length > 0) ? tickets.filter(ticket => {
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(ticket.status?.name);
        const lowerCaseSearchText = searchText.toLowerCase();

        // Guard against null values
        const ticketName = ticket.name ? ticket.name.toLowerCase() : '';
        const responsibleName = ticket.responsible?.fullName ? ticket.responsible.fullName.toLowerCase() : '';
        const projectName = ticket.project?.name ? ticket.project.name.toLowerCase() : '';

        const matchesSearchText = ticketName.includes(lowerCaseSearchText) ||
            responsibleName.includes(lowerCaseSearchText) ||
            projectName.includes(lowerCaseSearchText);

        const isMyTicket = ticket.responsible?.fullName === localStorage.getItem('fullName');

        return matchesStatus && (matchesSearchText || searchText.trim() === '') && (!showOnlyMyTickets || isMyTicket);
    }) : [];



    const columns: ColumnsType<Ticket> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: statusFilters,
            onFilter: (value, record) => record.status?.name === value,
            render: status => status ? status.name : 'N/A',
            sorter: (a, b) => {
                const statusA = a.status ? a.status.name : '';
                const statusB = b.status ? b.status.name : '';
                return statusA.localeCompare(statusB);
            },
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            render: deadline => formatDateTime(deadline),
            sorter: (a, b) => {
                if(a.deadline === 'N/A' || a.deadline === null) return 1;
                if(b.deadline === 'N/A' || b.deadline === null) return -1;
                return moment(a.deadline).unix() - moment(b.deadline).unix();
            },
        },
        {
            title: 'Verantwortlich',
            dataIndex: 'responsible',
            key: 'responsible',
            render: (_, { responsible }) => responsible ? responsible.fullName : 'N/A',
            sorter: (a, b) => {
                const nameA = a.responsible ? a.responsible.fullName : '';
                const nameB = b.responsible ? b.responsible.fullName : '';
                return nameA.localeCompare(nameB);
            },
        },
        {
            title: 'Projekt',
            dataIndex: 'projectName',
            key: 'projectName',
            render: text => text || 'N/A',
            sorter: (a, b) => {
                const nameA = a.project?.name ?? '';
                const nameB = b.project?.name ?? '';
                return nameA.localeCompare(nameB);
            },
        }
    ];

    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Button onClick={clearAll}>Filter und Sortierung zurücksetzen</Button>
                <Button onClick={handleShowMyTickets}>
                    {showOnlyMyTickets ? 'Alle Tickets anzeigen' : 'Nur meine Tickets anzeigen'}
                </Button>

                <Input
                    addonBefore={<SearchOutlined />}
                    placeholder="Suche nach Ticket oder Verantwortlichem"
                    onChange={handleSearch}
                    value={searchText}
                />

                <Select
                    mode="multiple"
                    placeholder="Status filtern"
                    value={selectedStatuses}
                    onChange={setSelectedStatuses}
                    style={{ width: 200 }}
                >
                    {statusFilters.map(status => (
                        <Select.Option key={status.value} value={status.value}>{status.text}</Select.Option>
                    ))}
                </Select>
            </Space>
            <Table
                columns={columns}
                dataSource={filteredTickets.map(ticket => ({ ...ticket, key: ticket.id }))}
                pagination={{
                    defaultPageSize: 100,
                    pageSizeOptions: ['50', '100', '200'],
                    showSizeChanger: true,
                }}
                locale={{
                    emptyText: 'Starte eine Suche...',
                }}
            />
        </>
    );
};

export default TicketFullSearchComponent;