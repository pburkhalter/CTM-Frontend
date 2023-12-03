import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import {Avatar, Card, Layout, Space, Flex, Button, FloatButton} from "antd";

import {ReloadOutlined} from "@ant-design/icons";
import AuthenticatedLayoutComponent from "../layout/AuthenticatedLayoutComponent";

const SettingsComponent: React.FC = () => {

    return (
        <AuthenticatedLayoutComponent>
            <Card title="Project Title" extra={<Button onClick={() => console.log('click')} icon={<ReloadOutlined />} type="default" />}>
            </Card>
        </AuthenticatedLayoutComponent>
    );
};

export default SettingsComponent;
