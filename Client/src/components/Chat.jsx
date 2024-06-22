import styled from "styled-components";
import ChatBox from "./ChatBox";
import ChatContent from "./ChatContent";
import { useRef, useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {blockUserService, getRoleInfoService } from '../services/apiMessage';
import toast from 'react-hot-toast';
import { useAuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import Spinner from "./Spinner";
import UserRecruiter from "./UserRecruiter";
import UserCandidate from "./UserCandidate";

const Wrapper= styled.div`
    overflow: scroll;

    &::-webkit-scrollbar { 
        display: none;
    }

    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */

    display: flex;
    position: relative;
    flex-direction: column;
    border-radius: ${({type}) => (type==='small') ? '0 1rem 0 0' : '1rem 1rem 0 0'};
    color: #002b36;

    @media (max-width: 1200px) {
        display: ${({type}) => (type === 'small' ? 'none' : 'flex')};
    }
`;
const MessageHeader= styled.div`
    height: fit-content;
    background-color: #d5eaeb;
    border-bottom: 3px solid #a4d2d3;
    border-top: 3px solid #a4d2d3;

    display: grid;
    grid-template-columns: ${(props)=> (props.clicked3Dots === false) ? '3rem auto 7rem' : '3rem 24rem'};
    align-items: center;
    column-gap: 2rem;
    padding: 1rem 2.5rem;
    position: absolute;
    top: 0;
    justify-content: ${(props)=> (props.clicked3Dots === true) ? 'space-between' : ''};

    &>span{
        font-weight: 500;
        font-size: 2rem;
        color: #002b36;
        text-align: center;
        cursor: pointer;
    }
`;
const MsgUserImg= styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    &>img{
        width: 90%;
        border-radius: 100%;
    }
`;
const GoBackMsg= styled.img`
    justify-self: end;
    cursor: pointer;
`;

const StyledChat= styled.div`
    position: relative;
    overflow: scroll;

    &::-webkit-scrollbar { 
        display: none;
    }

    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */

    height: 100%;

    &::before{
        content: ""; 
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image: url('/chat-bg.webp');
        background-size: cover;
        background-repeat: no-repeat;
        opacity: 0.45; 
        z-index: -1; 
        filter: ${({type}) => (type === 'large' ? 'brightness(0.75)' : 'brightness(0.85)')};
    }
`;

const Div3Dots= styled.div`
    display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
    align-items: center;
    -webkit-box-align: center;
    gap: 0.5rem;
    visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")}; /* Initially hidden */
    opacity: ${({ isVisible }) => (isVisible ? "1" : "0")}; /* Initially transparent */
    transition: visibility 0.3s, opacity 0.3s; /* Transition effect */
    padding: 0.5rem;
    border: 1px solid #aaa;
    border-radius: 2rem;
    background-color: #fffafa;
`;

const BlockBtn= styled.button`
    padding: 0.5rem 0.8rem;
    border: 1px solid #fff;
    border-radius: 2rem;
    background-color: #de587c;
    color: #eee;
`;

const ModalBtn = styled.button`
    margin-top: 1rem;
    padding: 0.5rem;
    border: 1px solid #fff;
    background-color: #de587c;
    color: #eee;
    border-radius: 1rem;
`;


function Chat({msgUserId, setMessageOpened, msgUserName, userPhoto, type}) {
    const SERVER_BASE_URL= import.meta.env.VITE_SERVER_URL;
    const [clicked3Dots, setClicked3Dots] = useState(false);
    const lastMessageElementRef = useRef(null);
    const [clickedForUserDetails, setClickedForUserDetails] = useState(false);
    const {authUser} = useAuthContext();
    const [roleInfo, setRoleInfo] = useState();
    const [loadingStatus, setLoadingStatus] = useState(false);

    const queryClient = useQueryClient(); 
    const { isLoading, mutate } = useMutation({
        mutationFn: (userObj) => blockUserService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            queryClient.invalidateQueries({
                queryKey: ['conversation-user']
            });
        },
        onError: (err) => {console.log(err); toast.error(err.message)}
    });

    const {isLoading: gettingRoleInfo, mutate: mutateRoleInfo} = useMutation({
        mutationFn: (userObj) => getRoleInfoService(userObj),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['role-info-conversation']
            });
            setLoadingStatus((val)=> false);
            setRoleInfo((val)=> data.data.finalRoleUser);
        },
        onError: (err) => {
            toast.error("User deactivated his/her account");
            setClickedForUserDetails((val)=>false);
        },
        onMutate: () => setLoadingStatus((val)=>true)
    });

    const handleBlockUser = function(){
        const obj= {
            toBeBlockedID: msgUserId
        }
        mutate(obj);
        setClicked3Dots((val)=>!val);
        setTimeout(()=> window.location.reload(), 2000);
    }

    const handleClickOnUsername= function(){
        setClickedForUserDetails(prevState => !prevState);
        const obj= {
            otherUserID: msgUserId,
            role: (authUser.user.role === 'candidate') ? 'recruiter' : 'candidate'
        }
        mutateRoleInfo(obj);
    }

    const handleClickUserDetail= function(){
        setClickedForUserDetails(prevState => !prevState);
        const obj= {
            otherUserID: msgUserId,
            role: (authUser.user.role === 'candidate') ? 'recruiter' : 'candidate'
        }
        mutateRoleInfo(obj);
        setClicked3Dots((val)=>!val);
    }

    return (
        <Wrapper type={type}>
            <MessageHeader clicked3Dots={clicked3Dots}>
                <GoBackMsg onClick={()=>setMessageOpened(false)} src='/goBack.svg' alt='edit'></GoBackMsg>
                {!clicked3Dots && <span onClick={handleClickOnUsername}>{msgUserName}</span>}
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    {!clicked3Dots && <MsgUserImg><img src={`${SERVER_BASE_URL}/${userPhoto}`} alt='userImg'></img></MsgUserImg>}
                    <Div3Dots isVisible={clicked3Dots}>
                        <BlockBtn onClick={handleBlockUser}>Block User</BlockBtn>
                        <BlockBtn onClick={handleClickUserDetail}>User's Info</BlockBtn>
                    </Div3Dots>
                    <img style={{width: "21px", cursor: "pointer"}} onClick={()=> setClicked3Dots((val)=> !val)} src='/threeDots.svg' alt='...'></img>
                </div>
            </MessageHeader>
            <StyledChat type={type}>
                <ChatContent msgUserId={msgUserId} lastMessageElementRef={lastMessageElementRef} />
                <ChatBox msgUserId={msgUserId} lastMessageElementRef={lastMessageElementRef} />
            </StyledChat>
            <Modal isOpen={clickedForUserDetails} purpose='chatInfo'>
                {(loadingStatus) ? 
                    <Spinner /> 
                    :
                    <>
                        {authUser.user.role === 'candidate' ? 
                            <UserRecruiter roleInfo={roleInfo} purpose='chatInfo' /> :
                            <UserCandidate roleInfo={roleInfo} purpose='chatInfo' />
                        }
                    </>
                }
                <ModalBtn onClick={()=> setClickedForUserDetails((val)=> !val)}>Close User-Info Modal</ModalBtn>
            </Modal>
        </Wrapper>
    );
}   

export default Chat;
