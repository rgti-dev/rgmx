<template>
  <router-view />
</template>

<script setup>
import { useAuthStore } from './store/auth';

const auth = useAuthStore();
</script>
