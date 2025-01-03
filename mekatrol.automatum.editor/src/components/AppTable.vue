<template>
  <!-- For overview of why roles are explicity added to table element tags see: 
    > https://www.youtube.com/watch?v=czZ1PvNW5hk
    > https://adrianroselli.com/2017/11/a-responsive-accessible-table.html
    > https://adrianroselli.com/2018/05/functions-to-add-aria-to-tables-and-lists.html
    -->
  <table role="table">
    <caption
      v-if="caption"
      role="caption"
    >
      {{
        caption
      }}
    </caption>
    <thead role="rowgroup">
      <tr role="row">
        <th
          v-for="(header, i) in headers"
          :key="i"
          role="columnheader"
        >
          {{ header.label }}
        </th>
      </tr>
    </thead>
    <tbody role="rowgroup">
      <tr
        v-for="(row, i) in rows"
        :key="i"
        role="row"
        :class="`${highlightHover ? 'highlight-hover' : ''} ${rowSelectable ? 'selectable' : ''} ${i === selectedRow ? 'selected' : ''}`"
        @click="selectRow(i)"
      >
        <td
          v-for="(cell, i) in row.cells"
          :key="i"
          data-cell="label"
          role="cell"
        >
          {{ cell.value }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { TableHeader, TableRow } from '@/types/table';
import { ref } from 'vue';

interface Props {
  caption?: string;
  headers: TableHeader[];
  rows: TableRow[];
  highlightHover?: boolean;
  rowSelectable?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'row-clicked', row: number): void;
}>();

const selectedRow = ref<number | undefined>(undefined);

const selectRow = (i: number): void => {
  selectedRow.value = i;
  emit('row-clicked', i);
};
</script>

<style scoped lang="css">
table {
  width: 100%;
  border-collapse: collapse;
  background-color: #323232;
}

caption,
th,
td {
  padding: 1rem;
}

caption,
th {
  text-align: left;
}

caption {
  background-color: hsl(0 0% 0%);
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
}

th {
  background-color: hsl(0 0% 0% / 0.5);
}

tr:nth-of-type(2n) {
  background-color: hsl(0 0% 0% / 0.1);
}

tr.highlight-hover:hover:not(.selected) {
  background-color: green;
  color: red;
}

tr.highlight-hover.selected:hover {
  background-color: white;
  color: purple;
}

tr.selected {
  background-color: purple;
  color: white;
}

tr.selectable {
  cursor: pointer;
}

@media (max-width: 800px) {
  th {
    display: none;
  }

  td {
    display: grid;
    grid-template-columns: 8ch auto;
    gap: 0.3rem;
    padding: 0.5rem 1rem;
  }

  td::nth-of-type(2n) {
    text-align: right;
  }

  td:first-child {
    padding-top: 2rem;
  }

  td:last-child {
    padding-bottom: 2rem;
  }

  td::before {
    content: attr(data-cell) ': ';
    font-weight: 700;
    text-transform: capitalize;
  }
}
</style>
