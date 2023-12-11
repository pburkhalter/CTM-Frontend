// src/App.tsx
import React, {useEffect} from 'react';
import 'antd/dist/reset.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './components/auth/LoginComponent';
import ProjectComponent from './components/projects/ProjectComponent';
import TicketComponent from './components/tickets/TicketComponent';
import SettingsComponent from './components/settings/SettingsComponent';
import ProtectedRoute from './components/ProtectedRoute';
import UserComponent from "./components/users/UserComponent";
import OverviewComponent from "./components/overview/OverviewComponent";



const App: React.FC = () => {

    useEffect(() => {
        document.title = "Capmo Ticket Master";
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/overview" element={
                    <ProtectedRoute>
                        <OverviewComponent />
                    </ProtectedRoute>
                } />
                <Route path="/projects" element={
                    <ProtectedRoute>
                        <ProjectComponent />
                    </ProtectedRoute>
                } />
                <Route path="/tickets" element={
                    <ProtectedRoute>
                        <TicketComponent />
                    </ProtectedRoute>
                } />
                <Route path="/users" element={
                    <ProtectedRoute>
                        <UserComponent />
                    </ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <SettingsComponent />
                    </ProtectedRoute>
                } />
                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
