<template>
  <div class="flow-editor-view">
    <div
      class="editor"
      v-if="flowId"
      :key="flowId"
    >
      <EditorControl :flow-id="flowId" />
    </div>
    <div
      class="summary"
      v-if="flowId"
      :key="flowId"
    >
      <FlowInformationControl
        :validation="flowValidation"
        :flow-id="flowId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorControl from '@/components/EditorControl.vue';
import FlowInformationControl from '@/components/FlowInformationControl.vue';
import type { ValidationResult } from '@/validation/validation-helpers';

interface Props {
  flowId: string | undefined;
  flowValidation: ValidationResult[];
}

defineProps<Props>();
</script>

<style lang="css" scoped>
.flow-editor-view {
  min-width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: row;

  .editor {
    width: 80%;
    max-width: 80%;
    height: 100%;
  }

  .summary {
    max-width: 20%;
  }
}
</style>
