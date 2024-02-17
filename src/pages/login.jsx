import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import url from '../url'
const Login = () => {
  const [err, Seterr] = useState(false)
  const [errMsg, SeterrMsg] = useState("Something Went wrong")
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const init = () => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${url}/fetch-data`, {
        headers: {
          'x-access-token': token,
        },
        method: "GET",
      })
        .then((val) => val.json())
        .then((res) => {
          setCurrentUser(res.user)
          navigate('/');
        })
        .catch((err) => console.log(err))
    }
  }
  useEffect(() => {
    init();
  }, [])
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    fetch(`${url}/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })

    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.status == 'ok') {
          localStorage.setItem('token', data.token)
          setCurrentUser(data.user)

          alert('Login successful')
          navigate('/')
        } else {
          if (data.error)
            SeterrMsg(data.error)
          else
            SeterrMsg("Something went Wrong!")
          Seterr(true)
        }
      })
      .catch((err) => Seterr(true))

  }

  return (
    <div className='container'>
      <div className="wrapper">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <p>Email:</p>
          <input type="email" name="" id="" />
          <p>password:</p>
          <input type="password" name="" id="" />
          <div className="buttons">
            <button type='submit'>log in</button>
          </div>
        </form>
        {err && <span style={{ color: 'red' }}>{errMsg}!</span>}
        <span>Dont have an account? <a href="/register">Register</a></span>
      </div>
    </div>
  )
}
export default Login
