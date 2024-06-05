
import {create} from 'zustand';

const useConversation= create((set) => ({
    conversations: [],
    setConversations: (conversations) => set({conversations})
}));

export default useConversation;