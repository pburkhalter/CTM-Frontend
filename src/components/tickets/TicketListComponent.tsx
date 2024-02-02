import React, {useState, useEffect, useCallback} from 'react';
import {Button, Input, Select, Space, Table, DatePicker, Flex, Pagination, Tooltip} from 'antd';
import {
    CloseOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
    SaveOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table/interface';
import {NewTicketWithAPI, Ticket, TicketsListProps} from "../../features/tickets/types";
import AutoCompleteDropdownComponent from "../custom/AutoCompleteDropdownComponent";
import {User} from "../../features/users/types";
import apiService from "../../api/apiService";
import dayjs from 'dayjs';
import {createTicket} from "../../features/tickets/ticketSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/store";
import moment from "moment";
const { Option } = Select;

const statusOptions = ["Offen", "Geschlossen", "Freigemeldet", "In Bearbeitung"];
const defaultStatusOptions = ["Offen", "Freigemeldet", "In Bearbeitung"];

const TicketListComponent: React.FC<TicketsListProps> = ({ project }) => {
    const [data, setData] = useState<Ticket[]>([]);
    const [addingTicket, setAddingTicket] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(defaultStatusOptions);
    const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [showOnlyMyTickets, setShowOnlyMyTickets] = useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();
    const convertToDateObject = (dateString: moment.MomentInput) => {
        const date = moment(dateString, 'DD.MM.YYYY');
        if (!date.isValid()) {
            throw new Error('Invalid date');
        }
        return date.toDate();
    };

    const filterTickets = useCallback(() => {

        // Identify the current user
        const currentUserFullName = localStorage.getItem('fullName');

        let filteredData = project.tickets.filter(ticket => {
            const matchesSearchText = searchText
                ? (ticket.name && ticket.name.toLowerCase().includes(searchText.toLowerCase())) ||
                (ticket.responsible?.fullName && ticket.responsible.fullName.toLowerCase().includes(searchText.toLowerCase()))
                : true;

            const matchesStatus = selectedStatuses.length > 0
                ? selectedStatuses.includes(ticket.status.name)
                : ticket.status.name !== 'Geschlossen';

            const matchesCurrentUser = !showOnlyMyTickets || (ticket.responsible?.fullName === currentUserFullName);

            return matchesSearchText && matchesStatus && matchesCurrentUser;
        });

        // Apply pagination
        const startIndex = (pagination.current - 1) * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setData(paginatedData);
    }, [project.tickets, searchText, selectedStatuses, pagination, showOnlyMyTickets]);

    useEffect(() => {
        filterTickets();
    }, [filterTickets, searchText, selectedStatuses]);

    const handleSearchChange = (e: { target: { value: React.SetStateAction<string>; }; }) => setSearchText(e.target.value);

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

    const clearFilters = () => {
        setSearchText('');
        setSelectedStatuses([]);
        setShowOnlyMyTickets(false);
    };

    const findStatusIdByName = (name: string | null) => {
        const status = project.statuses.find(status => status.name === name);
        return status ? status.id : null;
    };

    const findResponsibleIdByName = (name: string) => {
        const member = project.members.find(member => member.fullName === name);
        return member ? member.id : null;
    };


    const addNewTicketRow = () => {
        const newTicketRow: Ticket = {
            id: `new-${Date.now()}`,
            name: '',
            status: {
                name: 'Offen',
                id: ''
            },
            deadline: '',
            responsible: {
                email: null,
                fullName: '',
                id: ''
            },
            category: null,
            createdAt: new Date().toISOString(),
            description: null,
            hasComments: false,
            project: {
                name: null,
                id: null
            }
        };
        setData(currentData => [...currentData, newTicketRow]);
    };

    const removeNewTicket = () => {
        setData(currentData => currentData.filter(ticket => !ticket.id.startsWith('new')));
    };

    const saveNewTicket = async () => {
        try {
            // Ensure that there is a new ticket to save
            const newTicketRow = data.find(ticket => ticket.id.startsWith('new-'));
            if (!newTicketRow) {
                console.error("No new ticket row found");
                return;
            }

            // Check for status and responsible existence
            if (!newTicketRow.status?.name || !newTicketRow.responsible?.fullName) {
                console.error("Status or responsible information is missing");
                return;
            }

            const statusId = findStatusIdByName(newTicketRow.status.name);
            const responsibleId = findResponsibleIdByName(newTicketRow.responsible.fullName);

            if (!statusId || !responsibleId) {
                console.error("Status or responsible ID not found");
                return;
            }

            const ticketData = {
                ...newTicketRow,
                projectId: project.id,
                statusId: statusId,
                responsibleId: responsibleId,
                deadline: newTicketRow.deadline ? convertToDateObject(newTicketRow.deadline).toISOString() : ''
            };

            console.log("Ticket Data to be saved:", ticketData);


            const actionResult = await dispatch(createTicket(ticketData as NewTicketWithAPI));

            if (createTicket.fulfilled.match(actionResult)) {
                // Call the API to fetch the updated list of tickets
                const accessToken = localStorage.getItem("accessToken")
                if (accessToken){
                    const updatedTickets = await apiService.get(`projects/${project.id}`, accessToken);
                    console.log(updatedTickets)
                    if (updatedTickets) {
                        // Update the data state with the new list of tickets
                        setData(updatedTickets.tickets);
                    } else {
                        console.error("Failed to fetch updated tickets list");
                    }
                    setAddingTicket(false);
                }

            } else {
                console.error("Ticket creation failed", actionResult.payload);
            }
        } catch (error) {
            console.error("Error saving ticket:", error);
        }
    };

    // Function to save the edited ticket
    const saveEdit = async (id: string) => {
        const ticketToSave = data.find(ticket => ticket.id === id);
        if (ticketToSave) {
            try {
                // API call to update the ticket
                const response = await apiService.put(`tickets/${id}`, ticketToSave, 'accessToken');
                if (response.success) {
                    // Update the local state to reflect the edited ticket
                    setData(currentData => currentData.map(ticket =>
                        ticket.id === id ? { ...ticket, ...response.ticket } : ticket
                    ));
                }
                setEditingTicketId(null);
            } catch (error) {
                console.error("Error updating ticket:", error);
                // Handle error
            }
        }
    };

    const handleEditChange = (value: string | User, field: string, id: string) => {
        setData(currentData =>
            currentData.map(ticket => {
                if (ticket.id === id) {
                    if (field === 'status' && typeof value === 'string') {
                        return { ...ticket, status: { name: value, id: '' } };
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

    const handleFetchProject = () => {
        console.log('click')
    }

    const columns: ColumnsType<Ticket> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => {
                if (!record) return null;

                if (record.id && (record.id.startsWith('new') || record.id === editingTicketId)) {
                    return <Input defaultValue={text} onChange={(e) => handleEditChange(e.target.value, 'name', record.id)} />;
                }
                return text;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => {
                const statusA = a.status ? a.status.name : '';
                const statusB = b.status ? b.status.name : '';
                return statusA.localeCompare(statusB);
            },
            render: (status, record) => {
                if (!record) return null;

                if (record.id && (record.id.startsWith('new') || record.id === editingTicketId)) {
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
            sorter: (a, b) => {
                if(a.deadline === 'N/A' || a.deadline === null) return 1;
                if(b.deadline === 'N/A' || b.deadline === null) return -1;
                return moment(a.deadline).unix() - moment(b.deadline).unix();
            },
            render: (text, record) => {
                if (!record) return null;

                if (record.id && (record.id.startsWith('new') || record.id === editingTicketId)) {
                    return (
                        <DatePicker
                            defaultValue={text ? dayjs(text, "DD-MM-YYYY") : undefined}
                            format="DD.MM.YYYY"
                            onChange={(date, dateString) => handleEditChange(dateString, 'deadline', record.id)}
                        />
                    );
                }
                return text ? dayjs(text).format('DD.MM.YYYY') : '';
            },
        },
        {
            title: 'Verantwortlich',
            dataIndex: 'responsible',
            key: 'responsible',
            sorter: (a, b) => {
                const nameA = a.responsible ? a.responsible.fullName : '';
                const nameB = b.responsible ? b.responsible.fullName : '';
                return nameA.localeCompare(nameB);
            },
            render: (_, record) => {
                if (!record) return null;

                if (record.id && (record.id.startsWith('new') || record.id === editingTicketId)) {
                    return (
                        <AutoCompleteDropdownComponent
                            dataSource={project.members}
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
            title: 'Aktionen',
            key: 'actions',
            render: (_, record) => {
                if (!record) return null;

                if (record.id && record.id.startsWith('new')) {
                    return (
                        <Space>
                            <Button
                                icon={<SaveOutlined />}
                                onClick={() => saveNewTicket()}
                                type="link"
                            />
                            <Button
                                icon={<CloseOutlined />}
                                onClick={() => removeNewTicket()}
                                type="link"
                            />
                        </Space>
                    );
                } else if (record.id && record.id === editingTicketId) {
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
                                disabled={true}
                            />
                        </Space>
                    );
                }
            },
        }
    ];

    return (
        <>
            <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between', display: 'flex' }}>
                <Flex gap={8}>
                    <Button onClick={clearFilters}>Filter und Sortierung zurücksetzen</Button>
                    <Button onClick={handleShowMyTickets}>
                        {showOnlyMyTickets ? 'Alle Tickets anzeigen' : 'Nur meine Tickets anzeigen'}
                    </Button>
                    <Input
                        addonBefore={<SearchOutlined />}
                        placeholder="Suche nach Ticket oder Verantwortlichem"
                        onChange={handleSearchChange}
                        value={searchText}
                        style={{ width: 300 }} // Set the width here
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
                        style={{ minWidth: '200px' }} // Adjust width as needed
                    >
                        {statusOptions.map(status => (
                            <Option key={status} value={status}>{status}</Option>
                        ))}
                    </Select>
                </Flex>

                <Tooltip title="Projekt neu von Campo laden">
                    <Button onClick={handleFetchProject} icon={<ReloadOutlined />} type="default" disabled={true}/>
                </Tooltip>
            </Space>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey="id"

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
                total={project.tickets.length}
                onChange={(page, pageSize) => setPagination({ current: page, pageSize })}
            />


        </>
    );
};

export default TicketListComponent;