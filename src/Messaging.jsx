import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import './Messaging.css';

const Messaging = ({ selectedUser, currentUser, logout }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const navigate = useNavigate();
    const socket = io('http://localhost:3000');

    useEffect(() => {
        // console.log({ currentUser });
        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:3000/message/get/${currentUser.id}/${selectedUser._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${currentUser.token}`,
                        },
                    }
                );
                if (data.success) {
                    setMessages(data.conversation);
                    console.log(data);
                } else {
                    console.log(data);
                    setMessages([]);
                }
            } catch (error) {
                // console.log(error);
                if (!error?.response?.data?.success) {
                    setMessages([]);
                }
                if (error?.response?.status == 401) {
                    localStorage.clear();
                    navigate('/login');
                }
            }
        };
        fetchMessages();

        if (currentUser) {
            console.log(currentUser.id);
            socket.emit('add-user', currentUser.id);
        }
    }, [selectedUser]);

    const handleSendMessage = async (e) => {
        if (!newMessage || !selectedUser) {
            return alert('please type a message..');
        }

        try {
            const { data } = await axios.post(
                'http://localhost:3000/message/send',
                {
                    senderId: currentUser.id,
                    receiverId: selectedUser._id,
                    content: newMessage,
                },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );
            if (data.success) {
                console.log(data);
            }

            socket.emit('send-message', {
                conversation:
                    data.newConversation.messages[
                        data.newConversation.messages.length - 1
                    ],
                to: selectedUser._id,
            });

            setMessages(data.newConversation.messages);

            socket.on('send-message', (msg) => {
                console.log(msg);
                setMessages((prevMessages) => [...prevMessages, msg]);
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            if (error.response.status == 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    return selectedUser == null ? (
        <h4>Welcome {currentUser?.username}</h4>
    ) : (
        <div className="msg-container">
            <div className="header">
                <h2>
                    Chat with {selectedUser ? selectedUser.username : 'User'}
                </h2>
            </div>
            <div>
                {messages.map((message) => (
                    <div key={message._id}>
                        {/*{message.sender.username}:*/} {message.content}
                    </div>
                ))}
            </div>
            <div className="msg-box">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Messaging;
