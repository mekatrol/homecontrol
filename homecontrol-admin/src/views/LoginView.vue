<template>
  <main class="main-body">
    <form @submit.prevent="tryLogin">
      <div class="header">
        <div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="64px"
              viewBox="0 -960 960 960"
              width="64px"
              fill="#e8eaed"
            >
              <path
                d="M600-120v-120H440v-400h-80v120H80v-320h280v120h240v-120h280v320H600v-120h-80v320h80v-120h280v320H600ZM160-760v160-160Zm520 400v160-160Zm0-400v160-160Zm0 160h120v-160H680v160Zm0 400h120v-160H680v160ZM160-600h120v-160H160v160Z"
              />
            </svg>
          </div>
          <div>
            <p role="status">Mekatrol automation control system admin site.</p>
          </div>
        </div>
        <div
          v-if="loginError"
          class="login-error"
        >
          <p>{{ loginError }}</p>
        </div>
      </div>
      <div class="section">
        <label
          class="label"
          for="user-name"
          ><p>Username</p>
          <input
            type="text"
            placeholder="Enter Username"
            name="user-name"
            required
            v-model="userName"
          />
        </label>
        <label
          class="label"
          for="password"
          ><p>Password</p>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            required
            v-model="password"
        /></label>
        <button type="submit">Login</button>
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="true"
            name="remember"
            v-model="rememberMe"
          />
          <span class="checkmark"></span>
          <p>Remember me</p>
        </label>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLogin } from '@/composables/login';

const { login } = useLogin();

const userName = ref('');
const password = ref('');
const rememberMe = ref(true);
const loginError = ref<string | undefined>(undefined);

const tryLogin = async (): Promise<void> => {
  loginError.value = undefined;
  const success = await login(userName.value, password.value, rememberMe.value);

  if (!success) {
    loginError.value = 'Login failed. Incorrect username or password.';
  }
};
</script>

<style scoped lang="css">
/* Add padding to containers */
.header,
.section {
  padding: 16px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  .login-error {
    background-color: var(--clr-primary-text);
    color: var(--clr-danger);
    padding: 5px 10px;
    border-radius: var(--corner-radius);
  }

  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;

    & image {
      width: 64px;
    }

    & p {
      font-size: 1.5rem;
    }
  }
}

input {
  min-width: 800px;
}
</style>
