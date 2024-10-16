<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { OrbitControls } from "@tresjs/cientos";
import { onMounted, Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PerspectiveCamera } from "three";

const route = useRoute();
const params = new URLSearchParams(window.location.search);
console.log(route.query);
const camera: Ref<PerspectiveCamera | undefined> = ref();
const socket = ref<WebSocket>();

const setQueryStringParameter = (name: string, value: string) => {
  params.set(name, value);
  window.history.replaceState(
    {},
    "",
    decodeURIComponent(`${window.location.pathname}?${params}`)
  );
};

onMounted(async () => {
  socket.value = new WebSocket(
    `ws://0.0.0.0:8080?userId=${params.get("userId")}`
  );

  socket.value.addEventListener("message", (msg) => {
    console.log("got a message", msg);
    const data = JSON.parse(msg.data);

    if (data.userId) {
      setQueryStringParameter("userId", data.userId);
    } else if (camera.value) {
      const { x, y, z } = data;
      camera.value.position.set(x, y, z);
    }
  });
});

const pingWebsocket = () => {
  if (camera.value) {
    console.log("POS", camera.value.position);

    socket.value?.send(JSON.stringify(camera.value.position));
    console.log(camera.value);
  }
};
</script>

<template>
  <button @click="pingWebsocket">update position</button>
  <div style="height: 200px; width: 200px">
    <TresCanvas shadows clear-color="#82DBC5" preset="realistic">
      <OrbitControls />
      <TresPerspectiveCamera
        ref="camera"
        :position="[3, 3, 3]"
        :look-at="[0, 0, 0]"
      />
      <TresMesh>
        <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
      <TresAmbientLight :intensity="1" />
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
