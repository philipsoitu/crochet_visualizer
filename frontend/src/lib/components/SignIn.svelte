<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { showSignin } from '$lib/stores/ui';
  
    let email = $state('');
    let password = $state('');
    let error = $state('');
    let users = $state([]);
  
    onMount(() => {
      const stored = localStorage.getItem('users');
      users = stored ? JSON.parse(stored) : [];
    });
  
    function close() {
      showSignin.set(false);
      error = '';
      email = '';
      password = '';
    }
  
    function handleSignin() {
      error = '';
  
      if (!email || !password) {
        error = 'Please fill in all fields.';
        return;
      }
  
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
  
      if (!user) {
        error = 'Invalid email or password.';
        return;
      }
  
      localStorage.setItem('currentUser', JSON.stringify(user));
      close();
      goto('/');
    }
  </script>
  
  {#if $showSignin}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onclick={close}>
      <div class="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
        <h2 class="mb-4 text-2xl font-semibold">Sign In</h2>
  
        {#if error}
          <p class="mb-3 text-sm text-destructive">{error}</p>
        {/if}
  
        <div class="space-y-4">
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
            onclick={close}
            class="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
  
          <button
            onclick={handleSignin}
            class="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  {/if}