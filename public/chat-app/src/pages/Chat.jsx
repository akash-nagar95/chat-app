import React, { useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";

function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = localStorage.getItem("chat-app-user");
      if (!user) {
        navigate("/login");
      } else {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        setIsLoaded(true);
      }
    };
    checkUser();
  }, [navigate]);
  
  useEffect(() => {
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  },[currentUser]);

  useEffect(() => {
    const imageSet = async () => {
      if (currentUser && currentUser.isAvatarImageSet) {
        try {
          const data  = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      } else if (currentUser && !currentUser.isAvatarImageSet) {
        navigate("/setAvatar");
      }
    };
    imageSet();
  }, [currentUser, navigate]);
  


  const handleChatChange = (chat) =>{
    setCurrentChat(chat);
  }

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat = {handleChatChange} />
        {
          isLoaded && currentChat === null ?
          (<Welcome currentUser={currentUser} />) : 
          (<ChatContainer 
            currentChat={currentChat} 
            currentUser={currentUser} 
            socket={socket}
            />)
        }
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container{
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width:720px) and (max-width:1080px){
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat
