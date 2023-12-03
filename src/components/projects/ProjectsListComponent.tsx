import React, { useState } from 'react';
import { Button, Input, Space, Table } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType, TableRowSelection, TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';

interface DataType {
    key: React.Key;
    name: string;
    responsible: string;
    status: string;
    due_date: string;
}

const data: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        responsible: 'Test',
        status: 'test',
        due_date: 'New York No. 1 Lake Park',
    },
    // ... other data items
];

const ProjectListComponent: React.FC<{ projects: any[], loading: boolean }> = ({ projects, loading }) => {
    const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
    const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const handleChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<DataType> | SorterResult<DataType>[]
    ) => {
        setFilteredInfo(filters);
        setSortedInfo(Array.isArray(sorter) ? sorter[0] : sorter);
    };

    const clearFilters = () => {
        setFilteredInfo({});
    };

    const clearAll = () => {
        setFilteredInfo({});
        setSortedInfo({});
    };

    const setStatusSort = () => {
        setSortedInfo({
            order: 'descend',
            columnKey: 'status',
        });
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filters: [
                { text: 'Joe', value: 'Joe' },
                { text: 'Jim', value: 'Jim' },
            ],
            onFilter: (value, record) => typeof value === 'string' && record.name.includes(value),
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : undefined,
            ellipsis: true,
        },
        {
            title: 'Zuständigkeit',
            dataIndex: 'responsible',
            key: 'responsible',
            filters: [
                { text: 'John', value: 'John' },
                { text: 'Jane', value: 'Jane' },
            ],
            onFilter: (value, record) => typeof value === 'string' && record.responsible.includes(value),
            sorter: (a, b) => a.responsible.length - b.responsible.length,
            sortOrder: sortedInfo.columnKey === 'responsible' ? sortedInfo.order : undefined,
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Inactive', value: 'Inactive' },
            ],
            onFilter: (value, record) => typeof value === 'string' && record.status.includes(value),
            sorter: (a, b) => a.status.length - b.status.length,
            sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : undefined,
            ellipsis: true,
        },
        {
            title: 'Fälligkeit',
            dataIndex: 'due_date',
            key: 'due_date',
            sorter: (a, b) => a.due_date.localeCompare(b.due_date),
            sortOrder: sortedInfo.columnKey === 'due_date' ? sortedInfo.order : undefined,
        },
    ];

    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Button onClick={setStatusSort}>Sort Status</Button>
                <Button onClick={clearFilters}>Clear Filters</Button>
                <Button onClick={clearAll}>Clear Filters and Sorters</Button>
                <Input addonBefore={<SearchOutlined />} placeholder="Projekt"/>
            </Space>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={projects} // Use projects as the data source
                loading={loading} // Handle loading state
                onChange={handleChange}
            />
        </>
    );
};

export default ProjectListComponent;
