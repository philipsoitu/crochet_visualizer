<script>
  import Header from '$lib/components/header.svelte';
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  let modelName = $state(form?.modelName || '');
  let layerHeight = $state(form?.layerHeight ?? 2.0);
  let stitchWidth = $state(form?.stitchWidth ?? 3.0);
  let magicRingStitches = $state(form?.magicRingStitches ?? 6);
</script>

<Header/>

<div class="min-h-screen bg-background">
  <main class="container mx-auto px-4 py-8 lg:py-12">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <a
          href="/projects"
          class="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← Back to Projects
        </a>
        <h1 class="text-3xl md:text-4xl font-serif font-medium tracking-tight text-foreground mb-2">
          Create New Project
        </h1>
        <p class="text-muted-foreground">
          Set up a new crochet pattern project
        </p>
      </div>

      <form
        method="POST"
        use:enhance
        class="space-y-6 rounded-lg border border-border bg-card p-6 lg:p-8"
      >
        <div>
          <label
            for="modelName"
            class="block text-sm font-medium text-card-foreground mb-2"
          >
            Project Name
          </label>
          <input
            type="text"
            id="modelName"
            name="modelName"
            bind:value={modelName}
            required
            class="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="My Crochet Project"
          />
        </div>

        <div>
          <label
            for="layerHeight"
            class="block text-sm font-medium text-card-foreground mb-2"
          >
            Layer Height (mm)
          </label>
          <input
            type="number"
            id="layerHeight"
            name="layerHeight"
            bind:value={layerHeight}
            step="0.1"
            min="0.1"
            required
            class="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>

        <div>
          <label
            for="stitchWidth"
            class="block text-sm font-medium text-card-foreground mb-2"
          >
            Stitch Width (mm)
          </label>
          <input
            type="number"
            id="stitchWidth"
            name="stitchWidth"
            bind:value={stitchWidth}
            step="0.1"
            min="0.1"
            required
            class="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>

        <div>
          <label
            for="magicRingStitches"
            class="block text-sm font-medium text-card-foreground mb-2"
          >
            Magic Ring Stitches
          </label>
          <input
            type="number"
            id="magicRingStitches"
            name="magicRingStitches"
            bind:value={magicRingStitches}
            step="1"
            min="1"
            required
            class="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>

        {#if form?.error}
          <div class="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p class="text-sm text-destructive-foreground">{form.error}</p>
          </div>
        {/if}

        <div class="flex gap-4 pt-4">
          <a
            href="/projects"
            class="flex-1 rounded-lg border border-border bg-background px-6 py-3 text-center text-base font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </a>
          <button
            type="submit"
            class="flex-1 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  </main>
</div>

