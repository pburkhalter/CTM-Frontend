import React, {useEffect, useState} from 'react';
import {Card, Button, Spin, Row, Col, Flex, Typography, Divider} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import AuthenticatedLayoutComponent from '../layout/AuthenticatedLayoutComponent';
import apiService from '../../api/apiService';
import {fetchSettings} from "../../features/settings/settingsSlice";
import SettingsIndexingComponent from "./SettingsIndexingComponent";
import SettingsUserComponent from "./SettingsUserComponent";
const {Text} = Typography;


const SettingsComponent: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState({ projects: 0, tickets: 0 });

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);


    const handleReload = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                const data = await apiService.get('service/init', accessToken);
                setApiData({ projects: data.projects, tickets: data.tickets });
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayoutComponent>
            <Card title="Einstellungen">
                <Flex gap="middle" vertical>
                    <SettingsIndexingComponent></SettingsIndexingComponent>
                    <Divider></Divider>
                    <SettingsUserComponent></SettingsUserComponent>
                </Flex>


            </Card>
        </AuthenticatedLayoutComponent>
    );
};

export default SettingsComponent;
