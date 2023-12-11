import React, { useState, useEffect } from 'react';
import { Menu, MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ContainerOutlined,
    MenuUnfoldOutlined,
    UserOutlined, SettingOutlined, CalendarOutlined,
} from '@ant-design/icons';

// Define the MenuItem type
interface MenuItem {
    key: string;
    icon: React.ReactNode;
    label: string;
    route?: string;
}

const NavigationComponent: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState<string>('1');

    // Define the items array using the MenuItem type
    const items: MenuItem[] = [
        { label: 'Übersicht', key: '1', icon: <CalendarOutlined />, route: '/overview' },
        { label: 'Tickets', key: '2', icon: <ContainerOutlined />, route: '/tickets' },
        { label: 'Projekte', key: '3', icon: <MenuUnfoldOutlined />, route: '/projects' },
        { label: 'Benutzer', key: '4', icon: <UserOutlined />, route: '/users' },
        { label: 'Einstellungen', key: '5', icon: <SettingOutlined />, route: '/settings' }

    ];

    useEffect(() => {
        // Update the selected key based on the current route
        const currentKey = items.find(item => item.route === location.pathname)?.key;
        if (currentKey) {
            setSelectedKey(currentKey);
        }
    }, [location.pathname, items]);

    const onClick: MenuProps['onClick'] = (e) => {
        const item = items.find(item => item.key === e.key);
        if (item && item.route) {
            navigate(item.route);
        }
    };

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[selectedKey]}
            mode="horizontal"
            items={items}
        />
    );
};

export default NavigationComponent;
