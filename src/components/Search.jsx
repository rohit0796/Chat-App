import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
const Search = ({
  users,
  setUsers,
  onClickHandler
}) => {
  const keys = ['name', 'email'];
  const [userName, setUserName] = useState("")
  const { currentUser, setSelectedChat } = useContext(AuthContext)

  // console.log(currentUser)
  // console.log(user)
  const handleChange = (e) => {
    setUserName(e.target.value);
  }
  const filterItem = (item) => {
    if (userName != "") {
      return (keys.some((key) => String(item[key]).toLowerCase().includes(userName.toLowerCase())) && item._id !== currentUser._id)
    }
    else
      return null
  }

  return (
    <div className='search'>
      <div className="searchform">
        <input type="text" placeholder='find someone🔎' value={userName} onChange={handleChange} />
      </div>
      {users.filter(filterItem).length == 0 && userName != "" ? <p>No User Found!! </p> :
        users.filter(filterItem).map((obj) => {
          return (
            <div className="user-chart" key={obj._id} onClick={() => {
              onClickHandler(obj._id)
              setUserName("")
            }}>
              <div className="searchuserchartinfo">
                <img className="Search-img" src={obj?.pic} alt="" />
                <span>{obj.name}</span>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Search
