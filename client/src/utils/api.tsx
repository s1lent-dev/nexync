'use client';
import { useAxios } from "@/context/helper/axios";
import { IRegsitrationForm, ILoginForm } from "@/types/types";
import { AxiosError } from "axios";


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

export { useRegister, useLogin };