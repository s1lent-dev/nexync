'use client';
import { useAxios } from "@/context/helper/axios";
import { ChatType, IMessage, ITyping } from "@/types/types";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "@/context/helper/socket";
import { RootState, store } from "@/context/store";
import { useEffect } from "react";
import { addMessage, addMessages, addTyping, addUnread, removeTyping, setChats, setConnectionChats, setConnectionStatus, setGroupChats, setInfinteChats, setSelectedGroupChat, setUnread, updateMessageStatus } from "@/context/reducers/chats.reducer";



const useCreateGroupChat = () => {
    const { axios, state, dispatch } = useAxios();
    const createGroupChat = async (data: FormData) => {
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
    const addMembersToGroupChat = async (chatId: string, newMemberIds: string[], memberIds: string[] ) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post('/chat/add-members', { chatId, newMemberIds, memberIds });
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
    return { addMembersToGroupChat, state };
}


const useRemoveMemberFromGroupChat = () => {
    const { axios, state, dispatch } = useAxios();
    const removeMemberFromGroupChat = async (chatId: string, memberId: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.delete('/chat/remove-member', { data: { chatId, memberId } });
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
    return { removeMemberFromGroupChat, state };
}


const useMakeMemberAdmin = () => {
    const { axios, state, dispatch } = useAxios();
    const makeMemberAdmin = async (chatId: string, memberId: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.put('/chat/make-admin', { chatId, memberId });
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
    return { makeMemberAdmin, state };
}


const useDismissAdmin = () => {
    const { axios, state, dispatch } = useAxios();
    const dismissAdmin = async (chatId: string, memberId: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.put('/chat/dismiss-admin', { chatId, memberId });
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
    return { dismissAdmin, state };
}


const useLeaveGroupChat = () => {
    const { axios, state, dispatch } = useAxios();
    const leaveGroupChat = async (chatId: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.delete('/chat/leave-group', { data: { chatId } });
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
    return { leaveGroupChat, state };
}


const useGetConnectionChats = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getConnectionChats = async () => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get('/chat/get-connection-chats');
            reduxDispatch(setConnectionChats(res.data.data.connections));
            reduxDispatch(setUnread(res.data.data.unread));
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
            reduxDispatch(setGroupChats(res.data.data.groups));
            reduxDispatch(setUnread(res.data.data.unread));
            console.log("group chats", res.data.data.unread);
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


const useGetInfiniteScrollMessages = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getInfiniteScrollMessages = async (chatId: string, lastMessageId?: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get(`/chat/get-infinite-messages/${chatId}/${lastMessageId}`);
            reduxDispatch(setInfinteChats({ chatId, messages: res.data.data.messages }));
            console.log("infinite messages", res.data.data.messages);
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
    return { getInfiniteScrollMessages, state };
}


const useSendMessage = () => {
    const socket = useSocket();
    const sendMessage = async (message: IMessage) => {
        if (!socket) {
            console.log("Socket not available");
            return;
        }
        console.log("message sent ", message);
        if(socket) {
            socket.emit('messages', message);
        } else {
            console.log("socket not available");
        }
    }
    return { sendMessage };
}

const useReadMessage = () => {
    const socket = useSocket();
    const readMessage = async (message: { chatId: string, senderId: string, messageIds: string[], readBy: string, chatType: ChatType }) => {
        socket?.emit('message-read', message);
    }
    return { readMessage };
}

const useTypingMessage = () => {
    const socket = useSocket();
    const typingMessage = async (typing: ITyping) => {
        socket?.emit('typing', typing);
    }
    return { typingMessage };
}

const useSocketMessages = () => {
    const reduxDispatch = useDispatch();
    const socket = useSocket();
    const me = useSelector((state: RootState) => state.user.me);
    const { getGroupChats } = useGetGroupChats();

    useEffect(() => {
        if (!socket) return;

        let typingTimeout: NodeJS.Timeout;

        const handleNewMessage = ({ senderId, messageId, chatId, username, messageType, chatType, memberIds, content, status, createdAt }: IMessage) => {
            reduxDispatch(addMessage({ chatId, message: { senderId, messageId, username, messageType, chatType, chatId, memberIds, content, status, createdAt } }));
            if(me.userId !== senderId) {
                reduxDispatch(addUnread({ chatId, count: 1 }));
            }
        };

        const handleOnlineStatus = ({ userId, status }: { userId: string, status: string }) => {
            console.log("online status", userId, status);
            reduxDispatch(setConnectionStatus({ userId, status }));
        }

        const handleTyping = ({ senderId, chatId, username, memberIds }: ITyping) => {
            reduxDispatch(addTyping({ chatId, typing: { senderId, username, chatId, memberIds } }));

            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            typingTimeout = setTimeout(() => {
                reduxDispatch(removeTyping(chatId)); 
            }, 2000);
        };

        const handleGroupJoined = ({chatId, messages}: {chatId: string, messages: IMessage[]}) => {
            console.log("group joined", chatId, messages);
            reduxDispatch(addMessages({ chatId, messages }));
        }

        const handleGroupLeft = ({chatId, message}: {chatId: string, message: IMessage}) => {
            console.log("group left", chatId, message);
            reduxDispatch(addMessage({ chatId, message }));
        }

        const handleGroupRemoved = ({chatId, message}: {chatId: string, message: IMessage}) => {
            console.log("group removed", chatId, message);
            reduxDispatch(addMessage({ chatId, message }));
        }

        const handleMakeAdmin = ({chatId, memberIds, message}: {chatId: string, memberIds: string[], message: IMessage}) => {
            console.log("make admin", chatId, memberIds, message);
            reduxDispatch(addMessage({ chatId, message }));
        }

        const handleDismissAdmin = ({chatId, memberIds, message}: {chatId: string, memberIds: string[], message: IMessage}) => {
            console.log("dismiss admin", chatId, memberIds, message);
            reduxDispatch(addMessage({ chatId, message }));
        }

        const handleRefetchChats = async ({chatId, adminId}: {chatId: string, adminId: string}) => {
            console.log("refetch chats", chatId);
            await getGroupChats();
            const groups = store.getState().chat.groupChats;
            const group = groups.find(group => group.chatId === chatId);
            if (group && me.userId === adminId) {
                reduxDispatch(setSelectedGroupChat(group));
            }
        }

        const handleMessageRead = ({ chatId, senderId, messageIds }: { chatId: string, senderId: string, messageIds: string[] }) => {
            reduxDispatch(updateMessageStatus({ chatId, senderId, messageIds, status: 'READ' }));
        }

        socket.on("messages", handleNewMessage);
        socket.on("online-status", handleOnlineStatus);
        socket.on("typing", handleTyping);
        socket.on("group-joined", handleGroupJoined);
        socket.on("group-left", handleGroupLeft);
        socket.on("group-removed", handleGroupRemoved);
        socket.on("make-admin", handleMakeAdmin);
        socket.on("dismiss-admin", handleDismissAdmin);
        socket.on("refetch-chats", handleRefetchChats);
        socket.on("message-read", handleMessageRead);

        return () => {
            socket.off("messages", handleNewMessage);
            socket.off("online-status", handleOnlineStatus);
            socket.off("typing", handleTyping);
            socket.off("group-joined", handleGroupJoined);
            socket.off("group-left", handleGroupLeft);
            socket.off("group-removed", handleGroupRemoved);
            socket.off("make-admin", handleMakeAdmin);
            socket.off("dismiss-admin", handleDismissAdmin);
            socket.off("refetch-chats", handleRefetchChats);
            socket.off("message-read", handleMessageRead);
            if (typingTimeout) clearTimeout(typingTimeout);
        };
    }, [socket, me.userId, reduxDispatch]);
};


export { useCreateGroupChat, useRenameGroupChat, useRenameTagline, useAddMemberToGroupChat, useAddMembersToGroupChat, useRemoveMemberFromGroupChat, useMakeMemberAdmin, useDismissAdmin, useLeaveGroupChat, useGetConnectionChats, useGetGroupChats, useGetMessages, useGetInfiniteScrollMessages, useSendMessage, useReadMessage, useTypingMessage, useSocketMessages };


