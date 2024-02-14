import React, { useState } from "react";
import '../css/register.css'
import { useNavigate } from "react-router-dom";
import url from "../url";
const Register = () => {
    const [err, Seterr] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        fetch(`${url}/register`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                name: displayName,
                email,
                password
            })

        }).then((res) => res.json()).then((val) => {
            console.log(val)
            if (val.status == 'ok')
                {
                    alert(val.message)
                    navigate('/login')
                }

            else if (val.status == 'error')
                alert(val.error)
        })
            .catch((err) => {
                console.log(err);
                Seterr(true)
            })

    }
    return (
        <div className="container">
            <div className="wrapper">
                <h1 className="logo"> chart app</h1>
                <span className='title'>Register</span>
                <form onSubmit={handleSubmit}>
                    <p>username:</p>
                    <input type="text" />
                    <p>email:</p>
                    <input type="email" />
                    <p>password:</p>
                    <input type="password" />
                    <div className="signup-button">
                        <button>sign up</button>
                    </div>
                </form>
                {err && <span style={{ color: 'red' }}>Email already exist or something went wrong !</span>}
                <span>do you have an account? <a href="/login">login</a></span>
            </div>
        </div>
    )
}

export default Register;