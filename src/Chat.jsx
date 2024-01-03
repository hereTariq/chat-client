import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserList from './UserList';
import Messaging from './Messaging';
import './Login.css';

function Chat() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

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
                <Messaging
                    selectedUser={selectedUser}
                    currentUser={currentUser}
                    logout={logout}
                />
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
