import React, {useEffect} from 'react';
import {AppDispatch, RootState} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {Divider, Typography} from "antd";
import {fetchSettings} from "../../features/settings/settingsSlice";
const { Text, Link } = Typography;

const DefaultFooterComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { version_status, version_minor, version_major, version_patch } = useSelector((state: RootState) => state.settings);

    useEffect(() => {
        dispatch(fetchSettings());
        console.log(version_status)
    }, [dispatch]);

    return (
        <div>
            <Divider />
            <Text type="secondary">Capmo Ticket Master</Text><br/>
            <Text type="secondary">Version {version_major}.{version_minor}.{version_patch} ({version_status})</Text>

        </div>
    );
};

export default DefaultFooterComponent;
