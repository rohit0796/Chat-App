import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import url from '../url'
const Login = () => {
  const [err, Seterr] = useState(false)
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
        if (data.user) {
          localStorage.setItem('token', data.token)
          setCurrentUser(data.user)

          alert('Login successful')
          navigate('/')
        } else {
          alert('Please check your username and password')
        }
      })
      .catch((err) => Seterr(true))

  }

  return (
    <div className='container'>
      <div className="wrapper">
        <h1>Chart App</h1>
        <span>Log In</span>
        <form onSubmit={handleSubmit}>
          <p>Email:</p>
          <input type="email" name="" id="" />
          <p>password:</p>
          <input type="password" name="" id="" />
          <div className="buttons">
            <button type='submit'>log in</button>
          </div>
        </form>
        {err && <span style={{ color: 'red' }}>Incorrect Password or something went wrong !</span>}
        <span>Dont have an account? <a href="/register">Register</a></span>
      </div>
    </div>
  )
}
export default Login
