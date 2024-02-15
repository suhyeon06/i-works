import { useState, useEffect, useRef } from 'react';
import { Client, Frame } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { getAccessToken } from '../../utils/auth';

interface Message {
  type: string;
  chatMessageSenderName: string;
  chatMessageContent: string;
}

function ChatRoom() {
  const { chatRoomId } = useParams<{ chatRoomId: string }>(); // chatRoomId의 타입을 명시적으로 지정
  const [roomName, setRoomName] = useState<string>("");
  const [sender, setSender] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // 채팅방 정보를 가져오는 함수
    async function findRoom() {
      try {
        const response = await axios.get<{ data: { chatRoomName: string } }>(`https://suhyeon.site/api/chat/room/${chatRoomId}`, {
          headers: {
            Authorization: 'Bearer ' + getAccessToken(),
          }
        });
        setRoomName(response.data.data.chatRoomName);
      } catch (error) {
        console.error(error);
      }
    }

    const senderFromStorage = localStorage.getItem('wschat.sender');
    if (senderFromStorage) {
      setSender(senderFromStorage);
    }
    findRoom();

  }, [chatRoomId]);

  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new Client({
        brokerURL: 'ws://suhyeon.site/ws-stomp',
        onConnect: (frame: Frame) => {
          console.log(frame)
          if (clientRef.current) {
            clientRef.current.subscribe(`/sub/chat/room/${chatRoomId}`, (message: Frame) => {
              const recv = JSON.parse(message.body);
              setMessages((prevMessages) => [
                { type: recv.chatMessageType, chatMessageSenderName: recv.chatMessageSenderName, chatMessageContent: recv.chatMessageContent },
                ...prevMessages
              ]);
            });
            if (clientRef.current) {
              clientRef.current.publish({ destination: '/pub/chat/message', body: JSON.stringify({ chatMessageType: 'ENTER', chatRoomId: chatRoomId, chatMessageSenderName: sender }) });
            }
          }
        },
        debug: (str: string) => {
          console.log(new Date(), str);
        },
      });
      clientRef.current.activate();
    }

    // 컴포넌트 언마운트 시 STOMP 클라이언트 비활성화
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [chatRoomId, sender]); // chatRoomId와 sender가 변경될 때마다 useEffect가 실행되도록 설정

  // 메시지를 전송하는 함수
  const sendMessage = () => {
    if (clientRef.current?.connected && message.trim() !== '') { // 연결 상태를 확인하고 메시지 전송
      console.log('sendMessage', message);
      clientRef.current.publish({ destination: '/pub/chat/message', body: JSON.stringify({ chatMessageType: 'TALK', chatRoomId: chatRoomId, chatMessageSenderName: sender, chatMessageContent: message }) });
      setMessage('');
    } else {
      console.error("STOMP 연결이 활성화되지 않았습니다.");
    }
  };

  // 엔터 키가 눌렸을 때 메시지 전송
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container">
      <div className="input-group" style={{
        boxSizing: 'border-box',
        position: 'absolute',
        width: '1520px',
        height: '100px',
        top: '56px',
        background: '#FFFFFF',
        border: '1px solid #000000'
      }}>
        <h2>{roomName}</h2>
      </div>
      <div className={'input-group'}>
        <ul className="list-group">
          {messages.map((msg, index) => (
            <li className="list-group-item" key={index}>
              {msg.chatMessageSenderName} - {msg.chatMessageContent}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ position: 'absolute', bottom: '0px' }}>
        <input
          type="text"
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            width: '800px',
            height: '100px',
            background: '#FFFFFF',
            border: '1px solid #000000'
          }}
        />
      </div>
    </div>
  );
}

export default ChatRoom;