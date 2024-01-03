import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = ({ currentUser, users, handleSelectUser }) => {
    const [selectedUserIndex, setSelectedUserIndex] = useState(undefined);

    const changeCurrentChat = (id, user) => {
        setSelectedUserIndex(id);
        handleSelectUser(user);
    };
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
                overflow: 'hidden',
                height: '100vh',
            }}
        >
            <div>
                <h2>User List</h2>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                    }}
                >
                    {users.map((user) => (
                        <h4
                            key={user?._id}
                            onClick={() => changeCurrentChat(user?._id, user)}
                            style={
                                user?._id == selectedUserIndex
                                    ? { color: 'blue' }
                                    : {}
                            }
                        >
                            {user?.username}
                        </h4>
                    ))}
                </div>
            </div>

            <div style={{ alignSelf: 'flex-start', paddingLeft: '15px' }}>
                <h2 style={{ color: 'brown' }}>* {currentUser?.username}</h2>
            </div>
        </div>
    );
};

export default UserList;
