import React, { useState } from 'react';
import AuthLoginForm from './components/AuthLoginForm';
import AuthRegisterForm from './components/AuthRegisterForm';
import ChatHome from './components/ChatHome';
import ChatRoom from './components/ChatRoom';
import { onlineUsers } from './mock/users';
import { joinChat, createChat } from './utils/chatService';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [userData, setUserData] = useState({
    username: '',
    email: ''
  });
  const [roomName, setRoomName] = useState('');


const handleLogin = async (credentials) => {
  try {
    const response = await fetch('http://localhost:3001/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: credentials.username, // o email
        contrasenna: credentials.password
      })
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Error al iniciar sesión');
      return;
    }

    // Guarda el token si lo necesitas: localStorage.setItem('token', data.token);
    setUserData({
      username: data.nombre || credentials.username,
      email: data.email
    });
    setCurrentView('home');
  } catch (error) {
    alert('Error de red o servidor');
  }
};

  const handleRegister = async (credentials) => {
  try {
    // El backend espera: nombre, email, contrasenna
    const response = await fetch('http://localhost:3001/api/usuarios/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: credentials.username,
        email: credentials.email,
        contrasenna: credentials.password
      })
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Error al registrar usuario');
      return;
    }

    setUserData({
      username: credentials.username,
      email: credentials.email
    });
    setCurrentView('home');
  } catch (error) {
    alert('Error de red o servidor');
  }
};

  const handleJoinChat = (room) => {
    setRoomName(room);
    joinChat(room);
    setCurrentView('chat');
  };

  const handleCreateChat = (newRoom) => {
  setRoomName(newRoom);
  createChat();
  setCurrentView('chat');
};

  const handleLeaveChat = () => {
    setCurrentView('home');
  };

  return (
    <>
      {currentView === 'login' && (
        <AuthLoginForm 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setCurrentView('register')} 
        />
      )}
      {currentView === 'register' && (
        <AuthRegisterForm
        onRegister={handleRegister}
        onSwitchToLogin={() => setCurrentView('login')} 
       />
      )}
      {currentView === 'home' && (
        <ChatHome
          username={userData.username}
          onJoinChat={handleJoinChat}
          onCreateChat={handleCreateChat}
          onlineUsers={onlineUsers}
          onLogout={() => setCurrentView('login')}

        />
      )}
      {currentView === 'chat' && (
        <ChatRoom
          roomName={roomName}
          username={userData.username}
          onLeave={handleLeaveChat}
        />
      )}
    </>
  );
};

export default App;