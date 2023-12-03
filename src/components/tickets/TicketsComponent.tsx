import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import {Avatar, Card, Layout, Space, Flex, Button, FloatButton} from "antd";

import TicketsListComponent from "./TicketsListComponent";
import {ReloadOutlined} from "@ant-design/icons";
import AuthenticatedLayoutComponent from "../layout/AuthenticatedLayoutComponent";

const TicketsComponent: React.FC = () => {

    return (
        <AuthenticatedLayoutComponent>
            <Card title="Project Title" extra={<Button onClick={() => console.log('click')} icon={<ReloadOutlined />} type="default" />}>
                <TicketsListComponent></TicketsListComponent>
            </Card>
        </AuthenticatedLayoutComponent>
    );
};

export default TicketsComponent;
