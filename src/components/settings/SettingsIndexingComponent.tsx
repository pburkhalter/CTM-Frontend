import React, {useEffect, useState} from 'react';
import {Button, Spin, Flex, Typography, Space} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import apiService from '../../api/apiService';
import {fetchSettings} from "../../features/settings/settingsSlice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
const {Text} = Typography;


const SettingsIndexingComponent: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { project_count, ticket_count } = useSelector((state: RootState) => state.settings);

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    const handleReload = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                await apiService.get('service/init', accessToken);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Space>
            <Flex vertical={true}>
                <Typography.Title level={4}>Indizierung</Typography.Title>
                <Flex gap={50} wrap={'wrap'}>
                    <Flex vertical={true} gap={20}>
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
                    </Flex>
                    <Space>
                        {loading ? (
                            <Spin />
                        ) : (
                            <Flex vertical={true}>
                                <Text style={{fontSize: 20}}>Projekte: {project_count}</Text>
                                <Text style={{fontSize: 20}}>Tickets: {ticket_count}</Text>
                            </Flex>
                        )}

                    </Space>
                </Flex>


            </Flex>

        </Space>

    );
};

export default SettingsIndexingComponent;
