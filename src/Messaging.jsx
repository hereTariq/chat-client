import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './userContext';

import './Messaging.css';

const Messaging = () => {
    const {
        messages,
        setMessages,
        currentUser,
        selectedUser,
        newMessage,
        setNewMessage,
        socket,
    } = useUserContext();
    const [actMessage, setActMessage] = useState(null);

    const navigate = useNavigate();

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
                    setMessages(data.conversation.messages);
                } else {
                    console.log(data);
                    // setMessages([]);
                }
            } catch (error) {
                // console.log(error);
                if (!error?.response?.data?.success) {
                    // setMessages([]);
                }
                if (error?.response?.status == 401) {
                    localStorage.clear();
                    navigate('/login');
                }
            }
        };
        fetchMessages();
    }, [selectedUser]);

    useEffect(() => {
        if (socket == null) return;

        socket.emit('sendMessage', {
            conversation: messages[messages.length - 1],
            to: selectedUser._id,
        });
        return () => {
            socket.off('sendMessage');
        };
    }, [actMessage]);

    useEffect(() => {
        if (socket == null) return;

        socket.on('receiveMessage', (msg) => {
            // console.log(msg);
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [socket, selectedUser]);
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
                setActMessage(newMessage);
                setMessages(data.newConversation.messages);
            }

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
                {messages?.map((message) => (
                    <div key={message?._id}>
                        {/*{message.sender.username}:*/} {message?.content}
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
