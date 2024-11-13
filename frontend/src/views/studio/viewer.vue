<script setup lang="ts">
import { TresCanvas, useLoop, vLog } from "@tresjs/core";
import { OrbitControls } from "@tresjs/cientos";
import { onMounted, Ref, ref } from "vue";
import { useRoute } from "vue-router";
import { PerspectiveCamera } from "three";

import { useUserStore } from "../../stores/auth.ts";
import UpdateableCamera from "../../components/studio/UpdateableCamera.vue";
import { watch } from "vue";
import { updateAuthState } from "../../services/AuthService";

const userStore = useUserStore();

const route = useRoute();
console.log(route.query);
const camera: Ref<UpdateableCamera | undefined> = ref();
const root: Ref = ref<Scene | undefined>();
const socket = ref<WebSocket>();

onMounted(async () => {
  console.log(root.value.toJSON());
  socket.value = new WebSocket(
    `ws://0.0.0.0:8081/studio/socket?userId=${userStore.userId}`
  );

  console.log(camera.value);

  watch(
    () => camera.value.cameraPosition,
    () => {
      pingWebsocket();
      console.log("changed");
    },
    {
      deep: true,
    }
  );

  socket.value.addEventListener("message", (msg) => {
    console.log("got a message", msg);
    const data = JSON.parse(msg.data);

    console.log("RECIEVE", data);

    const { x, y, z } = data;
    console.log("xyz", x, y, z);
    camera.value?.camera.position.set(x, y, z);
    (camera.value?.camera as PerspectiveCamera).lookAt(0, 0, 0);
  });
});

const pingWebsocket = () => {
  console.log("ping");
  if (camera.value) {
    console.log("POS", camera.value.camera.position);

    if (socket.value && socket.value.readyState === socket.value.OPEN) {
      console.log("SEND", camera.value.camera.position);
      socket.value?.send(JSON.stringify(camera.value.camera.position));
      console.log(camera.value);
    }
  }
};
</script>

<template>
  user: {{ userStore.userId }}
  <button @click="updateAuthState">updat auth state</button>
  <button @click="pingWebsocket">update position</button>
  <div style="height: 200px; width: 200px">
    <TresCanvas
      v-log
      shadows
      clear-color="#82DBC5"
      render-mode="always"
      preset="realistic"
    >
      <TresScene ref="root">
        <OrbitControls :enableDamping="false" />
        <UpdateableCamera ref="camera" />
        <TresMesh>
          <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
          <TresMeshBasicMaterial color="orange" />
        </TresMesh>
        <TresAmbientLight :intensity="1" />
      </TresScene>
    </TresCanvas>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
