import React, { useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chart from "../components/Chart"
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext)
    useEffect(() => {
        if (!currentUser) navigate('/login')
    }, [])
    return (
        <div className="container">
            <div className="wrapper-home">
                <Sidebar></Sidebar>
                <Chart></Chart>
            </div>
        </div>
    )
}
export default Home;