<script>
    import { showSignup } from '$lib/stores/ui';
  </script>
  
  <button
    onclick={() => showSignup.set(true)}
    class="rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:opacity-90 transition-opacity"
  >
    Get Started Free
  </button>