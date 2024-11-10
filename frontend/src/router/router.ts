import {createRouter, createWebHistory} from "vue-router";
import {mapRoutes, ROUTES} from "./routes.ts";
console.log(mapRoutes(ROUTES))
export const router = createRouter({
    history: createWebHistory(),
    routes: mapRoutes(ROUTES),
});
