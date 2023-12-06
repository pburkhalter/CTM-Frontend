// src/App.tsx
import React, {useEffect, useState} from 'react';
import 'antd/dist/reset.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/auth/LoginComponent';
import ProjectComponent from './components/projects/ProjectComponent';
import TicketComponent from './components/tickets/TicketComponent';
import SettingsComponent from './components/settings/SettingsComponent';
import ProtectedRoute from './components/ProtectedRoute';
import UserComponent from "./components/users/UserComponent";
import OverviewComponent from "./components/overview/OverviewComponent";

const App: React.FC = () => {
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
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;
