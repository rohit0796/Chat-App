import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext';
import url from '../url';
var chatComp;
const Allusers = ({ setModal, modal, AddUser }) => {

    const { selectedChat, currentUser } = useContext(AuthContext)
    useEffect(() => {
        chatComp = selectedChat
    }, [selectedChat])
    const [user, setUser] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const handleOptionToggle = (option) => {
        if (chatComp.users.some((user) => {
            return user == option._id
        }))
            alert('already present');
        else {

            const isSelected = selectedOptions.includes(option);
            if (isSelected) {
                setSelectedOptions(selectedOptions.filter((item) => item !== option));
            } else {
                setSelectedOptions([...selectedOptions, option]);
            }
        }
    };
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
    return (
        <div style={{
            overflow: 'auto'
        }}>
            {
                user.map((option) => {
                    return (
                        <div className="user-chart" key={option._id}
                            onClick={() => handleOptionToggle(option)}
                            style={{
                                cursor: "pointer",
                                margin: '0.5rem',
                                fontWeight: selectedOptions.includes(option) ? 'bold' : 'normal',
                                color: selectedOptions.includes(option) ? 'white' : 'inherit',
                                backgroundColor: selectedOptions.includes(option) ? '#7678ed' : '#eeeef8',
                            }}
                        >
                            <div className="searchuserchartinfo">
                                <img className="Search-img" src={option?.pic} alt="" />
                                <span>{option?.name}</span>
                            </div>
                        </div>
                    )
                })
            }
            <button
                className='button'
                onClick={() => {
                    AddUser(selectedOptions)
                    setModal(!modal)
                }
                }>Add</button>
        </div>
    )
}

export default Allusers
