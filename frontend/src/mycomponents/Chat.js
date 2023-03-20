// import React, { useEffect, useState } from 'react';
// import ScrollToBottom from "react-scroll-to-bottom";
// import io from "socket.io-client";
// import './chat.css'
// const socket = io.connect("http://localhost:4000");

// export const Chat = (props) => {
//     var chatwith = localStorage.getItem("chatwith")
//     const room = String(Math.pow(chatwith.length, 4) + Math.pow(props.user.username.length, 4))
//     socket.emit("join_room", room);
//     const [currentMessage, setCurrentMessage] = useState("");
//     const [messageList, setMessageList] = useState([]);

//     const sendMessage = async () => {
//         if (currentMessage !== "") {
//             const messageData = {
//                 room: room,
//                 author: chatwith,
//                 message: currentMessage,
//                 fname: props.user.firstname,
//                 time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
//             };
//             await socket.emit("send_message", messageData);
//             setMessageList((list) => [...list, messageData]);
//             setCurrentMessage("");
//         }
//     };
//     useEffect(() => {
//         socket.on("receive_message", (data) => {
//             setMessageList((list) => [...list, data]);
//         });
//     }, [socket]);
//     return (
//         <>
//             <div className='card home-card' style={{ display: "flex" }}>
//                 <div className='card-content'>
//                     <div className="chat-window">
//                         <div className="chat-header">
//                             <p>Live Chat</p>
//                         </div>
//                         <div className="chat-body">
//                             <ScrollToBottom className="message-container">
//                                 {messageList.map((messageContent) => {
//                                     return (
//                                         <div className="message" id={chatwith === messageContent.author ? "you" : "other"}>
//                                             <div>
//                                                 <div className="message-content">
//                                                     <p>{messageContent.message}</p>
//                                                 </div>
//                                                 <div className="message-meta">
//                                                     <p id="time">{messageContent.time}</p>
//                                                     <p id="author">{messageContent.fname}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </ScrollToBottom>
//                         </div>
//                         <div className="chat-footer">
//                             <input type="text" value={currentMessage} placeholder="Type Here" onChange={(event) => { setCurrentMessage(event.target.value); }} onKeyPress={(event) => { event.key === "Enter" && sendMessage(); }} />
//                             <button onClick={sendMessage}>&#9658;</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }