import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Management from './pages/Management';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/manage" element={<Management />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;