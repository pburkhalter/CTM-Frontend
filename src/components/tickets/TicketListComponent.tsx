import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {Button, Input, Select, Space, Table, DatePicker, Flex, Pagination} from 'antd';
import {CloseOutlined, EditOutlined, PlusOutlined, SaveOutlined, SearchOutlined} from '@ant-design/icons';
import moment from 'moment';
import { ColumnsType } from 'antd/es/table/interface';
import {NewTicket, Ticket, TicketsListProps} from "../../features/tickets/types";
import AutoCompleteDropdownComponent from "../custom/AutoCompleteDropdownComponent";
import {User} from "../../features/users/types";
import apiService from "../../api/apiService";
import dayjs from 'dayjs';

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
    const [editingTicketId, setEditingTicketId] = useState<string | null>(null);

    // Pagination state
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    // Function to handle page change
    const handlePageChange = (page: any, pageSize: any) => {
        setPagination({ current: page, pageSize });
        // Additional logic if needed to fetch data, adjust displayed data etc.
    };

    const filterTickets = useCallback(() => {
        let filteredData = tickets.filter(ticket => {
            const matchesSearchText = searchText
                ? ticket.name.toLowerCase().includes(searchText.toLowerCase())
                || (ticket.responsible?.fullName.toLowerCase().includes(searchText.toLowerCase()))
                : true;

            let matchesStatus = true;
            if (selectedStatuses.length > 0) {
                // Filter based on the selected statuses
                matchesStatus = selectedStatuses.includes(ticket.status.name);
            } else {
                // By default, exclude tickets with the status 'Geschlossen'
                matchesStatus = ticket.status.name !== 'Geschlossen';
            }

            return matchesSearchText && matchesStatus;
        });

        setData(filteredData);
    }, [tickets, searchText, selectedStatuses]);


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

    const removeNewTicketRow = () => {
        setData(currentData => currentData.filter(ticket => ticket.id !== 'new'));
    };

    const saveNewTicket = async () => {
        try {
            // API call to save the new ticket
            const response = await apiService.post('tickets/', newTicket, 'accessToken'); // Replace with your actual API call
            if (response.success) {
                setData(currentData => currentData.map(ticket =>
                    ticket.id === 'new' ? { ...response.ticket } : ticket
                ));
            }
            setAddingTicket(false);
        } catch (error) {
            console.error("Error saving ticket:", error);
            // Handle error (e.g., show an error message)
        }
    };

    const handleEditChange = (value: string | User, field: string, id: string) => {
        setData(currentData =>
            currentData.map(ticket => {
                if (ticket.id === id) {
                    if (field === 'status' && typeof value === 'string') {
                        return { ...ticket, status: { name: value } };
                    } else if (field === 'responsible' && typeof value !== 'string') {
                        return { ...ticket, responsible: value }; // Ensure value is a User object
                    } else if (typeof value === 'string') {
                        return { ...ticket, [field]: value };
                    }
                    return ticket;
                } else {
                    return ticket;
                }
            })
        );
    };


    const users: User[] = [
        { email: "user1@example.com", fullName: "User One", id: "1" },
        { email: "user2@example.com", fullName: "User Two", id: "2" },
        // ... more users
    ];

    const handleSelect = (value: string, user: User) => {
        console.log('Selected:', value, user);
        // Additional logic for when a user is selected
    };

    const saveEdit = (id: string) => {
        // Save logic here (API call)
        // After saving:
        setEditingTicketId(null);
        // Update state with new ticket data
    };



    const columns: ColumnsType<Ticket> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                if (record.id === 'new' || record.id === editingTicketId) {
                    return <Input defaultValue={text} onChange={(e) => handleEditChange(e.target.value, 'name', record.id)} />;
                }
                return text;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                if (record.id === 'new' || record.id === editingTicketId) {
                    return (
                        <Select
                            defaultValue={status.name}
                            style={{ width: 120 }}
                            onChange={(value) => handleEditChange(value, 'status', record.id)}
                        >
                            {statusOptions.map(option => (
                                <Option key={option} value={option}>{option}</Option>
                            ))}
                        </Select>
                    );
                }
                return status.name;
            },
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (text, record) => {
                if (record.id === 'new' || record.id === editingTicketId) {
                    return (
                        <DatePicker
                            defaultValue={text ? dayjs(text, "DD-MM-YYYY") : undefined} // Changed from null to undefined
                            format="DD.MM.YYYY"
                            onChange={(date, dateString) => handleEditChange(dateString, 'deadline', record.id)}
                        />
                    );
                }
                return text ? dayjs(text).format('DD-MM-YYYY') : '';
            },
        },
        {
            title: 'Responsible',
            dataIndex: 'responsible',
            key: 'responsible',
            render: (_, record) => {
                if (record.id === 'new' || record.id === editingTicketId) {
                    return (
                        <AutoCompleteDropdownComponent
                            dataSource={users}
                            defaultValue={record.responsible ? record.responsible.fullName : ''}
                            placeholder="Select a user"
                            onChange={(value, user) => handleEditChange(user, 'responsible', record.id)}
                        />
                    );
                }
                return record.responsible ? record.responsible.fullName : '';
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                if (record.id === 'new') {
                    return (
                        <Space>
                            <Button
                                icon={<SaveOutlined />}
                                onClick={() => saveNewTicket()} // Save new ticket logic
                                type="link"
                            />
                            <Button
                                icon={<CloseOutlined />}
                                onClick={() => removeNewTicketRow()} // Remove new ticket logic
                                type="link"
                            />
                        </Space>
                    );
                } else if (record.id === editingTicketId) {
                    return (
                        <Space>
                            <Button
                                icon={<SaveOutlined />}
                                onClick={() => saveEdit(record.id)}
                                type="link"
                            />
                            <Button
                                icon={<CloseOutlined />}
                                onClick={() => setEditingTicketId(null)}
                                type="link"
                            />
                        </Space>
                    );
                } else {
                    return (
                        <Space>
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => setEditingTicketId(record.id)}
                                type="link"
                            />
                            {/* Other actions here */}
                        </Space>
                    );
                }
            },
        }
    ];

    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Flex wrap={"wrap"}>
                    <Button onClick={clearFilters}>Filter und Sortierung zurücksetzen</Button>
                    <Button onClick={filterTickets}>Nur Meine Tickets zeigen</Button>
                    <Input
                        addonBefore={<SearchOutlined />}
                        placeholder="Suche nach Ticket oder Verantwortlichem"
                        onChange={handleSearchChange}
                        value={searchText}
                        width={300}
                    />
                    <Select
                        mode="multiple"
                        placeholder="Status filtern"
                        value={selectedStatuses}
                        onChange={handleStatusFilterChange}
                        maxTagCount={1}
                        maxTagPlaceholder={selectedItems =>
                            `+${selectedItems.length}`
                        }
                    >
                        {statusOptions.map(status => (
                            <Option key={status} value={status}>{status}</Option>
                        ))}
                    </Select>
                </Flex>

            </Space>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false} // Disable the table's own pagination

            />
            <Flex justify={"center"}>
                <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={addNewTicketRow}
                    style={{'marginTop': 20}}
                />
            </Flex>
            <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                onChange={handlePageChange}
                total={data.length} // Adjust based on total data
            />


        </>
    );
};

export default TicketListComponent;