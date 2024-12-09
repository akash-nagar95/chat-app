import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LogOut from "./LogOut";
import ChatInput from "./ChatInput";
import axios from "axios";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, currentUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const userChange = async () => {
      if (!currentUser || !currentUser._id) {
        console.error("currentUser is null or does not have an _id");
        return;
      }
      if (!currentChat || !currentChat._id) {
        console.error("currentChat is null or does not have an _id");
        return;
      }
      try {
        const response = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        // console.log("API Response:", response.data);
        setMessages(
          Array.isArray(response.data.projectedMessages)
            ? response.data.projectedMessages
            : []
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };
    userChange();
  }, [currentChat, currentUser]);



  const handleSendMsg = async (msg) => {
    try {
      const response = await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });
      if (response.data.success) {
        setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                {/* <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                /> */}
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage }`}
                  alt="avatar"
                />

              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <LogOut />
          </div>
          <div className="chat-messages">
            {
              messages.map((message) => {
                  return (
                      <div >
                          <div className={`message ${message.fromSelf ? "sended" : "received" }`} >
                              <div className="content">
                                  <p>
                                      {message.message}
                                  </p>
                              </div>
                          </div>
                      </div>
                  );
              }) 
            }
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px){
    grid-auto-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;