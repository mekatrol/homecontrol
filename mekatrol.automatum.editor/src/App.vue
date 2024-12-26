<template>
  <AppControl />

  <dialog
    id="favDialog"
    :open="showDialog"
  >
    <form>
      <p>
        <label>
          Favourite animal:
          <select>
            <option value="default">Choose…</option>
            <option>Brine shrimp</option>
            <option>Red panda</option>
            <option>Spider monkey</option>
          </select>
        </label>
      </p>
      <div>
        <button
          value="cancel"
          formmethod="dialog"
        >
          Cancel
        </button>
        <button
          id="confirmBtn"
          value="default"
        >
          Confirm
        </button>
      </div>
    </form>
  </dialog>
  <p>
    <button
      @click="showDialog = true"
      id="showDialog"
    >
      Show the dialog
    </button>
  </p>
  <output></output>
</template>

<script setup lang="ts">
import AppControl from '@/flow/components/AppControl.vue';
import { ref } from 'vue';

const showDialog = ref(false);
</script>

<style lang="css">
dialog {
  animation: fade-out 0.7s ease-out;
}

dialog[open] {
  animation: fade-in 0.7s ease-out;
}

dialog[open]::backdrop {
  animation: backdrop-fade-in 0.7s ease-out forwards;
}

/* Animation keyframes */

@keyframes fade-in {
  0% {
    opacity: 0;
    display: none;
  }

  100% {
    opacity: 1;
    display: block;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
    display: block;
  }

  100% {
    opacity: 0;
    display: none;
  }
}

@keyframes backdrop-fade-in {
  0% {
    background-color: rgb(0 0 0 / 0%);
  }

  100% {
    background-color: rgb(0 0 0 / 25%);
  }
}

body,
button {
  font-family: system-ui;
}
</style>
