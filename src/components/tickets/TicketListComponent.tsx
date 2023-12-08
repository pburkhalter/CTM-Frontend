import React, { useState, useEffect, useCallback } from 'react';
import {Button, Input, Select, Space, Table, DatePicker, Flex} from 'antd';
import { CloseOutlined, PlusOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { ColumnsType } from 'antd/es/table/interface';
import {NewTicket, Ticket, TicketsListProps} from "../../features/tickets/types";

const { Option } = Select;

const statusOptions = ["Offen", "Geschlossen", "Freigemeldet", "In Bearbeitung"];
const defaultStatusOptions = ["Offen", "Freigemeldet", "In Bearbeitung"];

const TicketListComponent: React.FC<TicketsListProps> = ({ tickets }) => {
    const [data, setData] = useState<Ticket[]>([]);
    const [newTicket, setNewTicket] = useState<NewTicket>({ name: '', status: 'Offen', deadline: '', responsible: '' });
    const [addingTicket, setAddingTicket] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(defaultStatusOptions);
    const currentUser = localStorage.getItem("fullName")
    const currentUserId = localStorage.getItem("id")

    useEffect(() => {
        setData(tickets);
    }, [tickets]);

    const filterTickets = useCallback(() => {
        let filteredData = tickets.filter(ticket => {
            const matchesSearchText = searchText
                ? ticket.name.toLowerCase().includes(searchText.toLowerCase())
                || ticket.responsible?.fullName.toLowerCase().includes(searchText.toLowerCase())
                : true;
            const matchesStatus = selectedStatuses.length
                ? selectedStatuses.includes(ticket.status.name)
                : true;
            // Update here: Check if the ticket's responsible matches the current user
            const isMyTicket = ticket.responsible && ticket.responsible.id === currentUserId;

            return matchesSearchText && matchesStatus && isMyTicket;
        });

        setData(filteredData);
    }, [tickets, searchText, selectedStatuses, ]); // Add currentUser to the dependency array


    useEffect(() => {
        filterTickets();
    }, [searchText, selectedStatuses]);

    const handleSearchChange = (e: { target: { value: React.SetStateAction<string>; }; }) => setSearchText(e.target.value);

    const handleStatusFilterChange = (selected: string[]) => {
        setSelectedStatuses(selected);
    };

    const clearFilters = () => {
        setSearchText('');
        setSelectedStatuses(defaultStatusOptions);
    };

    const addNewTicketRow = () => {
        setAddingTicket(true);
        setData(currentData => [...currentData, {
            id: 'new',
            name: newTicket.name,
            status: { name: newTicket.status }, // Assuming the status structure
            deadline: newTicket.deadline ? newTicket.deadline : null,
            responsible: {
                email: null, // Assuming null as default for a new ticket
                fullName: newTicket.responsible,
                id: 'responsible-id' // Provide a temporary or default id
            },
            // Set default values for the other properties
            category: 'default-category', // Default value or based on some logic
            createdAt: new Date().toISOString(), // Current date-time
            description: null, // Assuming null as default for a new ticket
            hasComments: false // Assuming false as default for a new ticket
        }]);
    };


    const saveNewTicket = async () => {
        // Save logic
        setAddingTicket(false);
        // Update data with new ticket
    };

    const columns: ColumnsType<Ticket> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => record.id === 'new' ? (
                <Input
                    value={text}
                    onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                    placeholder="Name"
                />
            ) : text
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => record.id === 'new' ? (
                <Select
                    defaultValue={record.status.name}
                    style={{ width: 120 }}
                    onChange={(value) => setNewTicket({ ...newTicket, status: value })}
                >
                    {statusOptions.map(status => (
                        <Option key={status} value={status}>{status}</Option>
                    ))}
                </Select>
            ) : record.status.name
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (text, record) => record.id === 'new' ? (
                <DatePicker
                    format="DD.MM.YYYY"
                    onChange={(date, dateString) => setNewTicket({ ...newTicket, deadline: dateString })}
                    placeholder="Deadline"
                />
            ) : (text ? moment(text).format('DD-MM-YYYY') : '')
        },
        {
            title: 'Responsible',
            dataIndex: 'responsible',
            key: 'responsible',
            render: (_, record) => record.id === 'new' ? (
                <Input
                    value={record.responsible ? record.responsible.fullName : ''}
                    onChange={(e) => setNewTicket({ ...newTicket, responsible: e.target.value })}
                    placeholder="Verantwortlich"
                />
            ) : (record.responsible ? record.responsible.fullName : '')
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => record.id === 'new' ? (
                <Space>
                    <Button
                        icon={<SaveOutlined />}
                        onClick={saveNewTicket}
                        type="link"
                    />
                    <Button
                        icon={<CloseOutlined />}
                        onClick={() => setAddingTicket(false)}
                        type="link"
                    />
                </Space>
            ) : null
        }
    ];

    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Button onClick={clearFilters}>Filter und Sortierung zurücksetzen</Button>
                <Button onClick={filterTickets}>Nur Meine Tickets zeigen</Button>
                <Input
                    addonBefore={<SearchOutlined />}
                    placeholder="Suche nach Ticket oder Verantwortlichem"
                    onChange={handleSearchChange}
                    value={searchText}
                />
                <Select
                    mode="multiple"
                    placeholder="Status filtern"
                    value={selectedStatuses}
                    onChange={handleStatusFilterChange}
                    style={{ width: 200 }}
                    maxTagCount={1}
                    maxTagPlaceholder={selectedItems =>
                        `+${selectedItems.length}`
                    }
                >
                    {statusOptions.map(status => (
                        <Option key={status} value={status}>{status}</Option>
                    ))}
                </Select>
            </Space>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{ defaultPageSize: 100, showSizeChanger: true }}
            />

            <Flex justify={"center"}>
                <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={addNewTicketRow}
                />
            </Flex>


        </>
    );
};

export default TicketListComponent;