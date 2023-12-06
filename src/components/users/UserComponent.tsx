import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { Card, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import AuthenticatedLayoutComponent from "../layout/AuthenticatedLayoutComponent";
import UserListComponent from "./UserListComponent";
import {fetchMyTeammates, fetchAllUsers} from "../../features/users/userSlice";

const UserComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { myTeammates, allUsers, loading } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        dispatch(fetchMyTeammates());
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleReloadMyProjects = () => {
        dispatch(fetchMyTeammates());
    };

    const handleReloadAllProjects = () => {
        dispatch(fetchAllUsers());
    };

    return (
        <AuthenticatedLayoutComponent>
            <Card
                title="Mein Team"
                extra={<Button onClick={handleReloadMyProjects} icon={<ReloadOutlined />} type="default" />}
            >
                <UserListComponent users={myTeammates} loadingState={loading} />
            </Card>
            <Card
                title="Alle Benutzer"
                extra={<Button onClick={handleReloadAllProjects} icon={<ReloadOutlined />} type="default" />}
            >
                <UserListComponent users={allUsers || []} myTeammates={myTeammates || []} loadingState={loading} />
            </Card>
        </AuthenticatedLayoutComponent>
    );
};

export default UserComponent;
