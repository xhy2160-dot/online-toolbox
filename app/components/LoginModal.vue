<!-- components/LoginModal.vue -->
<template>
  <Teleport to="body">
    <div class="overlay" v-if="modelValue">
      <div class="modal">
        <button class="close-btn" @click="close">✕</button>

        <h2>{{ mode === 'login' ? 'Log in' : 'Sign up' }}</h2>

        <div class="note">
          <span class="note-icon">ℹ</span>
          <p v-if="mode === 'login'">Log in with your username or email and password.</p>
          <p v-else>Create an account with a username, email, and password.</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="field" v-if="mode === 'signup'">
            <label>Username</label>
            <div class="input-wrap">
              <input v-model="username" type="text" placeholder="Choose a username" required />
            </div>
          </div>

          <div class="field">
            <label>{{ mode === 'login' ? 'Username or email' : 'Email' }}</label>
            <div class="input-wrap">
              <input v-if="mode === 'login'" v-model="identifier" type="text" placeholder="Username or email"
                required />
              <input v-else v-model="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>

          <div class="field">
            <label>Password</label>
            <div class="input-wrap">
              <input v-model="password" type="password" placeholder="Required" required />
            </div>
          </div>

          <p class="error" v-if="error">{{ error }}</p>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Please wait...' : (mode === 'login' ? 'Log in' : 'Sign up') }}
          </button>
        </form>

        <p class="switch-mode">
          <template v-if="mode === 'login'">
            Don't have an account?
            <button type="button" @click="mode = 'signup'">Sign up</button>
          </template>
          <template v-else>
            Already have an account?
            <button type="button" @click="mode = 'login'">Log in</button>
          </template>
        </p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const { login, signup } = useAuth()

const mode = ref<'login' | 'signup'>('login')
const username = ref('')
const identifier = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function close() {
  emit('update:modelValue', false)
  username.value = ''
  identifier.value = ''
  email.value = ''
  password.value = ''
  error.value = ''
  mode.value = 'login'
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    if (mode.value === 'login') {
      await login(identifier.value, password.value)
    } else {
      await signup(username.value, email.value, password.value)
    }
    close()
  } catch (err: any) {
    error.value = err?.data?.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background: #fff;
  border-radius: 14px;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #aaa;
  cursor: pointer;
}

.close-btn:hover {
  color: #1a1a1a;
}

h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.note {
  display: flex;
  gap: 0.6rem;
  background: #f5f1ea;
  border: 1px solid #e8e0d8;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  margin-bottom: 1.5rem;
}

.note-icon {
  font-size: 0.85rem;
  color: #999;
  flex-shrink: 0;
  line-height: 1.4;
}

.note p {
  font-size: 0.8rem;
  color: #777;
  line-height: 1.5;
  margin: 0;
}

.field {
  margin-bottom: 1.1rem;
}

.field label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.45rem;
}

.input-wrap input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid #d8d0c7;
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  color: #1a1a1a;
  transition: border-color 0.15s;
}

.input-wrap input::placeholder {
  color: #b5afa3;
}

.input-wrap input:focus {
  border-color: #1a1a1a;
}

.error {
  font-size: 0.8rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 0.85rem;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: opacity 0.15s;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  opacity: 0.88;
}

.switch-mode {
  text-align: center;
  font-size: 0.8rem;
  color: #666;
  margin-top: 1.25rem;
}

.switch-mode button {
  background: none;
  border: none;
  color: #1a1a1a;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.8rem;
  text-decoration: underline;
  padding: 0;
}
</style>