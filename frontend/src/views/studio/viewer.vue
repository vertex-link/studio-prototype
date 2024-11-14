<script setup lang="ts">
import {TresCanvas, useRaycaster, vLog} from "@tresjs/core";
import { TransformControls } from "@tresjs/cientos";
import {onMounted, Ref, ref, shallowRef} from "vue";
import { useRoute } from "vue-router";
import {PerspectiveCamera, Scene} from "three";

import { useUserStore } from "../../stores/auth.ts";
import UpdateableCamera from "../../components/studio/UpdateableCamera.vue";
import { watch } from "vue";
import { updateAuthState } from "../../services/AuthService";
import {Raycaster} from "three";

const userStore = useUserStore();

const route = useRoute();
console.log(route.query);
const camera: Ref<typeof UpdateableCamera | undefined> = ref();
const root: Ref = ref<Scene | undefined>();
const group: Ref = ref<Scene | undefined>();
const socket = ref<WebSocket>();

const mesh = shallowRef();
const mesh_two = shallowRef();

const locked = ref<boolean>(false);

const selectedObject = ref(null)
const raycaster = new Raycaster();

const handleClick = (event) => {  
  // Berechne normalisierte Gerätekoordinaten
  const bounds = event.target.getBoundingClientRect()
  const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
  const y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1

  // Aktualisiere Raycaster
  raycaster.setFromCamera({ x, y }, camera.value.camera)

  // Prüfe Schnittpunkte
  const intersections = raycaster.intersectObjects(group.value.children, true)

  if (intersections.length > 0) {
    // Wähle das erste getroffene Objekt
    selectedObject.value = intersections[0].object

    // Optional: Markiere das ausgewählte Objekt (z.B. durch Farbe)
    if (selectedObject.value.material) {
      // Speichere die ursprüngliche Farbe
      if (!selectedObject.value.userData.originalColor) {
        selectedObject.value.userData.originalColor = selectedObject.value.material.color.clone()
      }
      // Ändere die Farbe des ausgewählten Objekts
      selectedObject.value.material.color.set('#ff0000')
    }
  } else {
    // Wenn kein Objekt getroffen wurde, setze die Auswahl zurück
    if (selectedObject.value?.material) {
      // Stelle die ursprüngliche Farbe wieder her
      selectedObject.value.material.color.copy(selectedObject.value.userData.originalColor)
    }
    selectedObject.value = null
  }
}


onMounted(async () => {
  console.log(root.value.toJSON());
  socket.value = new WebSocket(
    `ws://0.0.0.0:8081/studio/socket?userId=${userStore.userId}`
  );

  watch(
    () => camera.value?.cameraPosition,
    () => {
      pingWebsocket();
      console.log("changed");
      locked.value = false;
    },
    {
      deep: true,
    }
  );

  socket.value.addEventListener("message", (msg) => {
    locked.value = true;
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
  if (camera.value && !locked.value) {
    if (socket.value && socket.value.readyState === socket.value.OPEN) {
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
  <div style="height: 700px; width: 700px" @click="handleClick" >
    <TresCanvas
        v-log
      shadows
      clear-color="#82DBC5"
      render-mode="always"
      preset="realistic"
    >
      <TresScene ref="root">
        <UpdateableCamera ref="camera" />
        <TransformControls :object="selectedObject" v-if="selectedObject" />
        <TresGroup ref="group">
          <TresMesh ref="mesh" >
            <TresTorusGeometry :args="[.5, 0.25, 8, 16]" />
            <TresMeshBasicMaterial color="orange" />
          </TresMesh>
          <TresMesh ref="mesh_two" :position="[1,0,0]" >
            <TresTorusGeometry :args="[.5, 0.25, 8, 16]" />
            <TresMeshBasicMaterial color="orange" />
          </TresMesh>
        </TresGroup>
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
