import React, { useContext, useEffect, useState } from 'react';
import Charts from './Charts';
import Navbar from './Navbar';
import Search from './Search';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import url from '../url';
import { AuthContext } from '../Context/AuthContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [user, setUser] = useState([])
  const handleOpen = () => setOpen(true);
  const [groupName, setGroupName] = useState('')
  const handleClose = () => setOpen(false);
  const { currentUser, setSelectedChat, repeatFetch, setRepeatFetch } = useContext(AuthContext)
  const createGroup = () => {
    if (groupName != "") {
      var array = selectedOptions;
      array.push(currentUser._id)
      var objt = {
        creator: currentUser,
        users: array,
        name: groupName
      }
      fetch(`${url}/create-groupChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objt)
      }).then((res) => res.json())
        .then((val) => console.log(val))
      setRepeatFetch(!repeatFetch)
      handleClose()
    }
    else {
      alert('Please enter a group name.')
    }
  }
  const getData = () => {
    fetch(`${url}/get-user`, {
      method: 'GET',
    })
      .then((val) => val.json())
      .then((res) => {
        var data2 = res.users.filter((obj) => obj._id != currentUser._id)
        setUser(data2)
      })
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    getData();
  }, [])
  const handleOptionToggle = (option) => {
    const isSelected = selectedOptions.includes(option);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSearch = (id) => {
    const userID = {
      userid: currentUser._id,
      searchid: id
    }
    fetch(`${url}/accessChat`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userID),
    }).then((val) => val.json())
      .then((data) => {
        setSelectedChat(data)
      })

  }

  return (
    <div className='sidebar'>
      <div>
        <Navbar />
        <Search users={user} setUsers={setUser} onClickHandler={handleSearch} />
        <Charts />
      </div>
      <div style={{ textAlign: 'center' }}>
        <button className="add-groups" onClick={handleOpen}>
          Add New Group
        </button>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Group Options
            </Typography>
            <input type="text" placeholder='Enter the Group Name..' className='Input' value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
            <Search users={user} setUsers={setUser} onClickHandler={handleOptionToggle} />
            <div style={{
              display: 'flex',
              flexWrap: 'wrap'
            }}>
              {user.map((option) => (
                <Button
                  key={option._id}
                  variant={selectedOptions.includes(option._id) ? 'contained' : 'outlined'}
                  onClick={() => handleOptionToggle(option._id)}
                  sx={{
                    margin: '0.5rem',
                    fontWeight: selectedOptions.includes(option._id) ? 'bold' : 'normal',
                    color: selectedOptions.includes(option._id) ? 'white' : 'inherit',
                    backgroundColor: selectedOptions.includes(option._id) ? 'blue' : 'transparent',
                  }}
                >
                  {option.name}
                </Button>
              ))}
            </div>
            <Button onClick={createGroup}> Create Group </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Sidebar;
