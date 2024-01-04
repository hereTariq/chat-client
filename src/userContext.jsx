import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    return (
        <UserContext.Provider
            value={{
                selectedUser,
                setSelectedUser,
                users,
                setUsers,
                currentUser,
                setCurrentUser,
                messages,
                setMessages,
                newMessage,
                setNewMessage,
                socket,
                setSocket,
                onlineUsers,
                setOnlineUsers,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { UserContext, UserContextProvider, useUserContext };
