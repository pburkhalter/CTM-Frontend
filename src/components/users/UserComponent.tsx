import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { Card, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import AuthenticatedLayoutComponent from "../layout/AuthenticatedLayoutComponent";
import UserListComponent from "./UserListComponent";
import {fetchMyTeammates, fetchAllUsers, fetchExternalUsers} from "../../features/users/userSlice";

const UserComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { myTeammates, allUsers, loading, externalUsers } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        dispatch(fetchMyTeammates());
        dispatch(fetchExternalUsers());
    }, [dispatch]);

    const handleReloadMyTeammates = () => {
        dispatch(fetchMyTeammates());
    };

    const handleReloadExternalUsers = () => {
        dispatch(fetchAllUsers());
    };

    return (
        <AuthenticatedLayoutComponent>
            <Card
                title="Firma"
                extra={<Button onClick={handleReloadMyTeammates} icon={<ReloadOutlined />} type="default" />}
            >
                <UserListComponent users={myTeammates} loadingState={loading} />
            </Card>
            <Card
                title="Externe Benutzer"
                extra={<Button onClick={handleReloadExternalUsers} icon={<ReloadOutlined />} type="default" />}
            >
                <UserListComponent users={externalUsers} loadingState={loading} />            </Card>
        </AuthenticatedLayoutComponent>
    );
};

export default UserComponent;
