import { Outlet } from "react-router-dom"
import { Button } from "flowbite-react"
import ChatModal from "../../components/ChatModal"
import { useState } from "react"

function ChatSideBar() {


  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

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
      </div>
      <div className="flex flex-col px-40 pt-4 overflow-auto flex-grow">
        <div className="mb-20">
          <Outlet />
        </div>
      </div>  
    </div >
  )
}

export default ChatSideBar;
