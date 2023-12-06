import React, {ReactNode} from 'react';

import {Layout, Space} from "antd";

const { Header, Footer, Sider, Content } = Layout;

const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    flexDirection: 'column'
};

const spaceStyle: React.CSSProperties = {
    width: '100%',
};

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    height: 64,
    background: '#f5f5f5'
};

const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
};

type DefaultLayoutComponentProps = {
    children: ReactNode;
};

const DefaultLayoutComponent: React.FC<DefaultLayoutComponentProps> = (props) => {

    return (
        <Space direction="vertical" style={spaceStyle} size={[0, 48]}>
            <Layout style={layoutStyle}>
                <Header style={headerStyle}></Header>
                <Layout>
                    <Content style={contentStyle}>
                        {props.children}
                    </Content>
                </Layout>
            </Layout>
        </Space>
    );
};

export default DefaultLayoutComponent;




