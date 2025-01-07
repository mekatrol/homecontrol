<template>
  <div class="search-box">
    <input
      type="text"
      placeholder="Search..."
      name="search"
    />
    <button type="submit">
      <FontAwesomeIcon
        class="icon"
        :icon="faSearch"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<style lang="css" scoped>
.search-box {
  display: flex;
  flex-direction: row;
  align-content: center;
}

.search-box input[type='text'] {
  padding: 6px;
  font-size: 1.2rem;
  min-width: 50ch;
  max-width: 80ch;

  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.search-box button {
  font-size: 1.2rem;

  padding: 6px 10px;
  margin-right: 16px;
  font-size: 17px;
  border: none;
  cursor: pointer;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}
</style>
