import React, { useContext, useEffect, useRef, useState } from 'react'
import Message from './Message'
import { AuthContext } from '../Context/AuthContext';
import url from '../url';
import socket from '../socket';
var chatCompare;
const Messages = ({ messages, setMessages }) => {

  const [name, setName] = useState('');
  const [isTyping, setisTyping] = useState(false);
  const ref = useRef()
  const scrollTOBottom = () => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
  const { selectedChat } = useContext(AuthContext)
  useEffect(() => {
    chatCompare = selectedChat
    if (ref.current) {
      scrollTOBottom();
    }
  }, [isTyping, selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      if (newMessage.Chat._id == selectedChat._id) {
        setMessages([...messages, newMessage])
      }
    })
    socket.on("typing", (room) => {
      if (chatCompare._id == room.id) {
        setisTyping(true)
        setName(room.name)
      }
    })
    socket.on('not typing', () => setisTyping(false))
  })
  return (
    <div className='messages'>
      {messages.map(m => {
        return (
          <Message message={m} key={m._id} />
        )
      })}
      {isTyping && <div className="messagecontent" ref={ref}> {name} is typing...</div>}
    </div>
  )
}

export default Messages
