import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://25.2.232.183:3001'); // Asegúrate que el puerto es correcto

socket.on('connect', () => {
  console.log('Conectado al servidor de sockets:', socket.id);
});

const ChatRoom = ({ roomName, username, onLeave }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Unirse a la sala al montar el componente
  useEffect(() => {
    socket.emit('joinRoom', roomName);

    // Escuchar mensajes nuevos
    socket.on('recibir_mensaje', (mensaje) => {
      console.log('Mensaje recibido por socket:', mensaje); 
      setMessages((prev) => [...prev, mensaje]);
    });

    return () => {
      socket.off('recibir_mensaje');
    };
  }, [roomName]);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      // Guarda el mensaje en la BD
      await enviarMensaje(roomName, message);

      // Envía el mensaje por socket a la sala
      const mensajeObj = { user: username, text: message, content: message };
      socket.emit('nuevo_mensaje', { roomName, mensaje: mensajeObj });

      setMessages([...messages, mensajeObj]);
      setMessage('');
    }
  };

  const enviarMensaje = async (nombreSesion, contenido) => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3001/api/mensajes/enviar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nombreSesion, contenido })
    });
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
          <div ref={messagesEndRef} />
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