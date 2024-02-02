import React from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Avatar } from 'antd';

const { Text } = Typography;

const AuthenticatedHeaderComponent: React.FC = () => {
    useDispatch();

    // Retrieve user data from localStorage
    const fullName = localStorage.getItem('fullName') || 'Unknown User';
    const email = localStorage.getItem('email') || '';
    const id = localStorage.getItem('id') || '';

    const firstLetter = fullName.charAt(0);

    const textStyle = {
        color: '#282A35',
        fontSize: '14px'
    };

    const textStyleLight = {
        color: '#4b4b4b',
        fontSize: '12px'
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 50, marginTop: 20 }}>
            <Avatar size={64} style={{ marginRight: 20 }}>{firstLetter}</Avatar>
            <div>
                <Text strong style={textStyle}>{fullName}</Text>
                <br />
                <Text style={textStyleLight}>{email}</Text>
                <br />
                <Text style={textStyleLight}>Capmo ID: {id}</Text>
            </div>
        </div>
    );
};

export default AuthenticatedHeaderComponent;
