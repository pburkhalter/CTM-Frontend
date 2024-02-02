import React, {ReactNode} from 'react';

import {Layout, Flex} from "antd";
import DefaultFooterComponent from "../footer/DefaultFooterComponent";
import NavigationComponent from "../navigation/NavigationComponent";
import AuthenticatedHeaderComponent from "../header/AuthenticatedHeaderComponent";

const {Footer, Content } = Layout;

const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    flexDirection: 'column'
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
                <AuthenticatedHeaderComponent></AuthenticatedHeaderComponent>
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




