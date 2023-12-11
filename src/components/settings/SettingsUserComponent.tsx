import React, { useEffect, useState } from 'react';
import { Card, Button, Spin, Row, Col, Flex, Typography, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { fetchSettings } from '../../features/settings/settingsSlice';
import { authService } from '../../api/authService';
import { useNavigate } from 'react-router-dom';
const { Text, Title } = Typography;

const SettingsUserComponent: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
            <Space direction="vertical">
                <Title level={4}>Benutzer</Title>
                <Button
                    type="primary"
                    icon={<UserOutlined />}
                    onClick={handleLogout}
                >
                    Ausloggen
                </Button>
            </Space>
    );
};

export default SettingsUserComponent;
