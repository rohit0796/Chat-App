import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import url from '../url'
import { getSender, getSenderFull } from '../UserLogic'
import socket from '../socket'
var chatCompare;
const Charts = () => {

  const { currentUser, chat, setChat, setSelectedChat, selectedChat, repeatFetch } = useContext(AuthContext)
  const [unread, setUnread] = useState([])
  const fetchChats = () => {
    if (currentUser) {
      fetch(`${url}/fetch-chats/${currentUser?._id}`)
        .then((val) => val.json())
        .then((data) => {
          setChat(data)
        })
    }
  }
  useEffect(() => {
    chatCompare = selectedChat;
  }, [selectedChat])
  useEffect(() => {

    fetchChats()
  }, [currentUser, repeatFetch])
  useEffect(() => {
    socket.on('message recieved', (msg) => {
      if (!chatCompare || chatCompare._id != msg.Chat._id) {
        setUnread([...unread, msg]);
      }
      fetchChats()
    })
  })
  return (
    chat ?
      <div style={{
        overflowY: 'auto'
      }}>
        {chat?.map((ch, ind) => {
          var design = false;
          if (unread.some((obj) => {
            return ch._id == obj.Chat._id;
          })) {
            design = true;
          }
          if (ch.latestMessage)
            ch.latestMessage.content = ch.latestMessage.content.length > 20 ? ch.latestMessage.content.slice(0, 20) + '...' : ch.latestMessage.content
          return (
            <div className={`charts ${design ? 'unread' : ""}`} key={ch._id}>
              <div className="user-chart" onClick={() => {
                var array = unread;
                array = array.filter((msg) => {
                  return msg.Chat._id != ch._id
                })
                setUnread([...array])
                if (ch.users[0]._id == ch.users[1]._id)
                  return;
                else
                  setSelectedChat({ ...ch })
              }}>
                <img className='Userchat-img' src={getSenderFull(currentUser, ch?.users)?.pic} alt="" />
                <div className="userchartinfo">
                  <span>{!ch.isGroupChat
                    ? getSender(currentUser, ch?.users)
                    : ch.chatName}</span>
                  <p>{(ch?.isGroupChat ? `${ch?.latestMessage?.sender?.name} : ${ch.latestMessage?.content}` : ch.latestMessage?.content)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      :
      <div>
        Search a contact to initiate chatting
      </div>
  )
}

export default Charts;
