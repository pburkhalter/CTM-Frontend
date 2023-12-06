import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Table, Tag } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType, TableRowSelection, TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import { User } from "../../features/users/types";

const UserListComponent: React.FC<{ users: User[], myTeammates?: User[], loadingState: boolean }> = ({ users, myTeammates, loadingState }) => {
    const [sortedInfo, setSortedInfo] = useState<SorterResult<User>>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (myTeammates) {
            const newSelectedKeys = myTeammates.map(p => p.id);
            setSelectedRowKeys(newSelectedKeys);
        }
    }, [myTeammates]);

    const handleChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<User> | SorterResult<User>[]
    ) => {
        setSortedInfo(Array.isArray(sorter) ? sorter[0] : sorter);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const clearAll = () => {
        setSortedInfo({});
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
            sortOrder: sortedInfo.columnKey === 'fullName' ? sortedInfo.order : undefined,
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : undefined,
            ellipsis: true,
        },
    ];

    const filteredUsers = users && users.length > 0
        ? users.filter(user => user.fullName && user.fullName.toLowerCase().includes(searchText.toLowerCase()))
        : [];

    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Button onClick={clearAll}>Filter und Sortierung zurücksetzen</Button>
                <Input
                    addonBefore={<SearchOutlined />}
                    placeholder="Suche nach Namen oder Email"
                    onChange={handleSearch}
                    style={{ width: 400 }}
                />
            </Space>
            <Table
                columns={columns}
                dataSource={filteredUsers.map(user => ({ ...user, key: user.id }))}
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

export default UserListComponent;
