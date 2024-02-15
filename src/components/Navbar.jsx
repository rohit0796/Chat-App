import React, { useContext, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import exit from '../img/exit.png'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate()
  const { setCurrentUser, currentUser } = useContext(AuthContext)
  const signOut = () => {
    setCurrentUser(null)
    localStorage.removeItem('token');
    navigate('/login')
  }
  return (
    <>
      <div className='navbar'>
        <span className='logo'>Chat-App</span>
        <div className="user">
          <div className="user-details" onClick={handleOpen}>
            <img src={currentUser?.pic} alt="" />
            <span>{currentUser?.name}</span>
          </div>
          <button onClick={signOut}> <img src={exit} className="img" /> </button>
          <span className='logout'>
            Log out
          </span>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="info-cont">
            <img src={currentUser?.pic} alt="" className="user-img"/>
            <p>Name : {currentUser?.name}</p>
            <p>Email : {currentUser?.email}</p>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default Navbar
