import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';
import axios from "axios";

function ChatRoom() {
  const { chatRoomId } = useParams(); // useParams 훅을 사용하여 URL에서 chatRoomId 가져오기

  const [room, setRoom] = useState({ chatRoomId: '', chatRoomName: '' });
  const [roomId, setRoomId] = useState('');
  const [sender, setSender] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const clientRef = useRef();

  useEffect(() => {
    // 채팅방 정보를 가져오는 함수
    const findRoom = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/chat/room/${chatRoomId}`);
        setRoom(response.data); // 가져온 채팅방 정보 설정
      } catch (error) {
        console.error(error);
      }
    };

    // 로컬 스토리지에서 sender와 roomId 설정
    const senderFromStorage = localStorage.getItem('wschat.sender');
    const roomIdFromStorage = localStorage.getItem('wschat.roomId');
    setSender(senderFromStorage);
    setRoomId(roomIdFromStorage || chatRoomId); // 만약 로컬 스토리지에 roomId가 없으면 URL에서 가져온 chatRoomId 사용


    // STOMP 클라이언트 초기화
    clientRef.current = new Client({
      brokerURL: 'ws://localhost:8080/ws-stomp',
      onConnect: (frame) => {
        clientRef.current.subscribe(`/sub/chat/room/${roomId}`, function(message) {
          const recv = JSON.parse(message.body);
          setMessages((prevMessages) => [{type: recv.chatMessageType, chatMessageSenderName: recv.chatMessageSenderName, chatMessageContent: recv.chatMessageContent}, ...prevMessages]);
        });
        clientRef.current.publish({destination: '/pub/chat/message', body: JSON.stringify({chatMessageType:'ENTER', chatRoomId: roomId, chatMessageSenderName: sender})});
      },
      debug: (str) => {
        console.log(new Date(), str);
      },
    });

    clientRef.current.activate();

    // 컴포넌트 언마운트 시 STOMP 클라이언트 비활성화
    return () => {
      clientRef.current.deactivate();
    };
  }, [chatRoomId, sender]); // chatRoomId와 sender가 변경될 때마다 useEffect가 실행되도록 설정

  // 메시지를 전송하는 함수
  const sendMessage = () => {
    if (message.trim() !== '') {
      console.log('sendMessage', message)
      clientRef.current.publish({destination: '/pub/chat/message', body: JSON.stringify({chatMessageType:'TALK', chatRoomId: roomId, chatMessageSenderName: sender, chatMessageContent: message})});
      setMessage('');
    }
  };

  const recvMessage = (recv: any) => {
    console.log("Received message:", recv); // 디버그 메시지 추가
    setMessages((prevMessages) => [
      {
        type: recv.chatMessageType,
        chatMessageSenderName: recv.chatMessageSenderName,
        chatMessageContent: recv.chatMessageContent,
      },
      ...prevMessages,
    ]);
  };

  // 엔터 키가 눌렸을 때 메시지 전송
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.isComposing) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
      <div className="container">
        <div className="input-group">
          <div className="input-group" style={{
            boxSizing: 'border-box',
            position: 'absolute',
            width: '1520px',
            height: '100px',
            top: '56px',
            background: '#FFFFFF',
            border: '1px solid #000000'
          }}>
            <h2>{room.chatRoomName}</h2>
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
          <div style={{position: 'absolute', bottom: '0px'}}>
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
      </div>
  );
};

export default ChatRoom;
