import { defineStore } from "pinia";
import { AuthState } from "@interface_types/auth.ts";
import { UserStoreState } from "@interface_types/stores";

export const useUserStore = defineStore("user", {
    state: (): UserStoreState => ({
        authorized: false,
        mail: "",
        userId: "",
    }),
    actions: {
        setAuthState(userstate: AuthState) {
            console.log(userstate);
            this.authorized = userstate.authorized;
            this.userId = userstate.id;
            if (userstate.authorized) {
                this.mail = userstate.mail;
            }
        },
    },
});
