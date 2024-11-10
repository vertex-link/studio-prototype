import {defineStore} from "pinia";
import {AuthState} from "../../interface_types/auth";
import {UserStoreState} from "../../interface_types/stores";

export const useUserStore = defineStore('user', {
    state: (): UserStoreState => ({
        authorized: false,
        mail: '',
    }),
    actions: {
        setAuthState(userstate: AuthState) {
            console.log(userstate);
            this.authorized = userstate.authorized;
            if (userstate.authorized) {
                this.mail = userstate.mail;
            }
        },
    },
});
