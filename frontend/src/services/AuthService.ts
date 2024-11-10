import {User, UserLogin} from "../../../backend/src/types/user.ts";
import {AuthState} from "../../../interface_types/auth.ts";
import {useUserStore} from "../stores/auth.ts";

// const userStore = useUserStore();

export const serverURI: string = import.meta.env.VITE_API_ENDPOINT || '';

export const getData = async (uri: string): Promise<Response> => {
    try {
        console.log(serverURI);
        const response = await fetch(serverURI + uri, {
            credentials: 'include',
        }).then((res) => res.json());

        return Promise.resolve(response);
    } catch (e) {
        console.error('Failed with Error:', e);
        return Promise.reject();
    }
};

export const postData = async (uri: string, payload: unknown) => {
    console.log(serverURI);
    return await fetch(serverURI + uri, {
        method: 'POST',
        body: JSON.stringify(payload) as BodyInit,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const getUser = async () => {
    const response = await getData('users');
    if (!response) return;
    return response;
};

export const updateAuthState = async (): Promise<AuthState> => {
    try {
        const response = await getData('authstate');

        useUserStore().setAuthState(response as unknown as AuthState);

        return Promise.resolve(response as unknown as AuthState);
    } catch (err) {
        console.log('ERROR ON GET DATA', err);
        return Promise.resolve({ authorized: false, mail: '' });
    }
};

export const isUsernameAvailable = async (name: string): Promise<boolean> => {
    try {
        const response = await getData(`user/name-available/${name}`);
        return Promise.resolve(response as unknown as boolean);
    } catch (err) {
        console.log('ERROR ON GET DATA', err);
        return Promise.resolve(false);
    }
};

export const loginUser = async (data: UserLogin) => {
    return postData('login', data);
};

export const logoutUser = async () => {
    await postData('logout', {});
};

export const inviteUser = async (mail: string, iss: string) => {
    const resp = await postData('invite', { mail, iss });
    return resp;
};

export const signupUser = async (data: User) => {
    return postData('registration', data);
};
