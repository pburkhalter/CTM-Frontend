import React from 'react';
import {RootState} from "../../store/store";
import {useSelector} from "react-redux";
import {Divider, Typography} from "antd";

const { Text, Link } = Typography;

const DefaultFooterComponent: React.FC = () => {

    const version_major = useSelector((state: RootState) => state.settings.version_major);
    const version_minor = useSelector((state: RootState) => state.settings.version_minor);
    const version_status = useSelector((state: RootState) => state.settings.version_status);

    return (
        <div>
            <Divider />
            <Text type="secondary">Capmo Ticket Master</Text><br/>
            <Text type="secondary">Version {version_major}.{version_minor} ({version_status})</Text>

        </div>
    );
};

export default DefaultFooterComponent;
