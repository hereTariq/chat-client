import React from 'react';
import Login from './Login';
import { Route, Routes } from 'react-router-dom';
import Chat from './Chat';

function App() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Chat />} />
            </Routes>
        </>
    );
}

export default App;
