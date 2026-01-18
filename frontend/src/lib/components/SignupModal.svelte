<script>
    import { showSignup } from '$lib/stores/ui';
    import { goto } from '$app/navigation';
  
    let username = $state('');
    let email = $state('');
    let password = $state('');
    let error = $state('');
    let success = $state(false);
  
    function closeSignup() {
      showSignup.set(false);
      error = '';
      success = false;
      username = '';
      email = '';
      password = '';
    }
  
    function handleSignup() {
      error = '';
  
      if (!username || !email || !password) {
        error = 'All fields are required.';
        return;
      }
  
      if (!email.includes('@')) {
        error = 'Please enter a valid email.';
        return;
      }
  
      if (password.length < 6) {
        error = 'Password must be at least 6 characters.';
        return;
      }
  
      const users = JSON.parse(localStorage.getItem('users') || '[]');
  
      if (users.find(u => u.email === email)) {
        error = 'An account with this email already exists.';
        return;
      }
  
      const newUser = { username, email, password };
  
      localStorage.setItem('users', JSON.stringify([...users, newUser]));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
  
      success = true;
  
      setTimeout(() => {
        closeSignup();
        goto('/');
      }, 800);
    }
  </script>
  
  {#if $showSignup}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onclick={closeSignup}>
      <div class="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
        <h2 class="text-2xl font-semibold mb-4">Create Account</h2>
  
        {#if error}
          <p class="mb-3 text-sm text-destructive">{error}</p>
        {/if}
  
        {#if success}
          <p class="mb-3 text-sm text-primary">
            Account created successfully!
          </p>
        {/if}
  
        <div class="space-y-4">
          <input
            type="text"
            placeholder="Username"
            bind:value={username}
            class="w-full rounded-lg border border-border bg-background px-4 py-2"
          />
  
          <input
            type="email"
            placeholder="Email"
            bind:value={email}
            class="w-full rounded-lg border border-border bg-background px-4 py-2"
          />
  
          <input
            type="password"
            placeholder="Password"
            bind:value={password}
            class="w-full rounded-lg border border-border bg-background px-4 py-2"
          />
        </div>
  
        <div class="mt-6 flex justify-end gap-3">
          <button
            onclick={closeSignup}
            class="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
  
          <button
            onclick={handleSignup}
            class="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  {/if}