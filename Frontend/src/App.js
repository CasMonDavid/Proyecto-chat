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


  const handleLogin = (credentials) => {
    // Extraemos solo los datos necesarios para el estado
    setUserData({
      username: credentials.username,
      email: credentials.email
    });
    setCurrentView('home');
  };

  const handleRegister = (credentials) => {
    // Extraemos solo los datos necesarios para el estado
    setUserData({
      username: credentials.username,
      email: credentials.email
    });
    setCurrentView('home');
  };

  const handleJoinChat = (room) => {
    setRoomName(room);
    joinChat(room);
    setCurrentView('chat');
  };

  const handleCreateChat = () => {
    const newRoom = `Sala-${Date.now()}`;
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