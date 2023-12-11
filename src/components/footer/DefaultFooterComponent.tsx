import React, {useEffect} from 'react';
import {AppDispatch, RootState} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {Divider, Typography} from "antd";
import {appConfig, appVersion} from "../../appConfig";
const { Text, Link } = Typography;

const DefaultFooterComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { version_release, version_minor, version_major, version_patch } = useSelector((state: RootState) => appVersion);

    return (
        <div>
            <Divider />
            <Text type="secondary">Capmo Ticket Master</Text><br/>
            <Text type="secondary">Version {version_major}.{version_minor}.{version_patch} ({version_release})</Text>

        </div>
    );
};

export default DefaultFooterComponent;
