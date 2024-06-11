import styled, { keyframes, css } from "styled-components";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";
import formatDateTime from '../utils/dateTimeFormatter';
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {getMessageService} from '../services/apiMessage';
import toast from 'react-hot-toast';
import ChatLoader from "../components/skeletons/ChatLoader";
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import useListenMessage from "../hooks/useListenMessage";

const StyledChatContent= styled.div`
    overflow: scroll;

    &::-webkit-scrollbar { 
        display: none;
    }

    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */

    padding: 2rem 3rem;

    display: flex;
    width: 100%;
    height: calc(100% - 7.2rem);
    flex-direction: column;
    gap: 1rem;
`;
const shake = keyframes`
  10%, 90% { transform: translate3d(-1px, 0, 0); }

  20%, 80% { transform: translate3d(2px, 0, 0); }

  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }

  40%, 60% { transform: translate3d(4px, 0, 0); }
`;
const SheMsgWrapper= styled.div`
    width: fit-content;
    max-width: 70%;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    &>span{
        font-size: 1rem;
        align-self: flex-end;
        color: #838d93;
    }
    animation: ${props => props.shake ? css`${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) 0.2s both` : 'none'};
`;
const MeMsgWrapper= styled.div`
    width: fit-content;
    max-width: 70%;
    align-self: flex-end;
    display: flex;
    flex-direction: column;
    &>span{
        font-size: 1rem;
        align-self:flex-end;
        color: #838d93;
    }
    animation: ${props => props.shake ? css`${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) 0.2s both` : 'none'};
`;
const Me= styled.div`
    align-self: flex-end;
    width: fit-content;

    padding: 0.8rem 1.5rem;
    border-radius: 2rem;
    border-bottom-right-radius: 0;
    background: border-box #7cced2; 
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`;
const She= styled.div`
    width: fit-content;

    padding: 0.8rem 1.5rem;
    border-radius: 2rem;
    border-bottom-left-radius: 0;
    background: border-box #f0f0f0; 
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`;
const NoChatMessage= styled.p`
    color: #838d93;
    border: 3px solid #838d93;
    font-weight: 500;
    width: fit-content;
    padding: 1rem 2rem;
    border-radius: 2rem;
`;

function ChatContent({msgUserId, lastMessageElementRef}) {
    const {conversations, setConversations} = useConversation();
    const [loadingStatus, setLoadingStatus] = useState(false);
    useListenMessage();

    const queryClient = useQueryClient(); 
    const { isLoading, mutate } = useMutation({
        mutationFn: (userObj) => getMessageService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            setLoadingStatus((val)=> false);
            queryClient.invalidateQueries({
                queryKey: ['conversation-user']
            });

            setConversations(data.data.message);
        },
        onError: (err) => toast.error(err.message),
        onMutate: ()=> setLoadingStatus((val)=> true)
    });

    useEffect(()=>{
        const obj= {
            otherUserID: msgUserId
        }
        mutate(obj);

        setTimeout(()=> {
            if (lastMessageElementRef.current) {
                lastMessageElementRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        },1500);
    }, []);

    // Watch for changes in the conversations array
    useEffect(() => {
        // Scroll to the last message element after a new message is added
        if (lastMessageElementRef.current) {
            lastMessageElementRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversations]); // Depend on conversations array

     
    const {authUser}= useAuthContext();

    if(loadingStatus || isLoading) {
        return (
            <StyledChatContent>
                <ChatLoader />
            </StyledChatContent>
        )
    }

    return (
        <StyledChatContent>
            {conversations.map((chat, index)=> (chat.senderID===authUser.user._id) ? 
                <MeMsgWrapper shake={chat.shouldShake} key={index} ref={(index === conversations.length - 1) ? lastMessageElementRef : null}><Me>{chat.messageContent}</Me> <span>{formatDateTime(chat.updatedAt)}</span></MeMsgWrapper>
             :
                <SheMsgWrapper shake={chat.shouldShake} key={index} ref={(index === conversations.length - 1) ? lastMessageElementRef : null}><She>{chat.messageContent}</She> <span>{formatDateTime(chat.updatedAt)}</span></SheMsgWrapper>
                
            )}
            {conversations.length===0 && <NoChatMessage>Say Hi, &#128075;</NoChatMessage>}
        </StyledChatContent>
    );
}

export default ChatContent;
