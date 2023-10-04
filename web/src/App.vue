<script lang="ts" setup>
import { zhCN, dateZhCN, lightTheme, darkTheme } from 'naive-ui';

import { updateToken } from './data/api/api';
import { useUserDataStore } from './data/stores/userData';
import { useSettingStore } from './data/stores/setting';

const setting = useSettingStore();

useUserDataStore().$subscribe(
  (_mutation, state) => updateToken(state.info?.token),
  { detached: true, immediate: true }
);
</script>

<template>
  <n-config-provider
    :theme="setting.isDark ? darkTheme : lightTheme"
    :locale="zhCN"
    :date-locale="dateZhCN"
    inline-theme-disabled
  >
    <n-message-provider>
      <router-view :key="$route.path" />
    </n-message-provider>
  </n-config-provider>
</template>

<style>
a {
  text-decoration: none;
}
p,
li {
  overflow-wrap: break-word;
  word-break: break-word;
}
.n-h:first-child {
  margin: var(--n-margin);
}
.text-2line {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>