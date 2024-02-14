import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../Context/AuthContext'

const Message = ({ message }) => {
  var date = new Date(message.updatedAt);
  var hrs = date.getHours().toString().padStart(2, '0')
  var mintes = date.getMinutes().toString().padStart(2, '0')
  const { currentUser, selectedChat } = useContext(AuthContext)
  const ref = useRef()
  const scrollTOBottom = () => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
  useEffect(() => {
    if (ref.current) {
      scrollTOBottom();
    }
  }, [message]);

  return (
    <div ref={ref} className={`message ${message.sender._id === currentUser._id && "owner"}`}>
      <div className="messageinfo">
        <img src={message.sender._id === currentUser._id ? currentUser.pic : message.sender.pic} alt="" />
        {/* <span>{date.substring(16, 21)}</span> */}
      </div>
      <div className="messagecontent">
        <div>
          {selectedChat.isGroupChat && <p style={{
            marginBottom: '2px'
          }}><strong>{message.sender.name} </strong></p>}
          <p>{message.content}</p>
        </div>
        <span style={{
          fontSize: '12px'
        }}>{`${hrs}:${mintes}`}</span>
        {message?.img && <img src={message.img} alt="" />}
      </div>
    </div>
  )
}

export default Message
