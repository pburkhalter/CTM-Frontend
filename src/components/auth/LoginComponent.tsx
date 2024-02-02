import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Image} from "antd";
import { RootState } from '../../store/store';
import LoginFormComponent from './LoginFormComponent'
import DefaultLayoutComponent from "../layout/DefaultLayoutComponent";

const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'fit-content',
    height: 500,
    padding: 30
};

const avatarContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
};

const LoginComponent: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/tickets');
        }
    }, [isAuthenticated, navigate]);

    return (
        <DefaultLayoutComponent>
            <Card style={cardStyle}>
                <div style={avatarContainerStyle}>
                    <Image src={'/logo.png'} preview={false} width={250} style={{marginBottom: 20}}></Image>
                </div>
                <LoginFormComponent />
            </Card>
        </DefaultLayoutComponent>
    );
};

export default LoginComponent;




