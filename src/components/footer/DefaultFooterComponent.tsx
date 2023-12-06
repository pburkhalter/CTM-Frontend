import React, {useEffect} from 'react';
import {AppDispatch, RootState} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {Divider, Typography} from "antd";
import {fetchSettings} from "../../features/settings/settingsSlice";

const { Text, Link } = Typography;

const DefaultFooterComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

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
