import React, { useState, useEffect } from 'react';

const ChatRoom = ({ roomName, username, onLeave }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { user: username, text: message }]);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Sala: {roomName}</h2>
          <button
            onClick={onLeave}
            className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
          >
            Salir
          </button>
        </div>

        <div className="h-96 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-3 ${msg.user === username ? 'text-right' : ''}`}>
              <div className={`inline-block p-3 rounded-lg ${msg.user === username ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <div className="text-sm font-semibold">{msg.user}</div>
                <div>{msg.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;