'use client';
import { useAxios } from "@/context/helper/axios";
import { IMessage } from "@/types/types";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "@/context/helper/socket";
import { RootState } from "@/context/store";
import { useEffect } from "react";
import { addMessage, setChats, setConnectionChats, setGroupChats } from "@/context/reducers/chats";



const useCreateGroupChat = () => {
    const { axios, state, dispatch } = useAxios();
    const createGroupChat = async (data : FormData) => {
        const payload = {
            name: data.get('name'),
            tagline: data.get('tagline'),
            memberIds: data.getAll('memberIds')
        }
        console.log("payload", payload);    
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post('/chat/create-group', payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            dispatch({ type: 'REQUEST_SUCCESS' });
            return res.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch({ type: 'REQUEST_ERROR', payload: err.response?.data });
                return err.response?.data;
            } else {
                dispatch({ type: 'REQUEST_ERROR', payload: 'An unknown error occurred' });
                return 'An unknown error occurred';
            }
        }
    }
    return { createGroupChat, state };
}


const useRenameGroupChat = () => {
    const { axios, state, dispatch } = useAxios();
    const renameGroupChat = async (chatId: string, name: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.put('/chat/rename-group', { chatId, name });
            dispatch({ type: 'REQUEST_SUCCESS' });
            return res.data.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch({ type: 'REQUEST_ERROR', payload: err.response?.data });
                return err.response?.data;
            } else {
                dispatch({ type: 'REQUEST_ERROR', payload: 'An unknown error occurred' });
                return 'An unknown error occurred';
            }
        }
    }
    return { renameGroupChat, state };
}


const useRenameTagline = () => {
    const { axios, state, dispatch } = useAxios();
    const renameTagline = async (chatId: string, tagline: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.put('/chat/rename-tagline', { chatId, tagline });
            dispatch({ type: 'REQUEST_SUCCESS' });
            return res.data.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch({ type: 'REQUEST_ERROR', payload: err.response?.data });
                return err.response?.data;
            } else {
                dispatch({ type: 'REQUEST_ERROR', payload: 'An unknown error occurred' });
                return 'An unknown error occurred';
            }
        }
    }
    return { renameTagline, state };
}


const useAddMemberToGroupChat = () => {
    const { axios, state, dispatch } = useAxios();
    const addMemberToGroupChat = async (chatId: string, memberId: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post('/chat/add-member', { chatId, memberId });
            dispatch({ type: 'REQUEST_SUCCESS' });
            return res.data.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch({ type: 'REQUEST_ERROR', payload: err.response?.data });
                return err.response?.data;
            } else {
                dispatch({ type: 'REQUEST_ERROR', payload: 'An unknown error occurred' });
                return 'An unknown error occurred';
            }
        }
    }
    return { addMemberToGroupChat, state };
}


const useAddMembersToGroupChat = () => {
    const { axios, state, dispatch } = useAxios();
    const addMembersToGroupChat = async (chatId: string, memberIds: string[]) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post('/chat/add-members', { chatId, memberIds });
            dispatch({ type: 'REQUEST_SUCCESS' });
            return res.data.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch({ type: 'REQUEST_ERROR', payload: err.response?.data });
                return err.response?.data;
            } else {
                dispatch({ type: 'REQUEST_ERROR', payload: 'An unknown error occurred' });
                return 'An unknown error occurred';
            }
        }
    }
    return { addMembersToGroupChat, state };
}


const useRemoveMemberFromGroupChat = () => {
    const { axios, state, dispatch } = useAxios();
    const removeMemberFromGroupChat = async (chatId: string, memberId: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.delete('/chat/remove-member', { data: { chatId, memberId } });
            dispatch({ type: 'REQUEST_SUCCESS' });
            return res.data.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch({ type: 'REQUEST_ERROR', payload: err.response?.data });
                return err.response?.data;
            } else {
                dispatch({ type: 'REQUEST_ERROR', payload: 'An unknown error occurred' });
                return 'An unknown error occurred';
            }
        }
    }
    return { removeMemberFromGroupChat, state };
}


const useLeaveGroupChat = () => {
    const { axios, state, dispatch } = useAxios();
    const leaveGroupChat = async (chatId: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.delete('/chat/leave-group', { data: { chatId } });
            dispatch({ type: 'REQUEST_SUCCESS' });
            return res.data.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch({ type: 'REQUEST_ERROR', payload: err.response?.data });
                return err.response?.data;
            } else {
                dispatch({ type: 'REQUEST_ERROR', payload: 'An unknown error occurred' });
                return 'An unknown error occurred';
            }
        }
    }
    return { leaveGroupChat, state };
}


const useGetConnectionChats = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getConnectionChats = async () => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get('/chat/get-connection-chats');
            reduxDispatch(setConnectionChats(res.data.data));
            dispatch({ type: 'REQUEST_SUCCESS' });
            return res.data.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch({ type: 'REQUEST_ERROR', payload: err.response?.data });
                return err.response?.data;
            } else {
                dispatch({ type: 'REQUEST_ERROR', payload: 'An unknown error occurred' });
                return 'An unknown error occurred';
            }
        }
    }
    return { getConnectionChats, state };
}


const useGetGroupChats = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getGroupChats = async () => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get('/chat/get-group-chats');
            reduxDispatch(setGroupChats(res.data.data))
            dispatch({ type: 'REQUEST_SUCCESS' });
            return res.data.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch({ type: 'REQUEST_ERROR', payload: err.response?.data });
                return err.response?.data;
            } else {
                dispatch({ type: 'REQUEST_ERROR', payload: 'An unknown error occurred' });
                return 'An unknown error occurred';
            }
        }
    }
    return { getGroupChats, state };
}


const useGetMessages = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getMessages = async (chatId: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get(`/chat/get-messages/${chatId}`);
            reduxDispatch(setChats({ chatId, messages: res.data.data.messages }));
            dispatch({ type: 'REQUEST_SUCCESS' });
            return res.data.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch({ type: 'REQUEST_ERROR', payload: err.response?.data });
                return err.response?.data;
            } else {
                dispatch({ type: 'REQUEST_ERROR', payload: 'An unknown error occurred' });
                return 'An unknown error occurred';
            }
        }
    }
    return { getMessages, state };
}


const useSendMessage = () => {
    const socket = useSocket();
    const sendMessage = async (message: IMessage) => {
        socket?.emit('messages', message);
    }
    return { sendMessage };
}

const useSocketMessages = () => {
    const reduxDispatch = useDispatch();
    const socket = useSocket();
    const me = useSelector((state: RootState) => state.user.me);
    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = ({ senderId, chatId, memberIds, content, createdAt }: IMessage) => {
            reduxDispatch(addMessage({ chatId, message: { senderId, chatId, memberIds, content, createdAt } }));
        };
        
        socket.on("messages", handleNewMessage);
        console.log("Socket connected: ", socket.id);

        return () => {
            socket.off("messages", handleNewMessage);
        };
    }, [socket, me.userId, reduxDispatch]);

    const chats = useSelector((state: RootState) => state.chat.chats);
    return { chats };
};


export { useCreateGroupChat, useRenameGroupChat, useRenameTagline, useAddMemberToGroupChat, useAddMembersToGroupChat, useRemoveMemberFromGroupChat, useLeaveGroupChat, useGetConnectionChats, useGetGroupChats, useGetMessages, useSendMessage, useSocketMessages };


