<template>
  <main>
    <component :is="layout">
      <router-view :key="route.fullPath" />
    </component>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const layout = computed(() => {
  if (route.matched.length === 0) {
    console.error("this path does not have a layout defined");
    return;
  }

  return route.matched[0].components?.layout;
});
</script>