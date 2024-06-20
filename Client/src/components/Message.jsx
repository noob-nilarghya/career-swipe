import React, { useState } from "react";
import styled from "styled-components";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {getMatchedUserService, getMessageUserService} from '../services/apiMessage';
import toast from 'react-hot-toast';
import { useEffect } from "react";
import getRandomEmoji from "../utils/emojiGenerator";
import { useSocketContext } from "../context/SocketContext";
import MessageListLoader from "../components/skeletons/MessageListLoader";

const Wrapper= styled.div`
    overflow: scroll;

    &::-webkit-scrollbar { 
        display: none;
    }

    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */

    background-image: url('/message-bg.webp');
    background-size: cover;
    background-repeat: no-repeat;

    display: flex;
    flex-direction: column;
    border-radius: ${({type}) => (type==='small') ? '0 1rem 0 0' : '0'};
    background-color: #fff;

    @media (max-width: 1200px) {
        display: ${({type}) => (type === 'small') ? 'none' : 'flex'};
    }
`;
const MessageHeader= styled.div`
    height: ${({type}) => (type ==='large') ? '10rem' : 'fit-content'};
    background-color: #d5eaeb; 
    border-bottom: 3px solid #a4d2d3;
    border-top: 3px solid #a4d2d3;

    display: grid;
    grid-template-columns: ${({type}) => (type === 'large' ? '4rem 7rem 1fr 2rem' : '7rem 1fr 2rem')};
    align-items: center;
    column-gap: 2rem;
    padding: 1rem 2.5rem;
    border-radius: 0 0 1.2rem 1.2rem;

    &>span{
        font-weight: 500;
        font-size: 2.5rem;
        color: #002b36;
    }

    @media (max-width: 430px) {
        grid-template-columns: ${({type}) => (type === 'large' ? '3rem 5rem 1fr 2rem' : '7rem 1fr 2rem')};
        column-gap: 1rem;
        padding: 1rem 1rem;
    }
`;
const GoBack= styled.img`
    cursor: pointer;
`;
const StyledMessage= styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 0rem 2.5rem;
    position: relative;
    width: 100%;
    overflow: scroll;

    &::-webkit-scrollbar { 
        display: none;
    }

    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
`;
const MessageDiv= styled.div`
    display: grid;
    grid-template-columns: 5rem 1fr;
    column-gap: 2rem;
    cursor: pointer;
`;
const MsgUserImg= styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &>img{
        width: 90%;
        border-radius: 100%;
    }
`;
const GreenDot= styled.div`
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background-color: green;
    top: 5px;
    right: 5px;
    border: 2px solid #fff;
`;
const MsgUserTxt= styled.div`
    width: 100%;
    overflow: hidden; 
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &>span{
        text-overflow: ellipsis; 
        overflow: hidden; 
        white-space: nowrap;
    }
`;
const Hr= styled.hr`
    border: none;
    border-top: 1.5px solid #ccc;
    width: 100%;
    margin: 0rem auto;
`;
const EditProfileImg= styled.img`
    justify-self: end;
    cursor: pointer;
`;
const MessageOptions= styled.div`
    padding-left: 0.5rem;
    &>div{
        display: inline-block;
        margin: 1rem 1rem;
        font-weight: 500;
        color: #8a8989;
        cursor: pointer;
    }
`;
const NoMsgDiv= styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 5rem;
    align-items: center;
    gap: 3rem;
    position: relative;

    &>img{
        width: 33rem;
    }

    &>span{
        color: #de587c;
        font-weight: 500;
        text-align: center;
        font-size: 1.7rem;
    }

    &>span::before{
        position: absolute;
        content: "";
        top: 8px;
        left: 30px;
        width: 20%;
        padding-top: 20%;
        background-color: #bbe8e9;
        border-radius: 100%;
    }

    &>span::after{
        position: absolute;
        content: "";
        top: 0;
        left: 12px;
        width: 15%;
        padding-top: 15%;
        background-color: #f87e9e;
        border-radius: 100%;
    }

    @media (max-width: 1200px){
        &>img{
            width: 40rem;
        }
    }
`;

const ChatTerms= styled.div`
    height: fit-content;
    background-color: rgb(213, 234, 235);
    border-bottom: 3px solid rgb(164, 210, 211);
    border-top: 3px solid rgb(164, 210, 211);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.6rem 1.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
`;


function Message({setMessageOpened, setMsgUserId, setMsgUserName, setUserPhoto, type}) {
    const {authUser, setAuthUser}= useAuthContext();
    const SERVER_BASE_URL= import.meta.env.VITE_SERVER_URL;
    const navigate= useNavigate();

    const [typeOfMsg, setTypeOfMsg] = useState("chat");
    const [messages, setMessages] = useState([]); // array of chat or matched user
    const [blockedUser, setBlockedUser]= useState([]);
    
    const [loadingState, setLoadingState] = useState(true);
    const {onlineUsers} = useSocketContext();

    const queryClient = useQueryClient(); 

    const { isLoading, mutate } = useMutation({
        mutationFn: () => (typeOfMsg === 'match') ? getMatchedUserService() : getMessageUserService(), 
        onSuccess: (data) => { // instruction to be performed on success
            setLoadingState(()=>false);
            queryClient.invalidateQueries({
                queryKey: ['message-user']
            });

            setMessages((val)=> data.data.userArray);
            if(typeOfMsg === 'chat') { setBlockedUser((val)=> data.data.blockedArray); }
        },
        onError: (err) => toast.error(err.message),
        onMutate: () => setLoadingState(()=>true)
    });

    useEffect(()=>{
        mutate();
    }, []);


    function handleClick(userId, username, photo){
        setMessageOpened((val)=> true);
        setMsgUserId((val) => userId);
        setMsgUserName((val)=> username);
        setUserPhoto((val) => photo);
    }

    function handleTypeChange(type){
        setTypeOfMsg(type);
        mutate();
    }

    if(isLoading || loadingState){
        return (
            <Wrapper type={type}>
                <MessageHeader type={type}>
                    {(type==='large') && <GoBack onClick={()=>navigate(-1)} src='/goBack.svg' alt='edit'></GoBack>}
                    <MsgUserImg><img src={`${SERVER_BASE_URL}/${authUser.user.photo}`} alt='userImg' onError={`this.onerror=null; this.src=${SERVER_BASE_URL}/default.jpeg;`}></img></MsgUserImg>
                    <span>{authUser.user.username.split(' ')[0]}</span>
                    <EditProfileImg onClick={()=> navigate('/edit-account')} src='/edit.svg' alt='edit'></EditProfileImg>
                </MessageHeader>
    
                <MessageOptions>
                    <div style={(typeOfMsg==='match') ? {color: "#002b36", borderBottom: "2.5px solid #002b36"} : {}} onClick={()=>handleTypeChange('match')}>Matches</div>
                    <div style={(typeOfMsg==='chat') ? {color: "#002b36", borderBottom: "2.5px solid #002b36"} : {}} onClick={()=>handleTypeChange('chat')}>Chats</div>
                </MessageOptions>
                <MessageListLoader />
            </Wrapper>
        );
    }

    return (
        <Wrapper type={type}>
            <MessageHeader type={type}>
                {(type==='large') && <GoBack onClick={()=>navigate(-1)} src='/goBack.svg' alt='edit'></GoBack>}
                <MsgUserImg><img src={`${SERVER_BASE_URL}/${authUser.user.photo}`} alt='userImg' onError={`this.onerror=null; this.src=${SERVER_BASE_URL}/default.jpeg;`}></img></MsgUserImg>
                <span>{authUser.user.username.split(' ')[0]}</span>
                <EditProfileImg onClick={()=> navigate('/edit-account')} src='/edit.svg' alt='edit'></EditProfileImg>
            </MessageHeader>

            <MessageOptions>
                <div style={(typeOfMsg==='match') ? {color: "#002b36", borderBottom: "2.5px solid #002b36"} : {}} onClick={()=>handleTypeChange('match')}>Matches</div>
                <div style={(typeOfMsg==='chat') ? {color: "#002b36", borderBottom: "2.5px solid #002b36"} : {}} onClick={()=>handleTypeChange('chat')}>Chats</div>
            </MessageOptions>

            <StyledMessage>
                <Hr></Hr>
                {messages.map((message, index) => (
                    <React.Fragment key={index}>
                        <MessageDiv onClick={()=>handleClick(message._id, message.username, message.photo)}>
                            <MsgUserImg>
                                <img src={`${SERVER_BASE_URL}/${message.photo}`} alt='userImg'></img>
                                {onlineUsers.includes(message._id) && <GreenDot />}
                            </MsgUserImg>
                            <MsgUserTxt>
                                <span style={{fontWeight: "500", color:"#002b36"}}>{message.username}</span>
                                {(typeOfMsg==='chat') && <span style={{color:'#889096'}}>Tap here to open the conversation &nbsp; {getRandomEmoji()}</span>}
                            </MsgUserTxt>
                        </MessageDiv>

                        <Hr></Hr>
                    </React.Fragment>
                ))}
                {typeOfMsg === 'chat' && 
                    blockedUser.map((message, index) => (
                        <React.Fragment key={index}>
                            <MessageDiv onClick={()=>handleClick(message._id, message.username, message.photo)}>
                                <MsgUserImg isOnline={onlineUsers.includes(message._id)}>
                                    <img src={`${SERVER_BASE_URL}/${message.photo}`} alt='userImg'></img>
                                    {onlineUsers.includes(message._id) && <GreenDot />}
                                </MsgUserImg>
                                <MsgUserTxt>
                                    <span style={{fontWeight: "500", color:"#002b36"}}>{message.username}</span>
                                    {(typeOfMsg==='chat') && <span style={{color:'#d24f72da'}}>Blocked user, you can't reply to this conversation</span>}
                                </MsgUserTxt>
                            </MessageDiv>

                            <Hr></Hr>
                        </React.Fragment>
                    ))
                }
                {(messages.length === 0) && 
                    <NoMsgDiv>
                        {(typeOfMsg === 'match') && <><img src='/no-message.webp' alt="no msg"></img><span>No more matches found, swipe more to get matches</span></> }
                        {(typeOfMsg === 'chat' && blockedUser.length === 0) && <><img src='/no-message.webp' alt="no msg"></img><span>No more chats found, swipe more to get matches</span></> }
                    </NoMsgDiv>
                }
            </StyledMessage>
            {(type === 'large' && messages.length !== 0) && (
                <ChatTerms>
                    <span>All conversations are safe with us</span>
                    <span>&copy; Career-Swipe, 2024 &nbsp;|&nbsp; All right reserved</span>
                </ChatTerms>
            )}
        </Wrapper>
    );
}

export default Message;
