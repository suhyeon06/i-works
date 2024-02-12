import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

interface Message {
  id: number;
  user: string;
  text: string;
}

function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const response = await axios.get('https://example.com/api/messages');
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching initial messages:', error);
      }
    };

    const connectSocket = () => {
      const newSocket = io('http://localhost:3001');
      setSocket(newSocket);

      newSocket.on('message', (message: Message) => {
        setMessages(prevMessages => [...prevMessages, message]);
      });

      return () => {
        newSocket.disconnect(); // 컴포넌트가 언마운트될 때 소켓 연결 해제
      };
    };

    const initializeChat = async () => {
      const username = prompt('Enter your username:') || 'Anonymous';
      setUsername(username);
      await fetchInitialMessages();
      connectSocket();
    };

    initializeChat();
  }, []);

  const sendMessage = async () => {
    if (messageInput.trim() !== '' && socket) {
      const newMessage: Message = {
        id: Date.now(),
        user: username,
        text: messageInput.trim(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      socket.emit('message', newMessage);
      setMessageInput('');
      
      try {
        await axios.post('https://example.com/api/messages', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div style={{ width: '300px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>Chat App</h1>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', marginBottom: '10px', padding: '10px' }}>
        {messages.map(message => (
          <div key={message.id} style={{ marginBottom: '10px' }}>
            <strong>{message.user}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          style={{ flex: '1', marginRight: '10px' }}
          placeholder="Enter your message"
        />
        <button onClick={sendMessage} style={{ flex: 'none' }}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;