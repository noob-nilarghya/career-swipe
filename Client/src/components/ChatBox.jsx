import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { sendFirstMessageService, sendMessageService, isBlockedService } from '../services/apiMessage';
import toast from 'react-hot-toast';
import Spinner from "./Spinner";
import useConversation from "../zustand/useConversation";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 auto;
    gap: 1rem;
    height: 5rem;
    width: 100%;
    position: sticky;
    bottom: 0;
`;

const StyledChatBox = styled.div`
    width: 95%;
    background-color: #d9eced;
    border: 2px solid #7cced2;
    border-radius: 2rem;
    padding: 0.5rem 3rem;
`;
const Form = styled.form`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const Input = styled.input`
    height: 100%;
    width: 90%;
    border: none;
    background-color: #d9eced;

    &::placeholder{
        color: #002b36;
    }
    &:focus{
        outline: none;
    }
`;
const Button = styled.button`
    width: 3.5rem;
    height: 3.5rem;
    border: none;
    &>img{
        background-color: #d9eced;
    }
`;
const DownArrow= styled.div`
    position: absolute;
    bottom: 50px;
    right: 14px;
    width: 30px;
    cursor: pointer;
`;


function ChatBox({ msgUserId, lastMessageElementRef }) {
    const { conversations, setConversations } = useConversation();
    const { register, handleSubmit, reset } = useForm();
    const [isBlocked, setIsBlocked] = useState(false);


    const queryClient = useQueryClient();
    const { isLoading: checkingBlocked, mutate: mutateChkBlk } = useMutation({
        mutationFn: (userObj) => isBlockedService(userObj),
        onSuccess: (data) => { // instruction to be performed on success
            queryClient.invalidateQueries({
                queryKey: ['conversation-user']
            });

            setIsBlocked((val)=> data.blocked);
        },
        onError: (err) => toast.error(err.message)
    });

    const { isLoading: sendingFirstMsg, mutate: mutateFirstMsg } = useMutation({
        mutationFn: (userObj) => sendFirstMessageService(userObj),
        onSuccess: (data) => { // instruction to be performed on success
            queryClient.invalidateQueries({
                queryKey: ['conversation-user']
            });

            setConversations([...conversations, data.data.message]);
        },
        onError: (err) => {
            toast.error(err.message);
            setTimeout(()=> window.location.reload(), 1500);
        }
    });

    const { isLoading: sendingMsg, mutate: mutateMsg } = useMutation({
        mutationFn: (userObj) => sendMessageService(userObj),
        onSuccess: (data) => { // instruction to be performed on success
            queryClient.invalidateQueries({
                queryKey: ['conversation-user']
            });

            setConversations([...conversations, data.data.message]);
        },
        onError: (err) => {
            toast.error(err.message);
            setTimeout(()=> window.location.reload(), 1500);
        }
    });

    useEffect(() => {
        const obj= {
            otherUserID: msgUserId
        }
        mutateChkBlk(obj);
    },[]);

    function myOwnSubmitFn(data) {
        const obj = {
            message: data.chat,
            recieverID: msgUserId
        }
        if (conversations.length == 0) { // first message
            mutateFirstMsg(obj);
        }
        else if (conversations.length > 0) {
            mutateMsg(obj);
        }
        reset();
    }

    function myOwnError(err) {
        console.log(err); // same as [const {errors} = formState();]
    }

    function handleDownArrow() {
        if (lastMessageElementRef.current) {
            lastMessageElementRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    if (sendingFirstMsg || sendingMsg || checkingBlocked) { return <Spinner />; }

    if(isBlocked){ 
        return (
            <Wrapper>
                <StyledChatBox style={{margin: "0 auto"}}>
                    <p style={{textAlign: "center", color: "#b34b67", fontWeight: "500"}}>You can't reply to this conversation</p>
                    <DownArrow onClick={handleDownArrow}><img src='/down-arrow-chat.svg' alt='&#8964;'></img></DownArrow>
                </StyledChatBox>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <StyledChatBox>
                <Form onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>
                    <Input
                        type='text'
                        id='chat'
                        placeholder="Enter your message"
                        {...register('chat', {
                            required: 'This field is required'
                        })}
                    />
                    <Button><img src='/messageSend.svg' alt="send" /></Button>
                </ Form>
                <DownArrow onClick={handleDownArrow}><img src='/down-arrow-chat.svg' alt='&#8964;'></img></DownArrow>
            </StyledChatBox>
        </Wrapper>
    );
}

export default ChatBox;
