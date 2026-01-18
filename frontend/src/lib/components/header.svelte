<script>
    import { showSignup, showSignin } from '$lib/stores/ui';

    let mobileMenuOpen = $state(false);
  </script>

  <header class="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">

        <!-- Logo -->
        <a href="/" class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg
              class="h-5 w-5 text-primary-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
            </svg>
          </div>
          <span class="text-xl font-serif font-semibold">StitchCraft</span>
        </a>

        <!-- Actions -->
        <div class="hidden md:flex items-center gap-4">
          <a
            href="auth/logout"
            class="text-sm font-medium text-foreground hover:text-primary"
          >
            Logout
          </a>

          <a
            href="/projects/new"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            + Add Project
          </a>
        </div>
      </div>
    </div>
  </header>
