// src/App.tsx
import React, {useEffect, useState} from 'react';
import 'antd/dist/reset.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/auth/LoginComponent';
import ProjectsComponent from './components/projects/ProjectsComponent';
import TicketsComponent from './components/tickets/TicketsComponent';
import SettingsComponent from './components/settings/SettingsComponent';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/projects" element={
                    <ProtectedRoute>
                        <ProjectsComponent />
                    </ProtectedRoute>
                } />
                <Route path="/tickets" element={
                    <ProtectedRoute>
                        <TicketsComponent />
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
