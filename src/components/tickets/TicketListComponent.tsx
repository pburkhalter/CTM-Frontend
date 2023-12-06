import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Table, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { Ticket } from "../../features/tickets/types";
import moment from 'moment';
import { SearchOutlined } from "@ant-design/icons";
import {SorterResult} from "antd/es/table/interface";

const { Option } = Select;

interface TicketsListProps {
    tickets: Ticket[];
}

const TicketListComponent: React.FC<TicketsListProps> = ({ tickets }) => {
    const [sortedInfo, setSortedInfo] = useState<SorterResult<Ticket>>({});
    const [searchText, setSearchText] = useState<string>('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    useEffect(() => {
        // Extract unique status names, excluding 'Geschlossen'
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

    const clearAll = () => {
        setSearchText('');
        setSelectedStatuses([]);
    };

    // Prepare unique status options for the Select component
    const statusOptions = Array.from(new Set(tickets.map(ticket => ticket.status?.name).filter(Boolean)));

    const statusFilters = statusOptions.map(status => ({
        text: status,
        value: status,
    }));

    const seeMyTickets = () => {
        const myFullName = localStorage.getItem('fullName');
        if (myFullName) {
            setSortedInfo({});
            setSearchText(myFullName ? myFullName.toLowerCase() : ''); // Ensure searchText is always a string
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const ticketName = ticket.name ? ticket.name.toLowerCase() : '';
        const responsibleName = ticket.responsible && ticket.responsible.fullName
            ? ticket.responsible.fullName.toLowerCase()
            : '';
        const isStatusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(ticket.status?.name);
        const isNameMatch = ticketName.includes(searchText.toLowerCase());
        const isResponsibleMatch = responsibleName.includes(searchText.toLowerCase());

        return isStatusMatch && (isNameMatch || isResponsibleMatch);
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
        }
    ]

    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Button onClick={clearAll}>Filter und Sortierung zurücksetzen</Button>
                <Button onClick={seeMyTickets}>Nur Meine Tickets zeigen</Button>
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
                    emptyText: 'Keine Daten gefunden',
                }}
            />
        </>
    );
};

export default TicketListComponent;