import React, {useEffect} from 'react';
import {Card, Flex, Divider} from 'antd';
import AuthenticatedLayoutComponent from '../layout/AuthenticatedLayoutComponent';
import {fetchSettings} from "../../features/settings/settingsSlice";
import SettingsIndexingComponent from "./SettingsIndexingComponent";
import SettingsUserComponent from "./SettingsUserComponent";


const SettingsComponent: React.FC = () => {
    useEffect(() => {
        fetchSettings();
    }, []);

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
