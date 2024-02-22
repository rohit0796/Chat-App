import React, { useCallback, useContext, useEffect, useState } from 'react'
import socket from '../socket'
import ReactPlayer from 'react-player';
import { AuthContext } from '../Context/AuthContext';
import Peer from '../Service/Peer';
import { useNavigate, useParams } from 'react-router-dom';
const Lobby = () => {

    const [remote, setRemote] = useState()
    const [join, setJoin] = useState()
    const navigate = useNavigate()
    const { mystream } = useContext(AuthContext)
    const [remoteStream, setRemoteStream] = useState()
    const [isEndButton, setIsendbutton] = useState()
    const { roomId } = useParams();
    const sendStreams = useCallback(() => {
        setJoin(false)
        const senders = Peer.peer.getSenders();
        const tracks = mystream.getTracks();
        const allTracksSent = tracks.every(track => senders.some(sender => sender.track === track));
        if (!allTracksSent) {
            for (const track of tracks) {
                const senderExists = senders.some(sender => sender.track === track);
                if (!senderExists) {
                    Peer.peer.addTrack(track, mystream);
                }
            }
        }
    }, [mystream]);

    const handleIncommingcall = async ({ from, offer }) => {
        setJoin(from)
        setRemote(from)
        const ans = await Peer.getAnswer(offer)
        socket.emit('call-accepted', { to: from, ans })
    }
    const handleCallAccepted = async ({ from, ans }) => {
        sendStreams()
        await Peer.setRemoteDesc(ans)
    }
    const handleUserJoined = (id) => {
        setRemote(id);
    };
    const handleNegoNeeded = async ({ from, offer }) => {
        const ans = await Peer.getAnswer(offer);
        socket.emit("nego-done", { to: from, ans });
    };

    const handleNegoDone = async ({ from, ans }) => {
        await Peer.setRemoteDesc(ans);
    };
    const handleCallEnded = () => {
        alert("user Left, Call Ended")
        setRemoteStream(null);
        setRemote(null)
    }
    useEffect(() => {
        socket.on("incomming-call", handleIncommingcall);
        socket.on("UserJoined", handleUserJoined);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("nego:needed", handleNegoNeeded);
        socket.on("nego:done", handleNegoDone);
        socket.on("call-ended", handleCallEnded);

        return () => {
            socket.off("incomming-call", handleIncommingcall);
            socket.off("UserJoined", handleUserJoined);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("nego:needed", handleNegoNeeded);
            socket.off("nego:done", handleNegoDone);
            socket.off("call-ended", handleCallEnded);

        };

    }, [socket, handleIncommingcall, handleUserJoined, handleCallAccepted, handleNegoNeeded, handleNegoNeeded, handleCallEnded])
    const trackHandler = async (ev) => {
        const remoteStream = ev.streams;
        setRemoteStream(remoteStream[0])
        setIsendbutton(true)
    }
    const negoHandler = async () => {
        const offer = await Peer.getOffer();
        socket.emit("nego-needed", { offer, to: roomId })
    }
    useEffect(() => {
        Peer.peer.addEventListener('track', trackHandler)
        return () => {
            Peer.peer.removeEventListener('track', trackHandler)
        }
    }, [trackHandler])
    useEffect(() => {
        Peer.peer.addEventListener("negotiationneeded", negoHandler)
        return () => {
            Peer.peer.removeEventListener("negotiationneeded", negoHandler)
        }
    }, [negoHandler])

    const handleCall = async () => {
        const offer = await Peer.getOffer()
        socket.emit("user-call", { to: roomId, offer });
    }
    const handleCallEnd = () => {
        socket.emit("call-ended", { id: roomId });
        if (mystream) {
            mystream.getTracks().forEach(track => track.stop());
        }
        setRemoteStream(null);
        navigate("/");
    };

    return (
        <div className="Vwrapper">
            <div className='Lobby-container'>
                <h2>{remote ? "Connected" : "No one is There"}</h2>
                {remote && !remoteStream && <button onClick={handleCall}>CALL</button>}
                {join && <button onClick={sendStreams}>JOIN</button>}
                <div className="Video-container">
                    <div className='Video-W'>
                        <h2>mystream</h2>
                        {mystream && <ReactPlayer playing url={mystream} width='40vw' height='30vh' />}
                    </div>
                    <div className='Video-W'>
                        {remoteStream && <h2>Remote Stream</h2>}
                        {remoteStream && <ReactPlayer playing url={remoteStream} width='40vw' height='30vh' />}
                    </div>
                </div>
                {isEndButton && <button onClick={handleCallEnd}>END</button>}
            </div>
        </div>
    )
}

export default Lobby
