import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import {router} from "./router/router.ts";
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App)
    .use(pinia)
    .use(router);

router.isReady().then(() => app.mount("#app"));
