'use client';
import { useAxios } from "@/context/helper/axios";
import { resetMe, resetSelectedUser, setMe } from "@/context/reducers/user";
import { setConnections, setFollowers, setFollowing, setConnectionRequests, resetConnections } from "@/context/reducers/connections";
import { setSearchedUsers, setSuggestedUsers } from "@/context/reducers/newConnection";
import { IRegsitrationForm, ILoginForm, IMessage } from "@/types/types";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "@/context/helper/socket";
import { RootState } from "@/context/store";
import { useEffect } from "react";
import { addMessage, resetChats, setChats, setConnectionChats } from "@/context/reducers/chats";
import { setNavigation } from "@/context/reducers/navigation";

const useCheckUsername = () => {
    const { axios, state, dispatch } = useAxios();
    const checkUsername = async (query: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post(`/auth/check-username?username=${encodeURIComponent(query)}`);
            dispatch({ type: 'REQUEST_SUCCESS' });
            console.log(res.data.message);
            return res.data.message;
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
    return { checkUsername, state };
}

const useCheckEmail = () => {
    const { axios, state, dispatch } = useAxios();
    const checkEmail = async (query: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post(`/auth/check-email?email=${encodeURIComponent(query)}`);
            dispatch({ type: 'REQUEST_SUCCESS' });
            console.log(res.data.message);
            return res.data.message;
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
    return { checkEmail, state };
}

const useVerifyEmail = () => {
    const { axios, state, dispatch } = useAxios();
    const verifyEmail = async (email: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post('/auth/verify-email', { email });
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
    return { verifyEmail, state };
}


const useRegister = () => {
    const { axios, state, dispatch } = useAxios();
    const registerUser = async (data: IRegsitrationForm, query: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post(`/auth/register?code=${encodeURIComponent(query)}`, data);
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
            reduxDispatch(resetSelectedUser());
            reduxDispatch(resetChats());
            reduxDispatch(resetConnections());
            reduxDispatch(setNavigation("chat"));
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


const useForgotPassword = () => {
    const { axios, state, dispatch } = useAxios();
    const forgotPassword = async (email: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post('/auth/forgot-password', { email });
            dispatch({ type: 'REQUEST_SUCCESS' });
            console.log(res.data);
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
    return { forgotPassword, state };
}


const useResetPassword = () => {
    const { axios, state, dispatch } = useAxios();
    const resetPassword = async (password: string, token: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post(`/auth/reset-password?token=${encodeURIComponent(token)}`, { password });
            dispatch({ type: 'REQUEST_SUCCESS' });
            console.log(res.data);
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
    return { resetPassword, state };
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


const useGetAllConnectionChats = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getAllConnectionChats = async () => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get('/chat/get-connections-chats');
            dispatch({ type: 'REQUEST_SUCCESS' });
            console.log(res.data.data);
            reduxDispatch(setConnectionChats(res.data.data.connections));
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
    return { getAllConnectionChats, state };
}


const useGetMessages = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getMessages = async (chatId: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get(`/chat/get-messages/${chatId}`);
            console.log(res.data.data.messages);
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

export { useCheckUsername, useCheckEmail, useVerifyEmail, useRegister, useLogin, useLogout, useForgotPassword, useResetPassword, useGetMe, useGetConnections, useGetConnectedUsers, useSearchUsers, useGetSuggestions, useGetConnectionRequests, useSendConnectionRequest, useAcceptConnectionRequest, useUploadAvatar, useUpdateBio, useGetAllConnectionChats, useGetMessages, useSendMessage, useSocketMessages };