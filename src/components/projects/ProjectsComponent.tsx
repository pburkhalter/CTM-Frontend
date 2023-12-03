import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import { Card, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import AuthenticatedLayoutComponent from "../layout/AuthenticatedLayoutComponent";
import ProjectListComponent from "./ProjectsListComponent";
import {fetchProjects} from "../../features/projects/projectsSlice"; // Import the apiService

const ProjectsComponent: React.FC = () => {
    const dispatch = useDispatch();
    const { projects, loading } = useSelector((state: RootState) => state.projects);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);


    return (
        <AuthenticatedLayoutComponent>
            <Card title="Projekte" extra={<Button onClick={() => console.log('click')} icon={<ReloadOutlined />} type="default" />}>
                <ProjectListComponent projects={projects} loading={loading} />
            </Card>
        </AuthenticatedLayoutComponent>
    );
};

export default ProjectsComponent;
