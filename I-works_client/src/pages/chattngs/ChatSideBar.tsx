import { Outlet, useNavigate } from "react-router-dom"
import { Button } from "flowbite-react"
import ChatModal from "../../components/ChatModal"
import { ChangeEvent, useEffect, useState } from "react"
import axios from "axios";

interface ChatRoomType {
  chatRoomId: string
  chatRoomName: string
}


function ChatSideBar() {

  const navigate = useNavigate();

  const [chatrooms, setChatrooms] = useState<ChatRoomType[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [sender, setSender] = useState(localStorage.getItem('wschat.sender'));
  const [roomId, setRoomId] = useState(localStorage.getItem('wschat.roomId'));

  const handleChatRoomClick = (chatRoomId : string) => {
    const sender = prompt('대화명을 입력해 주세요.');
    localStorage.setItem('wschat.sender', sender);
    localStorage.setItem('wschat.roomId', chatRoomId);
    setSender(sender);
    setRoomId(chatRoomId);
    navigate(`/chat/room/${chatRoomId}`);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const findAllRooms = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/chat/room');
      setChatrooms(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setSender(localStorage.getItem('wschat.sender'));
    setRoomId(localStorage.getItem('wschat.roomId'));
    findAllRooms();
  }, []);
  
  return (
    <div className="flex h-full">
      <div className="flex flex-col items-center border-r-2 m-0 px-3 position-absolute w-72 flex-shrink-0">
        <div className="flex justify-center items-center w-full h-20">
          <Button onClick={openModal} className="h-12 w-full bg-mainBlue text-white">
            <span>채팅방 만들기</span>
          </Button>
          <ChatModal
            show={modalIsOpen}
            onClose={closeModal}
          />
        </div>
        <div>
          {chatrooms && chatrooms.map((chatroom, index) => (
            <div className="border-b-2 pb-2 mb-2" key={index}>
              <div className="mb-2 text-md font-semibold">
                <h2 onClick={() => handleChatRoomClick(chatroom.chatRoomId)}>{chatroom.chatRoomName}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Outlet />
    </div >
  )
}

export default ChatSideBar;
