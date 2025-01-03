<template>
  <Teleport
    to="body"
    v-if="show"
  >
    <div :class="`dialog-container ${show ? 'show' : ''}`">
      <dialog
        class="app-dialog"
        :open="show"
      >
        <form>
          <div class="content">
            <slot></slot>
          </div>
          <div class="action-bar">
            <button
              value="default"
              @click.prevent="emit('confirm')"
            >
              OK
            </button>
            <button
              value="cancel"
              formmethod="dialog"
              @click="emit('cancel')"
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<style scoped lang="css">
.dialog-container {
  /* Fill parent (overlay siblings) */
  position: absolute;

  /* Hidden by default */
  display: none;

  /* Full width (cover the whole page) */
  width: 100%;

  /* Full height (cover the whole page) */
  height: 100%;

  /* Pin to each corner */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &.show {
    display: revert;
  }
}

dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  min-width: var(--dialog-width, 80%);
  max-width: var(--dialog-width, 80%);
  max-height: var(--dialog-height, 90%);
  transform: translate(-50%, -50%);
  display: flex;

  animation: fade-out 0.7s ease-out;
}

dialog[open] {
  animation: fade-in 0.7s ease-out;
}

dialog[open]::backdrop {
  animation: backdrop-fade-in 0.7s ease-out forwards;
}

form {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  min-width: 100%;
  gap: 0;

  > div.content {
    padding: 0.3rem;
    margin-bottom: auto;
  }

  > div.action-bar {
    padding: 0.3rem;
    display: flex;
    gap: 1rem;
    background-color: transparent;

    > button {
      padding-inline: 0.5rem;
    }
  }
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
</style>
