import { Button, Modal } from "flowbite-react";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { useUser } from "../utils/userInfo";
import { Form, useNavigate } from "react-router-dom";
import { RiDeleteBin2Line } from "react-icons/ri";

interface BoardModalProps {
  show: boolean;
  onClose: () => void;
}

interface UserData {
  userId: number,
  userEid: string,
  userNameFirst: string,
  userNameLast: string,
  departmentName: string,
  departmentId: string,
  positionCodeName: null,
  positionCodeId: null,
  userTel: string,
  userEmail: string
}

const ChatModal: React.FC<BoardModalProps> = ({ show, onClose }) => {
  const loginedUser = useUser()
  const navigate = useNavigate()

  const [chatTitle, setchatTitle] = useState<string>('')
  const [teamMemberData, setteamMemberData] = useState<UserData[]>([]);


  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setchatTitle(event.target.value)
  }

  // api 요청
  function handleCreate(event: FormEvent) {
    event.preventDefault()
    axios
      .post(`http://localhost:8080/api/chat/room?chatRoomName=${chatTitle}`)
      .then((res) => {
        navigate("../chat")
        onClose()
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }


  // 주소록
  const addSelectedUsersToTeamMembers = (selectedUsers: UserData[]) => {
    const updatedTeamMembers = [...teamMemberData, ...selectedUsers];
    const uniqueTeamMembers = updatedTeamMembers.filter((user, index, self) =>
      index === self.findIndex((u) => (
        u.userId === user.userId
      ))
    );
    setteamMemberData(uniqueTeamMembers);
  };

  function removeTeamMember(userId: number) {
    const updatedTeamMembers = teamMemberData.filter(user => user.userId !== userId);
    setteamMemberData(updatedTeamMembers);
  }

  // 팝업창 로직
  function openPopup2() {
    const popup: Window | null = window.open('/popup/address/select', '유저 선택', 'width=800,height=700,top=100');
    if (popup) {
      popup.addEventListener('beforeunload', () => {
        window.removeEventListener('message', handleMessage2);
      });
      window.postMessage({ type: 'OPEN_POPUP', payload: {} }, window.location.href);
      window.addEventListener('message', handleMessage2);
    } else {
      console.error('팝업을 열 수 없습니다.');
    }
  }

  const handleMessage2 = (event: MessageEvent) => {
    const { type, payload } = event.data;
    if (type === 'SEND_DATA') {
      // 부모 창에서 전달받은 데이터 처리
      addSelectedUsersToTeamMembers(payload.selectedUsers);
    }
  };

  useEffect(() => {
    if (loginedUser) {
      // 로그인한 사용자의 정보만 가진 객체를 생성
      const user: UserData = {
        userId: loginedUser.userId,
        userEid: loginedUser.userEid,
        userNameFirst: loginedUser.userNameFirst,
        userNameLast: loginedUser.userNameLast,
        departmentName: loginedUser.departmentName,
        departmentId: '',
        positionCodeName: null,
        positionCodeId: null,
        userTel: loginedUser.userTel,
        userEmail: loginedUser.userEmail
      };
      // 로그인한 사용자 정보를 팀 멤버 데이터에 추가
      setteamMemberData([user]);
    }
    return () => {
      window.removeEventListener('message', handleMessage2);
    };
  }, [loginedUser]);

  return (
    <Modal
      show={show}
      onClose={onClose}
      size="lg"
    >
      <h1 className="mt-6 mb-2 pl-8 font-semibold text-lg">채팅방 만들기</h1>

      <div className="flex flex-col items-center py-10 mx-6 mb-6 border-2">
        <Form className="w-80">
          <div className="flex flex-col my-2">
            <label className="mb-2 text-lg" htmlFor="teamName">채팅방 이름</label>
            <input onChange={onNameChange} className="h-8 w-full" type="text" name="teamName" placeholder="채팅방 이름을 입력해주세요." id="teamName" required />
          </div>
          <div className="flex items-center">
            <h3 className="text-lg">채팅방 생성자 : </h3>
            {loginedUser ? (
              <span className="ml-1 p-2 bg-mainGray">{loginedUser.userNameLast}{loginedUser.userNameFirst} / {loginedUser.departmentName}</span>
            ) : (
              <span className="">유저정보 없음</span>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center text-lg mb-2 mt-2">
              <h3>채팅방 멤버</h3>
              <Button className="bg-mainGreen" onClick={openPopup2}>주소록</Button>
            </div>
            {teamMemberData.length > 0 ? (
              <div className="flex flex-col border-2 h-40 p-4 overflow-auto">
                <ul>
                  {teamMemberData.map((user) => (
                    <li className="flex justify-between bg-mainGray p-2 mb-2" key={user.userId}>
                      <div>{user.userNameLast}{user.userNameFirst} / {user.departmentName}</div>
                      {user.userId !== loginedUser?.userId && (
                        <button onClick={() => removeTeamMember(user.userId)}><RiDeleteBin2Line size={18} /></button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="border-2 h-40"></div>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => {onClose()}} className="bg-mainBlue mr-2">취소</Button>
            <Button onClick={handleCreate} className="bg-mainGreen" type="submit">생성</Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ChatModal;