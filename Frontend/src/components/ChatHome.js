import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://25.2.232.183:3001');

const ChatHome = ({ username, onJoinChat, onCreateChat, onlineUsers, onLogout, buscarSala, unirseSala }) => {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const [salas, setSalas] = useState([]);
  const pendingRoomToJoin = useRef(null); // Para saber si estamos esperando unirnos a una sala recién creada

  useEffect(() => {
    socket.on('sala_creada', async (nuevaSala) => {
      setSalas((prev) => [...prev, nuevaSala]);
      // Si la sala creada es la que acabamos de crear, únirse automáticamente
      if (pendingRoomToJoin.current === nuevaSala) {
        const joinResult = await unirseSala(nuevaSala);
        if (joinResult.session) {
          setError('');
          onJoinChat(nuevaSala);
        } else {
          setError(joinResult.message || 'No se pudo unir a la sala.');
        }
        pendingRoomToJoin.current = null;
      }
    });

    socket.on('salas_existentes', (listaSalas) => {
      setSalas(listaSalas);
    });

    socket.emit('obtener_salas');

    return () => {
      socket.off('sala_creada');
      socket.off('salas_existentes');
    };
  }, [unirseSala, onJoinChat]);

  const handleJoin = async () => {
    if (roomName.trim().length < 5) {
      setError('El nombre del chat debe tener al menos 5 dígitos.');
      return;
    }
    setError('');
    const salaExiste = await buscarSala(roomName);
    if (!salaExiste) {
      setError('Sala no encontrada.');
      return;
    }
    const joinResult = await unirseSala(roomName);
    if (joinResult.session) {
      setError('');
      onJoinChat(roomName);
    } else {
      setError(joinResult.message || 'No se pudo unir a la sala.');
    }
  };

  const handleCreate = async () => {
    setError('');
    const randomId = Math.floor(10000 + Math.random() * 90000).toString();
    pendingRoomToJoin.current = randomId;
    socket.emit('crear_sala', randomId);
    // No actualices setRoomName aquí, así el input no cambia
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

        {/* Mostrar lista de salas disponibles */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Salas Disponibles</h2>
          <div className="space-y-2">
            {salas.length === 0 && <div className="text-gray-500">No hay salas disponibles.</div>}
            {salas.map((sala, idx) => (
              <div key={idx} className="flex items-center p-2 hover:bg-gray-50 rounded">
                <span className="font-mono">{sala}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHome;
