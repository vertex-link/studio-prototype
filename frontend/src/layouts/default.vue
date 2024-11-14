<script setup lang="ts">
import {logoutUser} from "../services/AuthService.ts";
import {router} from "../router/router.ts";
import {useUserStore} from "../stores/auth.ts";

const userState = useUserStore();

const logout = async () => {
  await logoutUser();
  router.push("/");
}

</script>
<template>
  <button v-if="userState.authorized" @click="logout">logout</button>
  <slot></slot>
</template>

<style scoped></style>
