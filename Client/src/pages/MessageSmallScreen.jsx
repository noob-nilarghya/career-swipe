import { useState } from "react";
import styled from "styled-components";
import Message from "../components/Message";
import Chat from "../components/Chat";

const StyledSmallScreenMsg= styled.div`
    height: 100vh;
    max-height: 100vh;
    width: 100vw;
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    overflow: scroll;
    color: #4f4f4f; 

    &::-webkit-scrollbar { 
        display: none;
    }

    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
`;


function MessageSmallScreen() {

    const [messageOpened, setMessageOpened] = useState(false);
    const [msgUserId, setMsgUserId] = useState('');
    const [msgUserName, setMsgUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState('');

    return (
        <StyledSmallScreenMsg>
            {(!messageOpened) ?
                <Message type='large' setMessageOpened={setMessageOpened} setMsgUserId={setMsgUserId} setMsgUserName={setMsgUserName} setUserPhoto={setUserPhoto} /> :
                <Chat type='large' msgUserId={msgUserId} setMessageOpened={setMessageOpened} msgUserName={msgUserName} userPhoto={userPhoto}/>
            }
        </StyledSmallScreenMsg>
    );
}

export default MessageSmallScreen;
