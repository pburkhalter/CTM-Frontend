import React, { useState } from 'react';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { Ticket } from "../../features/tickets/types";
import moment from 'moment';
import { SorterResult } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";

interface TicketsListProps {
    tickets: Ticket[];
}

const TicketsFullSearchComponent: React.FC<TicketsListProps> = ({ tickets }) => {
    const [sortedInfo, setSortedInfo] = useState<SorterResult<Ticket>>({});
    const [searchText, setSearchText] = useState('');

    const formatDateTime = (date: string | null) => date ? moment(date).format('DD/MM/YYYY HH:mm') : 'N/A';
    const formatCost = (cost: number | null) => cost ? `$${cost.toFixed(2)}` : 'Free';

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const clearAll = () => {
        setSortedInfo({});
        setSearchText('');
    };

    const seeMyTickets = () => {
        setSortedInfo({});
        setSearchText(localStorage.getItem('fullName') || '');
    };

    const columns: ColumnsType<Ticket> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Kosten',
            dataIndex: 'cost',
            key: 'cost',
            render: cost => formatCost(cost),
            sorter: (a, b) => {
                const costA = a.cost === null ? 0 : a.cost;
                const costB = b.cost === null ? 0 : b.cost;
                return costA - costB;
            },
        },
        {
            title: 'Erstellt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: createdAt => formatDateTime(createdAt),
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
    ];

    const filteredTickets = searchText.length > 0 ? tickets.filter(ticket =>
        ticket.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (ticket.responsible && ticket.responsible.fullName.toLowerCase().includes(searchText.toLowerCase()))
    ) : [];

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
                    style={{ width: 400 }}
                />
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

export default TicketsFullSearchComponent;