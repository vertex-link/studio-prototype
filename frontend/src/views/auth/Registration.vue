<template>
  <h1>signup</h1>
  <template v-if="!isLoading">
    <br />
    <input type="textarea" name="Token" id="token" v-model="token" />
    <br />
    mail
    <input label-text="E-Mail" type="text" v-model="mail" disabled />

    usernam
    <input label="username" type="text" v-model="username" />
    <div>usernameAvail: {{ usernameAvailable }}</div>
    password
    <input
      label-text="password"
      type="password"
      name="password"
      v-model="password"
    />
    <input
      label-text="Repeat password"
      type="password"
      name="password_repeat"
      v-model="password_repeat"
    />

    <div v-if="!pwIsValid">Passwords arent equal</div>

    <button :disabled="!pwIsValid" @click="register">signup</button>
  </template>
  <div v-else class="loading">loading</div>
  <div v-if="error" class="err">
    <p>
      Something went wrong – could not create user – probably because user is
      already registered, please try to login
    </p>
    <button appearance="lean" @click="() => router.push({ name: 'Login' })">
      to login
    </button>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  isUsernameAvailable,
  loginUser,
  signupUser,
} from "../../services/AuthService";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();
const token = ref<string>(route.query.token as string);
const mail = ref(route.query.mail as string);

const password = ref<string>("");
const password_repeat = ref<string>("");
const username = ref<string>("");
const usernameAvailable = ref<boolean>(false);

watch(username, async (change) => {
  if (username.value.length > 3) {
    usernameAvailable.value = await isUsernameAvailable(change);
  } else {
    usernameAvailable.value = false;
  }
});

const pwIsValid = computed(() => {
  let isValid = false;

  if (password.value?.length > 3) {
    if (password.value === password_repeat.value) {
      isValid = true;
    }
  }

  return isValid;
});

const isLoading = ref<boolean>(false);
const error = ref<boolean>(false);

const register = async () => {
  isLoading.value = true;
  // TODO: check if token is really need with use of sessions
  try {
    const user = {
      password: password.value,
      password_repeat: password_repeat.value,
      mail: mail.value,
      token: token.value,
      username: username.value,
    };
    const response = await signupUser(user);
    if (response.status === 201) {
      await loginUser(user);
      router.push({ name: "Login" });
    } else throw Error;
  } catch (err) {
    console.log(err);
    error.value = true;
  }
  isLoading.value = false;
};
</script>
