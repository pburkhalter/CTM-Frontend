import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { loginUser } from '../../features/auth/authThunks';
import {Credentials} from "../../features/auth/types";

import LoginFormComponent from './LoginFormComponent'

import {Layout, Space, Card, Avatar, Image} from "antd";
import { UserOutlined } from '@ant-design/icons';
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

const avatarStyle: React.CSSProperties = {
    margin: 30,
};

const LoginComponent: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/tickets');
        }
    }, [isAuthenticated, navigate]);

    return (
        <DefaultLayoutComponent>
            <Card style={cardStyle}>
                <div style={avatarContainerStyle}>
                    <Image src={'/logo_jhag.jpg'} preview={false} width={250} style={{marginBottom: 20}}></Image>
                </div>
                <LoginFormComponent />
            </Card>
        </DefaultLayoutComponent>
    );
};

export default LoginComponent;




