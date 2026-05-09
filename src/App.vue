<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
    <LoginScreen v-if="!user" @login="handleLogin" :loading="isLoading" />
    <ProfileScreen v-else :user="user" :token="accessToken" @logout="signOut" />
  </div>
</template>

<script setup>
import { useGoogleAuth } from './composables/useGoogleAuth'
import LoginScreen from './components/LoginScreen.vue'
import ProfileScreen from './components/ProfileScreen.vue'

const { user, accessToken, isLoading, signIn, signOut } = useGoogleAuth()

async function handleLogin() {
  await signIn()
}
</script>