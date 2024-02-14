import React, { useContext, useEffect, useState } from 'react'
import imgs from '../img/img.png';
import attach from '../img/attach.png'
import { AuthContext } from '../Context/AuthContext';
import send from '../img/send.png'
import url from '../url';
import socket from '../socket';
var dis = true;
var count = 0;
const Input = ({ messages, setMessages }) => {
  const { currentUser, selectedChat, chat, setChat, repeatFetch, setRepeatFetch } = useContext(AuthContext)
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [img, setImg] = useState(null);
  useEffect(() => {
    if (text === "") {
      dis = true;
    }
    else
      dis = false;
  }, [text])
  const handleTyping = (e) => {
    var obj = {
      id: selectedChat._id,
      name: currentUser.name
    }
    setText(e.target.value)
    if (!typing) {
      socket.emit("start typing", obj);
      setTyping(true);
    }
    var timerLength = 3000;
    setTimeout(() => {
      if (typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }
  const handleSend = () => {
    fetch(`${url}/send-messages`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        content: text,
        chatId: selectedChat._id,
        userId: currentUser._id
      })
    }).then((val) => val.json()).then((res) => {
      setMessages([...messages, res])
      setRepeatFetch(!repeatFetch);
      socket.emit('new message', res)
    });
    var chat2 = chat
    chat2.forEach((chat, ind) => {
      if (chat._id == selectedChat._id) {
        {
          chat.latestMessage.content = text;
          chat.latestMessage.sender = currentUser
        }
      }
    })
    setChat(chat2)
    setText("")
  }

  return (
    <div className='Input'>
      <input type="text" placeholder='write something....' onChange={handleTyping} value={text} required />
      <div className="send">
        {/* <img src={attach} alt="" />
        <input type="file" style={{ display: "none" }} id="file" onChange={e => setImg(e.target.files[0])} />
        <label htmlFor="file">
          <img src={imgs} alt="" />
        </label> */}
        <button onClick={handleSend} disabled={dis}><img src={send} alt="" srcset="" /></button>
      </div>
    </div>
  )
}

export default Input
