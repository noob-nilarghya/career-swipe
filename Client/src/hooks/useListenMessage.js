
import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import incomingMsgNotification from '../../src/incoming-message.mp3';

const useListenMessage = () => {
    const {socket} = useSocketContext();
    const {conversations, setConversations} = useConversation();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            newMessage.shouldShake=true;
            const sound= new Audio(incomingMsgNotification);
            sound.play();
            setConversations([...conversations, newMessage]);
        });

        return () => socket?.off("newMessage");
    }, [socket, conversations, setConversations]);
}

export default useListenMessage;