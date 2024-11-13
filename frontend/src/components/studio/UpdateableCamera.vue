<template>
  <TresPerspectiveCamera
    ref="camera"
    :position="[3, 3, 3]"
    :look-at="[0, 0, 0]"
  />
</template>
<script lang="ts" setup>
import { useLoop } from "@tresjs/core";
import { PerspectiveCamera, Vector3 } from "three";
import { ref, shallowRef } from "vue";
import { ShallowRef } from "vue";
const camera: ShallowRef<PerspectiveCamera | undefined> = shallowRef();

const { onBeforeRender, onAfterRender } = useLoop();
let cameraPosition = ref(new Vector3(3.0, 3.0, 3.0));
let currentCameraPosition = new Vector3(3.0, 3.0, 3.0);

const equals = (v: Vector3, v_two: Vector3, epsilon = Number.EPSILON) => {
  //   console.log("v", v);
  //   console.log(v_two);
  //   console.log("sdfsdfsdf", v.x, v_two.x);
  const x = Math.abs(v.x - v_two.x) < epsilon;
  const y = Math.abs(v.y - v_two.y) < epsilon;
  const z = Math.abs(v.z - v_two.z) < epsilon;
  //   console.log(x, y, z);
  return x && y && z;
};

onBeforeRender(({ renderer }) => {
  currentCameraPosition.set(
    camera.value.position.x,
    camera.value.position.y,
    camera.value.position.z
  );

  if (!camera.value) return;

  //   debugger;

  //   console.log(cameraPosition.equals(camera.value.position));

  if (!equals(currentCameraPosition, cameraPosition.value)) {
    cameraPosition.value.set(
      currentCameraPosition.x,
      currentCameraPosition.y,
      currentCameraPosition.z
    );
  }
});

onAfterRender(() => {});

defineExpose({ camera, cameraPosition });
</script>
