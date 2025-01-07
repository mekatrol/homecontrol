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
        placeholder=""
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

<style scoped lang="css"></style>
