import React, { useState } from 'react';

const ChatHome = ({ username, onJoinChat, onCreateChat, onlineUsers, onLogout }) => {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (roomName.trim().length < 4) {
      setError('El nombre del chat debe tener al menos 4 caracteres.');
      return;
    }
    setError('');
    onJoinChat(roomName);
  };

  const handleCreate = () => {
  setError('');
  // Generar un ID aleatorio de 4 dígitos
  const randomId = Math.floor(1000 + Math.random() * 9000).toString();
  const newRoomName = randomId;
  setRoomName(newRoomName);
  onCreateChat(newRoomName);
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">ChatLAN</h1>
          <div className="text-sm text-gray-600">Hola, {username}</div>
              <button
              onClick={onLogout}
              className="text-sm text-red-600 hover:text-red-800 font-semibold"
              >
                Cerrar sesión
              </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Unirse a Chat</h2>
            <div className="flex">
              <input
                type="text"
                placeholder="Nombre del chat"
                className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <button
                onClick={handleJoin}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
              >
                Unirse
              </button>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Chat</h2>
            <button
              onClick={handleCreate}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Crear Sala de Chat
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Usuarios en Línea</h2>
          <div className="space-y-2">
            {onlineUsers.map((user, index) => (
              <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>{user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHome;
