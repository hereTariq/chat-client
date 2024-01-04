import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserList from './UserList';
import Messaging from './Messaging';
import { useUserContext } from './userContext';
import { io } from 'socket.io-client';

import './Login.css';

function Chat() {
    const {
        setSelectedUser,
        users,
        setUsers,
        currentUser,
        setCurrentUser,
        socket,
        setSocket,
        setOnlineUsers,
    } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser == null) return;
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [currentUser]);

    useEffect(() => {
        if (socket == null) return;

        socket.emit('addNewUser', currentUser.id);
        socket.on('getOnlineUsers', (onlineUsers) => {
            setOnlineUsers(onlineUsers);
            socket.emit('receive', onlineUsers);
        });
        return () => {
            socket.off('getOnlineUsers');
        };
    }, [socket]);

    useEffect(() => {
        let user = localStorage.getItem('user');
        // console.log(user);
        if (!user) {
            return navigate('/login');
        } else {
            user = JSON.parse(localStorage.getItem('user'));
            setCurrentUser(user);
            fetchUsers();
        }

        async function fetchUsers() {
            try {
                // console.log(user.id);
                const { data } = await axios.get(
                    `http://localhost:3000/auth/users/${user.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                if (data.success) {
                    setUsers(data.users);
                }

                // console.log(users);
            } catch (err) {
                console.log('something went wrong', err);
                if (err?.response?.status == 401) {
                    localStorage.clear();
                    navigate('/login');
                }
            }
        }
    }, []);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const logout = (e) => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, border: '1px solid black' }}>
                <UserList
                    currentUser={currentUser}
                    users={users}
                    handleSelectUser={handleSelectUser}
                />
            </div>
            <div
                style={{
                    flex: 2,
                    border: '1px solid black',
                    display: 'flex',
                    justifyContent: 'space-around',
                    paddingTop: '10px',
                }}
            >
                <Messaging />
                <button
                    type="button"
                    onClick={logout}
                    style={{ padding: '10px 20px', height: '40px' }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Chat;
