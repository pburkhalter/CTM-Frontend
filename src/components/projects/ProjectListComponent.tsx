import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Table, Tag } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType, TableRowSelection, TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import {Project} from "../../features/projects/types";

const ProjectListComponent: React.FC<{ projects: Project[], myProjects?: Project[], loadingState: boolean }> = ({ projects, myProjects, loadingState }) => {
    const [sortedInfo, setSortedInfo] = useState<SorterResult<Project>>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');

    // Update selectedRowKeys whenever myProjects changes
    useEffect(() => {
        if (myProjects) {
            const newSelectedKeys = myProjects.map(p => p.id);
            setSelectedRowKeys(newSelectedKeys);
        }
    }, [myProjects]);

    const handleChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<Project> | SorterResult<Project>[]
    ) => {
        setSortedInfo(Array.isArray(sorter) ? sorter[0] : sorter);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const clearAll = () => {
        setSortedInfo({});
    };

    const columns: ColumnsType<Project> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : undefined,
            ellipsis: true,
        },
        {
            title: 'Archiviert',
            dataIndex: 'isArchived',
            key: 'isArchived',
            render: isArchived => (
                isArchived ? <Tag color="green">Ja</Tag> : <Tag color="volcano">Nein</Tag>
            ),
            sorter: (a, b) => Number(a.isArchived) - Number(b.isArchived),
            sortOrder: sortedInfo.columnKey === 'isArchived' ? sortedInfo.order : undefined,
            ellipsis: true,
        },
        {
            title: 'Zuletzt geändert',
            dataIndex: 'lastUpdated',
            key: 'lastUpdated',
            sorter: (a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
            sortOrder: sortedInfo.columnKey === 'lastUpdated' ? sortedInfo.order : undefined,
            ellipsis: true,
        },
        {
            title: 'Anzahl Tickets',
            dataIndex: 'tickets',
            key: 'tickets',
            render: tickets => tickets?.length ?? 0,
            sorter: (a, b) => (a.tickets?.length ?? 0) - (b.tickets?.length ?? 0),
            sortOrder: sortedInfo.columnKey === 'tickets' ? sortedInfo.order : undefined,
            ellipsis: true,
        },
    ];

    const rowSelection: TableRowSelection<Project> = {
        selectedRowKeys,
        getCheckboxProps: record => ({
            disabled: selectedRowKeys.includes(record.id), // Disable checkbox for selected rows
        }),
        onChange: setSelectedRowKeys,
    };

    const filteredProjects = projects && projects.length > 0
        ? projects.filter(project => project.name.toLowerCase().includes(searchText.toLowerCase()))
        : [];

    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Button onClick={clearAll}>Filter und Sortierung zurücksetzen</Button>
                <Input
                    addonBefore={<SearchOutlined />}
                    placeholder="Projekt"
                    onChange={handleSearch}
                    style={{ width: 400 }}
                />
            </Space>
            <Table
                columns={columns}
                dataSource={filteredProjects.map(project => ({ ...project, key: project.id }))}
                loading={loadingState}
                onChange={handleChange}
                pagination={{
                    defaultPageSize: 100,
                    pageSizeOptions: ['50', '100', '200'],
                    showSizeChanger: true,
                }}
            />
        </>
    );
};

export default ProjectListComponent;