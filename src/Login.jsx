import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            navigate('/');
        }
    }, []);

    const request = async (path) => {
        try {
            const { data } = await axios.post(
                `http://localhost:3000/auth/${path}`,
                { username, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            // console.log(data);
            if (data.success) {
                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        id: data.user._id,
                        token: data.token,
                        username: data.user.username,
                    })
                );
                navigate('/');
            }
        } catch (err) {
            if (!err.response.data.success) {
                return console.log({ error: err.response.data.message });
            }
            console.log(err);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            return alert('username and password are required');
        }

        if (isLogin) {
            await request('login');
        } else {
            await request('signup');
        }
    };
    return (
        <>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h3>{isLogin ? 'LOGIN' : 'SIGNUP'}</h3>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex' }}>
                        <button type="submit">
                            {isLogin ? 'Login' : 'Signup'}
                        </button>
                        <p
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ cursor: 'pointer' }}
                        >
                            {isLogin
                                ? 'new member? Signup'
                                : 'old member? Login'}
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Login;
