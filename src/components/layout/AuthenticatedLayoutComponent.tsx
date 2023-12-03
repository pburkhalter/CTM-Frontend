import React, {useState, useEffect, ReactNode} from 'react';

import {Layout, Space, Card, Avatar, Flex, Button} from "antd";
import DefaultFooterComponent from "../footer/DefaultFooterComponent";
import NavigationComponent from "../navigation/NavigationComponent";
import {ReloadOutlined} from "@ant-design/icons";
import TicketsListComponent from "../tickets/TicketsListComponent";

const { Header, Footer, Sider, Content } = Layout;

const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    flexDirection: 'column'
};

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    height: 64,
    background: '#f5f5f5'
};

const contentStyle: React.CSSProperties = {
    margin: 50
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
};

type AuthenticatedLayoutComponentProps = {
    children: ReactNode;
};


const AuthenticatedLayoutComponent: React.FC<AuthenticatedLayoutComponentProps> = (props) => {

    return (
            <Layout style={layoutStyle}>
                <Header style={headerStyle}></Header>
                <Layout>
                    <Content style={contentStyle}>
                        <Flex vertical gap={30}>
                            <NavigationComponent></NavigationComponent>
                            {props.children}
                        </Flex>
                    </Content>
                </Layout>
                <Footer style={footerStyle}><DefaultFooterComponent></DefaultFooterComponent></Footer>
            </Layout>
    );
};

export default AuthenticatedLayoutComponent;




