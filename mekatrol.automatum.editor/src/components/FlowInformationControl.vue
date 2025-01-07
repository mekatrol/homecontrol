<template>
  <form
    action=""
    v-if="activeFlow"
  >
    <div class="form-group">
      <label for="interval">Interval</label>
      <input
        v-model="activeFlow.interval"
        placeholder="00:01:00"
        type="text"
        id="interval"
        :readonly="validations.flow.interval.readonly"
        :required="validations.flow.interval.required"
        :minlength="validations.flow.interval.minLength"
        :maxlength="validations.flow.interval.maxLength"
      />
      <p
        v-if="intervalValidation"
        class="validation-error"
      >
        {{ intervalValidation }}
      </p>
    </div>
    <div class="form-group">
      <label for="interval">Key</label>
      <input
        v-model="activeFlow.key"
        placeholder="00:01:00"
        type="text"
        id="interval"
        :readonly="validations.flow.key.readonly"
        :required="validations.flow.key.required"
        :minlength="validations.flow.key.minLength"
        :maxlength="validations.flow.key.maxLength"
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
        v-model="activeFlow.name"
        placeholder="<enter flow name>"
        type="text"
        id="name"
        :readonly="validations.flow.name.readonly"
        :required="validations.flow.name.required"
        :minlength="validations.flow.name.minLength"
        :maxlength="validations.flow.name.maxLength"
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
        v-model="activeFlow.description"
        type="text"
        id="description"
        :readonly="validations.flow.description.readonly"
        :required="validations.flow.description.required"
        :minlength="validations.flow.description.minLength"
        :maxlength="validations.flow.description.maxLength"
      />
    </div>
    <div class="form-group inline">
      <label>
        <input
          type="checkbox"
          name="enabled"
          id="enabled"
          value="value"
          v-model="activeFlow.enabled"
        />
        <span>Enabled</span>
      </label>
    </div>
  </form>
</template>

<script setup lang="ts">
import { validations } from '@/validation/validation-definitions';
import type { ValidationResult } from '@/validation/validation-helpers';
import { computed } from 'vue';
import { useFlowStore } from '@/stores/flow-store';
import { storeToRefs } from 'pinia';

interface Props {
  flowId: string;
  validation: ValidationResult[];
}

const props = defineProps<Props>();

const nameValidation = computed(() => {
  return props.validation.find((v) => v.field === 'name')?.message;
});

const intervalValidation = computed(() => {
  return props.validation.find((v) => v.field === 'interval')?.message;
});

const keyValidation = computed(() => {
  return props.validation.find((v) => v.field === 'key')?.message;
});

const { flows } = storeToRefs(useFlowStore());
const activeFlow = computed(() => {
  const flow = flows.value.find((f) => f.id === props.flowId)!;
  return flow;
});
</script>

<style lang="css">
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
