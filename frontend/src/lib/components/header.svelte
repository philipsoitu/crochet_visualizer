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
  
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <a href="/gallery" class="text-sm font-medium text-muted-foreground hover:text-foreground">
            Gallery
          </a>
          <a href="/tutorials" class="text-sm font-medium text-muted-foreground hover:text-foreground">
            Tutorials
          </a>
          <a href="/about" class="text-sm font-medium text-muted-foreground hover:text-foreground">
            About
          </a>
        </nav>
  
        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center gap-4">
          <button
            onclick={() => showSignin.set(true)}
            class="text-sm font-medium text-foreground hover:text-primary"
          >
            Sign In
          </button>
  
          <button
            onclick={() => showSignup.set(true)}
            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Get Started
          </button>
        </div>
  
        <!-- Mobile Menu Toggle -->
        <button
          class="md:hidden"
          aria-label="Toggle menu"
          onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if mobileMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
            {/if}
          </svg>
        </button>
      </div>
    </div>
  
    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
      <div class="md:hidden border-t border-border bg-background">
        <nav class="container mx-auto px-4 py-4 flex flex-col gap-4">
          <a href="/gallery" class="text-sm font-medium text-muted-foreground hover:text-foreground">
            Gallery
          </a>
          <a href="/tutorials" class="text-sm font-medium text-muted-foreground hover:text-foreground">
            Tutorials
          </a>
          <a href="/about" class="text-sm font-medium text-muted-foreground hover:text-foreground">
            About
          </a>
  
          <hr class="border-border" />
  
          <button
            class="text-left text-sm font-medium text-foreground hover:text-primary"
            onclick={() => {
              showSignin.set(true);
              mobileMenuOpen = false;
            }}
          >
            Sign In
          </button>
  
          <button
            class="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            onclick={() => {
              showSignup.set(true);
              mobileMenuOpen = false;
            }}
          >
            Get Started
          </button>
        </nav>
      </div>
    {/if}
  </header>