'use client';

// Imports
import { useAxios } from "@/context/helper/axios";
import { setMe } from "@/context/reducers/user";
import { setFollowers, setFollowing, setConnectionRequests, setConnections } from "@/context/reducers/connections";
import { setSearchedUsers, setSuggestedUsers } from "@/context/reducers/newConnection";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";


//!Hooks

// useGetMe hook
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


// useGetConnections hook
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

const useGetAllConnections = () => {
    const { axios, state, dispatch } = useAxios();
    const reduxDispatch = useDispatch();
    const getAllConnections = async () => {
        dispatch({ type: 'REQUEST_START' });
        try {
            const res = await axios.get('/user/connections');
            dispatch({ type: 'REQUEST_SUCCESS' });
            reduxDispatch(setConnections(res.data.data));
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
    return { getAllConnections, state };
}


// useSearchUsers hook
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


// useGetSuggestions hook
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


// useGetConnectionRequests hook
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


// useSendConnectionRequest hook
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


// useAcceptConnectionRequest hook
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


// useUploadAvatar hook
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


// useUpdateBio hook
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


// Exports
export { useGetMe, useGetConnections, useGetAllConnections, useSearchUsers, useGetSuggestions, useGetConnectionRequests, useSendConnectionRequest, useAcceptConnectionRequest, useUploadAvatar, useUpdateBio };