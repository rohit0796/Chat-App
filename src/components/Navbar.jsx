import React, { useContext, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import exit from '../img/exit.png'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  const navigate = useNavigate()
  const { setCurrentUser, currentUser } = useContext(AuthContext)
  const [modal, setModal] = useState(false)
  const signOut = () => {
    setCurrentUser(null)
    localStorage.removeItem('token');
    navigate('/login')
  }
  return (
    <>
      <div className='navbar'>
        <span className='logo'>Chart-App</span>
        <div className="user">
          <div className="user-details" onClick={() => setModal(true)}>
            <img src={currentUser?.pic} alt="" />
            <span>{currentUser?.name}</span>
          </div>
          <button onClick={signOut}> <img src={exit} className="img" /> </button>
          <span className='logout'>
            Log out
          </span>
        </div>
      </div>
    </>
  )
}

export default Navbar
