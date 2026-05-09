import { ref } from 'vue'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { CONFIG } from '../config'

const user = ref(null)
const accessToken = ref(null)
const isLoading = ref(false)
let initialized = false

export function useGoogleAuth() {
  function initGoogleAuth() {
    if (initialized) return
    GoogleAuth.initialize({
      clientId: CONFIG.GOOGLE_CLIENT_ID,
      scopes: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/spreadsheets'
      ],
      grantOfflineAccess: true,
    })
    initialized = true
  }

  async function signIn() {
    isLoading.value = true
    try {
      initGoogleAuth()
      const googleUser = await GoogleAuth.signIn()
      console.log('Google user:', JSON.stringify(googleUser))

      user.value = {
        name: googleUser.displayName || googleUser.name,
        email: googleUser.email,
        picture: googleUser.imageUrl || googleUser.picture,
      }

      accessToken.value = googleUser.authentication?.accessToken
        || googleUser.serverAuthCode

    } catch (e) {
      console.error('Login error:', JSON.stringify(e))
      alert('Login failed: ' + JSON.stringify(e))
    } finally {
      isLoading.value = false
    }
  }

  async function signOut() {
    try {
      await GoogleAuth.signOut()
    } catch (e) {
      console.error('Logout error:', e)
    }
    user.value = null
    accessToken.value = null
  }

  return { user, accessToken, isLoading, signIn, signOut }
}