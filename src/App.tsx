// src/App.tsx
import React from 'react';
import 'antd/dist/reset.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/auth/LoginComponent';
import ProjectsComponent from './components/projects/ProjectsComponent';
import TicketsComponent from './components/tickets/TicketsComponent';
import SettingsComponent from './components/settings/SettingsComponent';
import ProtectedRoute from './components/ProtectedRoute';
import AuthGuard from './components/AuthGuard'

const App: React.FC = () => {
    return (
        <Router>
            <AuthGuard>
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
            </AuthGuard>
        </Router>
    );
};

export default App;
