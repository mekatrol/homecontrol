<template>
  <div class="form-container tab points-view">
    <div class="header">
      <button
        @click="createNewPoint"
        class="btn icon"
      >
        <FontAwesomeIcon :icon="faPlus" />New point
      </button>
      <SearchBar />
    </div>
    <div class="list">
      <AppTable
        :headers="headers"
        :rows="rows"
        :highlight-hover="true"
        :row-selectable="true"
        @row-clicked="rowClicked"
        @row-clicked-close="rowClickedClose"
      ></AppTable>
    </div>
    <AppDialog
      :show="showNewPointDialog"
      confirm-label="Create"
      :confirm-enabled="true"
      @confirm="onConfirmCreatePoint"
      @cancel="showNewPointDialog = false"
    >
      <NewPoint
        :point-id="newPoint!.id"
        :validation="[]"
      />
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import AppTable from '@/components/AppTable.vue';
import type { TableHeader, TableRow } from '@/types/table';
import { computed, onMounted, ref } from 'vue';
import { type Point } from '@/services/api-generated';
import AppDialog from '@/components/AppDialog.vue';
import NewPoint from '@/components/NewPoint.vue';
import { useAppStore } from '@/stores/app-store';
import { validatePoint } from '@/validation/point-validation';
import type { ValidationResult } from '@/validation/validation-helpers';
import { showInfoMessage } from '@/services/message';

const { getNewPoint, savePoint } = useAppStore();

const showNewPointDialog = ref(false);
const newPoint = ref<Point | undefined>(undefined);
const pointValidation = ref<ValidationResult[]>([]);

const headers: TableHeader[] = [
  {
    label: 'Name'
  },
  {
    label: 'Key'
  }
];

const points = ref<Point[]>([]);

const rows = computed(() => {
  const rows: TableRow[] = [];

  for (let i = 0; i < points.value.length; i++) {
    const point = points.value[i];

    const row: TableRow = {
      cells: [
        {
          value: point.key
        }
      ]
    };

    rows.push(row);
  }

  return rows;
});

const rowClicked = (i: number): void => {
  console.log(i);
};

const rowClickedClose = (i: number): void => {
  console.log(i);
};

onMounted(async () => {
  console.log('points view mounted');
});

const createNewPoint = async () => {
  const point = await getNewPoint();
  newPoint.value = point;
  showNewPointDialog.value = true;
};

const onConfirmCreatePoint = async () => {
  pointValidation.value = validatePoint(newPoint.value!);

  if (pointValidation.value.length > 0) {
    // Show message with validation errors
    const messages = pointValidation.value.map((v) => v.message);
    showInfoMessage(`Cannot save, please fix validation errors: ${messages.join(', ')}`);
    return;
  }

  await savePoint(newPoint.value!);

  showNewPointDialog.value = false;
  newPoint.value = undefined;
};
</script>

<style lang="css" scoped>
.points-view {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
  padding: 0;

  .header {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.5rem;

    > * {
      height: 100%;
    }

    > button {
      padding-inline: 0.5rem;
      padding-block: 0.2rem;
    }
  }
}
</style>
