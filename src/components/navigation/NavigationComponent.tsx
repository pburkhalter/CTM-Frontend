import React from 'react';
import { Menu, MenuProps } from 'antd';
import { useNavigate } from "react-router-dom";
import {
    ContainerOutlined,
    MenuUnfoldOutlined,
    DesktopOutlined,
} from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number] & { route?: string }; // Extend the type to include 'route'

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    route?: string, // Add route parameter
): MenuItem {
    return {
        key,
        icon,
        label,
        route, // Include route in the item
    };
}

// Assign routes to each menu item
const items: MenuItem[] = [
    getItem('Tickets', '1', <ContainerOutlined />, '/tickets'),
    getItem('Projekte', '2', <MenuUnfoldOutlined />, '/projects'),
    getItem('Einstellungen', '3', <DesktopOutlined />, '/settings')
];

const navigationStyle: React.CSSProperties = {
    width: '100%',
    flexBasis: 'inherit',
};

const NavigationComponent: React.FC = () => {
    const navigate = useNavigate();

    const onClick: MenuProps['onClick'] = (e) => {
        // Find the clicked item
        const item = items.find(item => item.key === e.key);
        // Navigate if route is defined
        if (item && item.route) {
            navigate(item.route);
        }
    };

    return (
        <Menu
            onClick={onClick}
            style={navigationStyle}
            defaultSelectedKeys={['1']}
            mode="horizontal"
            items={items}
        />
    );
};

export default NavigationComponent;
