<template>
  <div
    v-if="point"
    class="form-container"
  >
    <div class="form-group">
      <label for="interval">Key</label>
      <input
        v-model="point.key"
        placeholder=""
        type="text"
        id="interval"
        :readonly="validations.point.key.readonly"
        :required="validations.point.key.required"
        :minlength="validations.point.key.minLength"
        :maxlength="validations.point.key.maxLength"
      />
      <p
        v-if="keyValidation"
        class="validation-error"
      >
        {{ keyValidation }}
      </p>
    </div>
    <div class="form-group">
      <label for="name">Friendly Name</label>
      <input
        v-model="point.name"
        placeholder="<enter point name>"
        type="text"
        id="name"
        :readonly="validations.point.name.readonly"
        :required="validations.point.name.required"
        :minlength="validations.point.name.minLength"
        :maxlength="validations.point.name.maxLength"
      />
      <p
        v-if="nameValidation"
        class="validation-error"
      >
        {{ nameValidation }}
      </p>
    </div>
    <div class="form-group">
      <label for="description">Description</label>
      <input
        v-model="point.description"
        type="text"
        id="description"
        :readonly="validations.point.description.readonly"
        :required="validations.point.description.required"
        :minlength="validations.point.description.minLength"
        :maxlength="validations.point.description.maxLength"
      />
    </div>
    <div class="form-group inline">
      <label>
        <input
          type="checkbox"
          name="enabled"
          id="enabled"
          value="value"
          v-model="point.enabled"
        />
        <span>Enabled</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { validations } from '@/validation/validation-definitions';
import type { ValidationResult } from '@/validation/validation-helpers';
import { computed } from 'vue';
import { usePointStore } from '@/stores/point-store';

interface Props {
  pointId: string;
  validation: ValidationResult[];
}

const pointStore = usePointStore();

const props = defineProps<Props>();

const nameValidation = computed(() => {
  return props.validation.find((v) => v.field === 'name')?.message;
});

const keyValidation = computed(() => {
  return props.validation.find((v) => v.field === 'key')?.message;
});

const point = computed(() => {
  const p = pointStore.getPoint(props.pointId);
  return p.value;
});
</script>

<style scoped lang="css">
:root {
  --clr-success: hsl(143, 100%, 26%);
  --clr-warning: hsl(43, 100%, 66%);
  --clr-error: hsl(348, 55%, 49%);
}

form {
  display: grid;
  gap: 1rem;
  max-width: 45ch;
}

.form-group {
  display: grid;
  gap: 0.5rem;
  padding-inline: 1rem;
}

.form-group.inline {
  label {
    display: flex;
    flex-direction: row;
    align-items: center;
    align-content: center;
    gap: 0.5rem;
  }
}

label {
  font-size: 1rem;
}

input {
  font: inherit;
}

input {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 0;
  background-color: hsl(201, 31%, 11%);
}

input[type='checkbox'] {
  float: left;
}

input:not([type='checkbox']) {
  outline: 3px solid hsl(203, 30%, 26%);
}

.validation-success,
input:not([type='checkbox']):not(:placeholder-shown):user-valid {
  outline-color: var(--clr-success);
}

p.validation-error {
  color: var(--clr-error);
}

.validation-error,
input:not([type='checkbox']):user-invalid {
  outline-color: var(--clr-error);
}

.validation-warning,
input:not([type='checkbox']):focus:invalid {
  outline-color: var(--clr-warning);
}
</style>
