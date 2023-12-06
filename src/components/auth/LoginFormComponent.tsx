import React from 'react';
import {Form, Input, Button, Checkbox, Divider} from 'antd';
import { useDispatch } from 'react-redux';
import { Credentials } from "../../features/auth/types";
import { AppDispatch } from '../../store/store'; // Import AppDispatch
import { authService } from '../../api/authService'
import {useNavigate} from "react-router-dom";
import {loginSuccess} from "../../features/auth/authSlice";
import { Space, Typography } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;
const LoginFormComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const onFinish = async (values: Credentials) => {
        try {
            const response = await authService.login(values);
            if (response.accessToken) {
                navigate('/tickets');
                dispatch(loginSuccess({
                    isAuthenticated: true,
                }));
            } else {
                console.error('Login failed:', response);
                // Handle login failure here
            }
        } catch (error) {
            console.error('Error during login:', error);
            // Handle errors like network issues here
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const formStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    };

    return (
        <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={formStyle}
        >
            <Form.Item
                name="email"
                rules={[{ required: true, message: 'Bitte gib deine Mail-Adresse ein' }]}
            >
                <Input placeholder="Email-Adresse" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Du hast dein Passwort vergessen...' }]}
            >
                <Input.Password placeholder="Passwort" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Log in
                </Button>
            </Form.Item>
            <Divider></Divider>
            <Text mark>Bitte verwende deine Mailadresse</Text>
            <Text mark>und unser Standardpasswort</Text>

        </Form>
    );
};

export default LoginFormComponent;
