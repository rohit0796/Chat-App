import React, { useContext, useEffect, useState } from 'react'
import cam from '../img/cam.png'
import add from '../img/add.png'
import more from '../img/more.png'
import Messages from './Messages'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Input from './Input'
import { AuthContext } from '../Context/AuthContext'
import { getSender, getSenderFull } from '../UserLogic'
import socket from '../socket'
import url from '../url'
import Allusers from './Allusers'
import back from '../img/arrow.png'
import Peer from '../Service/Peer';
import { useNavigate } from 'react-router-dom'
const Chart = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([]);
  const { selectedChat, currentUser, setSelectedChat, setMystream, mystream } = useContext(AuthContext)
  const [show, setShow] = useState(false);
  const [aduserModal, setaduserModal] = useState(false);
  const [chatName, setchatName] = useState('')
  const [groupUsers, setGroupUsers] = useState([])
  const [socketConnected, setsocketConnected] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [IndvModal, setIndvModal] = useState(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  const handleOpen = (func) => { func(true) }
  const handleClose = (func) => { func(false); setaduserModal(false) }
  useEffect(() => {
    if (currentUser) {
      socket.emit('setup', currentUser)
      socket.on('connected', () => {
        setsocketConnected(true);
      })

    }
  }, [socket])

  const handleUpdate = () => {
    var obj = selectedChat
    obj.chatName = chatName;
    obj.users = groupUsers.map((user) => user._id)
    fetch(`${url}/update-group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj)
    }).then((val) => val.json())
      .then((res) => console.log(res))
    handleClose(setGroupModal)
  }
  const handleVideo = async () => {
    var stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (error) {

      alert("Please allow Microphone and camera access")
    }
    if (stream) {
      setMystream(stream);
      socket.emit("Join-Lobby", selectedChat?._id)
      navigate(`/room/${selectedChat?._id}`);
    }

  }
  const getChats = () => {

    fetch(`${url}/get-messages/${selectedChat._id}`, {
      method: 'GET'
    }).then((val) => val.json())
      .then((res) => setMessages(res));

    socket.emit("join chat", selectedChat._id);
  }
  useEffect(() => {
    if (selectedChat) {
      getChats();
      setchatName(selectedChat.chatName)
      var dummy = selectedChat?.users
      setGroupUsers(dummy)
    }
  }, [selectedChat]);

  const removeUser = (ind) => {
    var usersList = groupUsers;
    usersList.splice(ind, 1);
    setGroupUsers([...usersList]);

  }
  const AddUser = (users) => {
    var usersList = groupUsers;
    users.forEach(user => {
      usersList.push(user)
    });
    setGroupUsers([...usersList]);
  }
  useEffect(
    () => {
      if (!selectedChat)
        setShow(false);
      else
        setShow(true);
    }, [selectedChat?._id])
  return (
    <>
      {!show && <div className="chartnone">
        <h3>Please Select a Contact to Start Chatting</h3>
      </div>}
      {show && <div className='chart' >
        <div className="chartinfo">
          <div style={{
            display: 'flex',
            alignItems: "center",
            justifyContent: 'center',
            gap: 2,
          }}>
            <button onClick={() => setSelectedChat({ ...selectedChat })} style={{
              border: "none",
              outline: "none",
              background: "none",
              padding: 0,

            }}> <img src={back} alt="<-" style={{ height: '15px', width: '15px ' }} /> </button>
            <div className='display-details' onClick={() => {
              selectedChat.isGroupChat ?
                handleOpen(setGroupModal)
                :
                handleOpen(setIndvModal)
            }}>
              <img src={getSenderFull(currentUser, selectedChat?.users)?.pic} alt="" />
              <span>{!selectedChat.isGroupChat
                ? getSender(currentUser, selectedChat?.users)
                : selectedChat.chatName}</span>
            </div>
          </div>
          <div className="charticon">
            <img src={cam} alt="" onClick={handleVideo} />
          </div>
        </div>
        <Messages messages={messages} setMessages={setMessages} />
        <div className="ip">
          <Input messages={messages} setMessages={setMessages} />
        </div>
      </div >}
      {selectedChat?.isGroupChat &&
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={groupModal}
          onClose={() => handleClose(setGroupModal)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={groupModal}>
            <Box sx={style}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                <input type="text" value={chatName} className='Input' onChange={(e) => setchatName(e.target.value)} />
              </Typography>
              <div>
                {selectedChat.groupAdmin._id == currentUser._id && !aduserModal && <button className='button' onClick={() => setaduserModal(!aduserModal)}>Add Member</button>}
                <div>
                  {aduserModal ? <Allusers modal={aduserModal} setModal={setaduserModal} AddUser={AddUser} /> :
                    groupUsers.map((user, ind) => (

                      <div className="searchuserchartinfo" key={user?._id}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: '10px'
                        }}>
                          <img className="Search-img" src={user?.pic} alt="" />
                          <span>{user?.name}</span>
                        </div>
                        <div>
                          {(selectedChat.groupAdmin._id == currentUser._id && user._id != currentUser._id) ? <Button onClick={() => { removeUser(ind) }}>Remove</Button> : ""}
                        </div>
                        <div>
                          {(selectedChat.groupAdmin._id == user._id && user._id != currentUser._id) ? "ADMIN" : ""}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <button className='button' onClick={handleUpdate} > Update Group </button>
              <button className='button' onClick={() => handleClose(setGroupModal)}> Cancel </button>
            </Box>
          </Fade>
        </Modal>}
      <Modal
        open={IndvModal}
        onClose={() => handleClose(setIndvModal)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="info-cont">
            <img src={getSenderFull(currentUser, selectedChat?.users)?.pic} alt="" className="user-img" />
            <p>Name : {getSender(currentUser, selectedChat?.users)}</p>
            <p>Email : {getSenderFull(currentUser, selectedChat?.users)?.email}</p>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default Chart
