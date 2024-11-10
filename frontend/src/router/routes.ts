import {RouteRecord, RouteRecordRaw} from "vue-router";
import Login from "../views/auth/Login.vue";
import Registration from "../views/auth/Registration.vue";
import {mapRoutes} from "./router.ts";
import {AuthState} from "../../../interface_types/auth.ts";
import Invite from "../views/auth/Invite.vue";
import Default from "../layouts/default.vue";
import {updateAuthState} from "../services/AuthService.ts";

const isLoggedIn = async (to: any, from: any, next: any) => {
    let authState = await updateAuthState();
    // if (!authState) return;

    authState = authState as AuthState;

    if (authState.authorized && to.name === ROUTES.login.name) {
        next(ROUTES.int);
    } else if (!authState.authorized && to.name === ROUTES.login.name) {
        next();
    } else if (authState.authorized) {
        next();
    } else {
        next(ROUTES.login);
    }

    return false;
};

export const mapRoutes = (routes: Routes) => {
    return Object.entries(routes).map<RouteRecordRaw>((route) => route[1]);
};

export type Routes = {
    [key: string]: RouteRecord;
};

const IisLoggedIn = isLoggedIn;


export const ROUTES_INT: Routes = {
    /*dashboard: {
        path: 'dashboard',
        name: 'UserDashboard',
        component: () => import('@views/UserDashboard.vue'),
    },
    settings: {
        path: 'settings',
        name: 'UserSettings',
        component: () => import('@views/UserSettings.vue'),
    },*/
    invite: {
        path: 'Invite',
        name: 'Invite',
        components: {
            default: Invite,
            layout: Default,
        },
    }
};


const ROUTES: Routes = {};

ROUTES.int = {
    path: '/int',
    name: 'InternalArea',
    redirect() {
        return ROUTES_INT.dashboard;
    },
    beforeEnter: [isLoggedIn],
    children: mapRoutes(ROUTES_INT),
};

ROUTES.login = {
    path: '/login',
    name: 'Login',
    components: {
        default: Login,
        layout: Default,
    },
    beforeEnter: [isLoggedIn],
};

ROUTES.registration = {
    path: '/registration',
    name: 'Registration',
    components: {
        default: Registration,
        layout: () => Default,
    },
};

ROUTES.home = {
    path: '/:pathMatch(.*)',
    redirect: ROUTES.login,
    components: {
        default: Login,
        layout: Default,
    },
};

export { ROUTES };