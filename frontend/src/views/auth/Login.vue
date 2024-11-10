<template>
  Login
  <div>
    <form @submit.prevent="submitLogin">
      <input id="username" v-model="userMail" placeholder="username">
      <input id="password" v-model="userPassword" type="password" placeholder="password">
      <button id="login" type="submit">Login</button>
    </form>
  </div>
</template>
<script lang="ts" setup>
import {useRouter} from "vue-router";
import {loginUser, updateAuthState} from "../../services/AuthService.ts";
import {onMounted, ref} from "vue";
import {AuthState} from "../../../../interface_types/auth.ts";

const router = useRouter();

const authState = ref<AuthState>({ authorized: false });
const userPassword = ref("");
const userMail = ref("");

onMounted(async () => {
  await setAuthState();
});
const setAuthState = async () => {
  authState.value = await updateAuthState();
};

const submitLogin = async () => {
  if (!(userMail.value && userPassword.value)) return;

  try {
    await loginUser({
      password: userPassword.value,
      mail: userMail.value,
    });
    await setAuthState();

    await router.push({name: 'Invite'});
  } catch (error) {
    console.error('login error:', error);
  }
};

</script>