'use client';
import { useAxios } from "@/context/helper/axios";
import { resetMe, setMe } from "@/context/reducers/user";
import { setConnections, setFollowers, setFollowing, setConnectionRequests } from "@/context/reducers/connections";
import { setSearchedUsers, setSuggestedUsers } from "@/context/reducers/newConnection";
import { IRegsitrationForm, ILoginForm, IMessage } from "@/types/types";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "@/context/helper/socket";
import { RootState } from "@/context/store";
import { useEffect } from "react";
import { addMessage, setChats } from "@/context/reducers/chats";


const useRegister = () => {
    const { axios, state, dispatch } = useAxios();
    const registerUser = async (data: IRegsitrationForm) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post('/auth/register', data);
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
    return { registerUser, state };
}

const useLogin = () => {
    const { axios, state, dispatch } = useAxios();
    const loginUser = async (data: ILoginForm) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post('/auth/login', data);
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
    return { loginUser, state };
}

const useLogout = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const logout = async () => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get('/auth/logout');
            dispatch({ type: 'REQUEST_SUCCESS' });
            reduxDispatch(resetMe());
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
    return { logout, state };
}

const useGetMe = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getMe = async () => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get('/user/me');
            dispatch({ type: 'REQUEST_SUCCESS' });
            reduxDispatch(setMe(res.data.data));
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
    return { getMe, state };
}


const useGetConnections = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getConnections = async () => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get('/user/get-connections');
            dispatch({ type: 'REQUEST_SUCCESS' });
            console.log(res.data.data);
            const followers = res.data.data.followersData;
            const following = res.data.data.followingData;
            reduxDispatch(setFollowers(followers));
            reduxDispatch(setFollowing(following));
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
    return { getConnections, state };
}


const useGetConnectedUsers = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getConnectedUsers = async () => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get('/user/get-connected-users');
            dispatch({ type: 'REQUEST_SUCCESS' });
            console.log(res.data.data.connections);
            reduxDispatch(setConnections(res.data.data.connections));
            return res.data.data.connections;
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
    return { getConnectedUsers, state };
}


const useSearchUsers = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const searchUsers = async (query: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            console.log(query);
            const res = await axios.post(`/user/search?search=${encodeURIComponent(query)}`);
            dispatch({ type: 'REQUEST_SUCCESS' });
            console.log(res.data.data);
            reduxDispatch(setSearchedUsers(res.data.data));
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
    return { searchUsers, state };
}

const useGetSuggestions = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getSuggestions = async () => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get('/user/get-suggestions');
            dispatch({ type: 'REQUEST_SUCCESS' });
            console.log(res.data.data);
            reduxDispatch(setSuggestedUsers(res.data.data));
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
    return { getSuggestions, state };
}


const useGetConnectionRequests = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getConnectionRequests = async () => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get('/user/get-requests');
            dispatch({ type: 'REQUEST_SUCCESS' });
            const requests = res.data.data;
            reduxDispatch(setConnectionRequests(requests));
            console.log(res.data.data);
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
    return { getConnectionRequests, state };
}


const useSendConnectionRequest = () => {
    const { axios, state, dispatch } = useAxios();
    const sendConnectionRequest = async (userId: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post(`/user/send-request/${userId}`);
            dispatch({ type: 'REQUEST_SUCCESS' });
            console.log(res.data.data);
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
    return { sendConnectionRequest, state };
}

const useAcceptConnectionRequest = () => {
    const { axios, state, dispatch } = useAxios();
    const acceptConnectionRequest = async (userId: string, status: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post(`/user/accept-request/${userId}/${status}`);
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
    return { acceptConnectionRequest, state };
}

const useUploadAvatar = () => {
    const { axios, state, dispatch } = useAxios();
    const uploadAvatar = async (data: FormData) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.put('/user/upload-avatar', data);
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
    return { uploadAvatar, state };
}


const useUpdateBio = () => {
    const { axios, state, dispatch } = useAxios();
    const updateBio = async (bio: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.put('/user/update-bio', { bio });
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
    return { updateBio, state };
}


const useGetChats = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getChats = async (userId: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get(`/chat/get-chats/${userId}`);
            console.log(res.data.data.messages);
            reduxDispatch(setChats({ userId, messages: res.data.data.messages }));
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
    return { getChats, state };
}


// Sockets

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
        const handleNewMessage = ({ senderId, memberIds, content, createdAt }: IMessage) => {
            const userKey = me.userId === memberIds[0] ? memberIds[1] : memberIds[0];
            reduxDispatch(addMessage({ userId: userKey, message: { senderId, memberIds, content, createdAt } }));
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

export { useRegister, useLogin, useLogout, useGetMe, useGetConnections, useGetConnectedUsers, useSearchUsers, useGetSuggestions, useGetConnectionRequests, useSendConnectionRequest, useAcceptConnectionRequest, useUploadAvatar, useUpdateBio, useGetChats, useSendMessage, useSocketMessages };