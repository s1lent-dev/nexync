'use client';
import { useAxios } from "@/context/helper/axios";
import { resetUser, setSearchedUsers, setUser } from "@/context/reducers/user";
import { IRegsitrationForm, ILoginForm } from "@/types/types";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";


const useRegister = () => {
    const { axios, state, dispatch } = useAxios();
    const registerUser = async (data: IRegsitrationForm) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post('/auth/register', data);
            dispatch({ type: 'REQUEST_SUCCESS'});
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
            dispatch({ type: 'REQUEST_SUCCESS'});
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
            dispatch({ type: 'REQUEST_SUCCESS'});
            reduxDispatch(resetUser());
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
            dispatch({ type: 'REQUEST_SUCCESS'});
            reduxDispatch(setUser(res.data.data));
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


const useSearchUsers = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const searchUsers = async (query: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            console.log(query);
            const res = await axios.post(`/user/search?search=${encodeURIComponent(query)}`);
            dispatch({ type: 'REQUEST_SUCCESS'});
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


const useSendConnectionRequest = () => {
    const { axios, state, dispatch } = useAxios();
    const sendConnectionRequest = async (userId: string) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.post(`/user/send-request/${userId}`);
            dispatch({ type: 'REQUEST_SUCCESS'});
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

const useUploadAvatar = () => {
    const { axios, state, dispatch } = useAxios();
    const uploadAvatar = async (data: FormData) => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.put('/user/upload-avatar', data);
            dispatch({ type: 'REQUEST_SUCCESS'});
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
export { useRegister, useLogin, useLogout, useGetMe , useSearchUsers, useSendConnectionRequest, useUploadAvatar };