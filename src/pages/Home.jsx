import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Chart from "../components/Chart"
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate = useNavigate();
    const { currentUser, selectedChat } = useContext(AuthContext)
    const [isMobileView, setIsMobileView] = useState(false);
    const [isside, setIsside] = useState(true);
    const [isChat, setisChat] = useState(true);
    useEffect(() => {
        if (!currentUser) navigate('/login');
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
            setisChat(!(window.innerWidth < 768))
            if (!isMobileView) {
                setIsside(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        if (isMobileView) {
            setIsside(!isside)
            setisChat(!isChat)
        }
    }, [selectedChat])

    return (
        <div className="container">
            <div className="wrapper-home">
                {isside && <Sidebar />}
                {isChat && <Chart></Chart>}
            </div>
        </div>
    )
}
export default Home;