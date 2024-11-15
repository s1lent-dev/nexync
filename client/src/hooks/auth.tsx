'use client';

// Imports
import { useAxios } from "@/context/helper/axios";
import { resetMe, resetSelectedUser } from "@/context/reducers/user";
import { IRegsitrationForm, ILoginForm } from "@/types/types";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { resetChats } from "@/context/reducers/chats";
import { setNavigation } from "@/context/reducers/navigation";


//!Hooks

// useCheckUsername hook
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


// useCheckEmail hook
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


// useVerifyEmail hook
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

// useRegister hook
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


// useLogin hook
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


// useLogout hook
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
            reduxDispatch(setNavigation("chats"));
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


// useForgotPassword hook
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


// useResetPassword hook
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


// Exports
export { useCheckUsername, useCheckEmail, useVerifyEmail, useRegister, useLogin, useLogout, useForgotPassword, useResetPassword };