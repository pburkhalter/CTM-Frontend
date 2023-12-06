import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { Card, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import AuthenticatedLayoutComponent from "../layout/AuthenticatedLayoutComponent";
import ProjectListComponent from "./ProjectsListComponent";
import { fetchMyProjects, fetchAllProjects } from "../../features/projects/projectsSlice";

const ProjectsComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { myProjects, allProjects, loading } = useSelector((state: RootState) => state.projects);

    useEffect(() => {
        dispatch(fetchMyProjects());
        dispatch(fetchAllProjects());
    }, [dispatch]);

    const handleReloadMyProjects = () => {
        dispatch(fetchMyProjects());
    };

    const handleReloadAllProjects = () => {
        dispatch(fetchAllProjects());
    };

    return (
        <AuthenticatedLayoutComponent>
            <Card
                title="Meine Projekte"
                extra={<Button onClick={handleReloadMyProjects} icon={<ReloadOutlined />} type="default" />}
            >
                <ProjectListComponent projects={myProjects} loadingState={loading} />
            </Card>
            <Card
                title="Projekte"
                extra={<Button onClick={handleReloadAllProjects} icon={<ReloadOutlined />} type="default" />}
            >
                <ProjectListComponent projects={allProjects || []} myProjects={myProjects || []} loadingState={loading} />
            </Card>
        </AuthenticatedLayoutComponent>
    );
};

export default ProjectsComponent;
