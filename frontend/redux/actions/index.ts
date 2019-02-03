import { ICreateUser, ILoginUser } from '../../@types';
import { api } from '../../utils';
import { ActionCreator, AnyAction, Dispatch } from 'redux';

// Helper functions
export const getToken = () => {
	return '';
};
// getStorage().getItem('token');
const makeDispatcher = (type: string, ...argNames: string[]): ActionCreator<AnyAction> => (
	...args: any[]
) => {
	const action = { type };
	argNames.forEach((arg, index) => {
		action[argNames[index]] = args[index];
	});
	return action;
};

// Actions
export const AUTH_USER_SET = 'AUTH_USER_SET';
export const AUTH_TOKEN_SET = 'AUTH_TOKEN_SET';

export const FLASH_GREEN_SET = 'FLASH_GREEN_SET';
export const FLASH_RED_SET = 'FLASH_RED_SET';

// Dispatchers
const setUser = makeDispatcher(AUTH_USER_SET, 'user');
const setToken = makeDispatcher(AUTH_TOKEN_SET, 'token');

const setGreenFlash = makeDispatcher(FLASH_GREEN_SET, 'msgGreen');
const setRedFlash = makeDispatcher(FLASH_RED_SET, 'msgRed');

// Creators
export const signup = (body: ICreateUser) => async (dispatch: Dispatch) => {
	try {
		const {
			data: { response }
		} = await api.post('/auth/signup', body);
		dispatch(setToken(response.token));
		dispatch(setUser(response.user));
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const signin = (body: ILoginUser) => async (dispatch: Dispatch) => {
	try {
		const {
			data: { response }
		} = await api.post('/auth/login', body);
		dispatch(setToken(response.token));
		dispatch(setUser(response.user));
		return response;
	} catch (error) {
		if (error.response) throw error.response.data;
		else throw error;
	}
};

export const signOut = () => async (dispatch: Dispatch) => {
	try {
		dispatch(setToken(null));
		dispatch(setUser(null));
	} catch (error) {
		throw error;
	}
};

export const forgotPassword = async (email: string) => {
	try {
		const {
			data: { response }
		} = await api.post('/api/auth/forgot', { email });
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const resetPassword = async (password, passwordConfirm, token) => {
	try {
		const {
			data: { response }
		} = await api.post('/api/auth/reset', {
			password,
			passwordConfirm,
			token
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const sendFlashMessage = (msg, type = 'red') => (dispatch: Dispatch) => {
	type === 'red' ? dispatch(setRedFlash(msg)) : dispatch(setGreenFlash(msg));
};

export const clearFlashMessages = () => (dispatch: Dispatch) => {
	dispatch(setGreenFlash(''));
	dispatch(setRedFlash(''));
};

export const fetchUsers = async params => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await api.get('/api/users', {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const fetchUser = async (id, params) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await api.get(`/api/users/${id}`, {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const refreshToken = params => async (dispatch: Dispatch) => {
	try {
		const token = getToken();
		if (!token) {
			dispatch(setUser(null));
			dispatch(setToken(null));
			return null;
		}
		const {
			data: { response }
		} = await api.get('/api/auth/refresh', {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		dispatch(setUser(response.user));
		dispatch(setToken(response.token));
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const storageChanged = e => dispatch => {
	const token = getToken();
	if (!token) signOut()(dispatch);
	else dispatch(setToken(token));
};
