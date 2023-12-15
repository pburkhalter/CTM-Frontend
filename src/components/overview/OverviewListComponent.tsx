import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Table, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { Ticket } from "../../features/tickets/types";
import moment from 'moment';
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

interface TicketsListProps {
    tickets: Ticket[];
}

const OverviewListComponent: React.FC<TicketsListProps> = ({ tickets }) => {
    const [searchText, setSearchText] = useState<string>('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [showOnlyMyTickets, setShowOnlyMyTickets] = useState<boolean>(false);

    useEffect(() => {
        const uniqueStatuses = Array.from(new Set(tickets.map(ticket => ticket.status?.name)))
            .filter(name => name && name !== 'Geschlossen');
        setSelectedStatuses(uniqueStatuses);
    }, [tickets]);

    const formatDateTime = (date: string | null) => date ? moment(date).format('DD.MM.YYYY HH:mm') : 'n/A';

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleStatusFilterChange = (selected: string[]) => {
        setSelectedStatuses(selected);
    };

    const handleShowMyTickets = () => {
        const currentUserFullName = localStorage.getItem('fullName');
        if (showOnlyMyTickets) {
            setSearchText('');
        } else {
            setSearchText(currentUserFullName || '');
        }
        setShowOnlyMyTickets(prev => !prev);
    };

    const clearAll = () => {
        setSearchText('');
        setSelectedStatuses([]);
        setShowOnlyMyTickets(false);
    };

    const statusOptions = Array.from(new Set(tickets.map(ticket => ticket.status?.name).filter(Boolean)));

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(ticket.status?.name);
        const lowerCaseSearchText = searchText.toLowerCase();

        // Safely access properties with a fallback to an empty string
        const ticketName = ticket.name ? ticket.name.toLowerCase() : '';
        const responsibleName = ticket.responsible?.fullName ? ticket.responsible.fullName.toLowerCase() : '';
        const projectName = ticket.project?.name ? ticket.project.name.toLowerCase() : '';

        const matchesSearchText = ticketName.includes(lowerCaseSearchText) ||
            responsibleName.includes(lowerCaseSearchText) ||
            projectName.includes(lowerCaseSearchText);

        const isMyTicket = ticket.responsible?.fullName === localStorage.getItem('fullName');

        return matchesStatus && matchesSearchText && (!showOnlyMyTickets || isMyTicket);
    });



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
            filters: statusOptions.map(status => ({ text: status, value: status })),
            onFilter: (value, record) => record.status?.name === value,
            render: status => status ? status.name : 'N/A',
            sorter: (a, b) => a.status?.name.localeCompare(b.status?.name),
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => moment(a.deadline).unix() - moment(b.deadline).unix(),
            render: deadline => formatDateTime(deadline),
        },
        {
            title: 'Verantwortlich',
            dataIndex: 'responsible',
            key: 'responsible',
            render: responsible => responsible ? responsible.fullName : 'N/A',
            sorter: (a, b) => a.responsible?.fullName.localeCompare(b.responsible?.fullName),
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
                    placeholder="Suche nach Ticket, Verantwortlichem oder Projekt"
                    onChange={handleSearch}
                    value={searchText}
                />
                <Select
                    mode="multiple"
                    placeholder="Status filtern"
                    value={selectedStatuses}
                    onChange={handleStatusFilterChange}
                    style={{ width: 200 }}
                >
                    {statusOptions.map(status => (
                        <Option key={status} value={status}>{status}</Option>
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
                    emptyText: 'Alles erledigt! Keine Tickets verfügbar.',
                }}
            />
        </>
    );
};

export default OverviewListComponent;
