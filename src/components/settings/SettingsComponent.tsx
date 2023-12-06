import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {Card, Button, Spin, Row, Col, Flex, Typography} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import AuthenticatedLayoutComponent from '../layout/AuthenticatedLayoutComponent';
import apiService from '../../api/apiService';
import { RootState } from '../../store/store';
const { Title, Paragraph, Text, Link } = Typography;


const SettingsComponent: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState({ projects: 0, tickets: 0 });

    const accessToken = localStorage.getItem('accessToken');

    const handleReload = async () => {
        setLoading(true);
        try {
            if (accessToken) {
                console.log("DEBUG")
                console.log(accessToken)
                const data = await apiService.get('service/init', accessToken);
                //setApiData({ projects: data.projects, tickets: data.tickets });
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

                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={handleReload}
                            disabled={loading}
                        >
                            Neuindizierung starten
                        </Button>

                    <Text>Neuindizierung anstossen. Das dauert einen Moment.
                        Durch diesen Vorgang werden die neuesten Daten von Capmo geladen und
                        alle Systemindizes aktualisiert.</Text>

                    {loading ? (
                        <Spin />
                    ) : (
                        <div>
                            <p>Projekte: {apiData.projects}</p>
                            <p>Tickets: {apiData.tickets}</p>
                        </div>
                    )}
                </Flex>


            </Card>
        </AuthenticatedLayoutComponent>
    );
};

export default SettingsComponent;
