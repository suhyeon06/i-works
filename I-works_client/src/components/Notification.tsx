import axios from "axios"
import { useEffect, useState } from "react"
import { API_URL } from "../utils/api"
import { getAccessToken } from "../utils/auth"


const NOTI_URL = API_URL + '/user-notificaton'

interface UserNotificationType {
    userNotificationId: number
    userNotificationContent:string
    userNotificationCreatedAt:string
    userNotificationIsCheckd: boolean
}

interface UserNotificationResponse {
    result : string
    data : UserNotificationType[]
}


function Notification(){
    const [notificatonList, setNotificationList] = useState<UserNotificationType[]>()
    
    useEffect(()=>{ 
        axios.get<UserNotificationResponse>(NOTI_URL, {headers:{Authorization: 'Bearer ' + getAccessToken()}})
        .then(response => setNotificationList(response.data.data))
        .catch(_err => alert('유저 알림 불러오기 실패'))

    },[])


    return(
        <>
        {notificatonList?.map(notification => {
            return <div>{notification.userNotificationContent}</div>
        })}

        </>
    )
}

export default Notification