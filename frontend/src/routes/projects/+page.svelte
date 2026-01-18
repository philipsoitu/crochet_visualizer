<script>
  import Header from '$lib/components/header.svelte';

  export let data;
  const models = data.models ?? [];
</script>

<Header/>

<div class="min-h-screen bg-background">
  <main class="container mx-auto px-4 py-8 lg:py-12">
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-serif font-medium tracking-tight text-foreground mb-2">
        Your Projects
      </h1>
      <p class="text-muted-foreground">
        Manage your crochet pattern projects
      </p>
    </div>

    {#if models.length === 0}
      <div class="text-center py-16">
        <p class="text-lg text-muted-foreground mb-6">No projects yet.</p>
        <a
          href="/projects/new"
          class="inline-block rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Create Your First Project
        </a>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each models as m (m._id)}
          <a
            href={`/projects/${m._id}`}
            class="group block rounded-xl border-2 border-primary/30 bg-secondary/50 p-6 shadow-md hover:border-primary hover:shadow-xl hover:bg-secondary/70 transition-all duration-200"
          >
            <div class="flex items-start justify-between mb-4">
              <h2 class="text-xl font-serif font-medium text-secondary-foreground group-hover:text-primary transition-colors">
                {m.modelName}
              </h2>
              <span class="text-xs px-2.5 py-1 rounded-full border border-primary/20 bg-background text-muted-foreground font-mono">
                {m._id.slice(0, 6)}…
              </span>
            </div>

            <div class="grid grid-cols-3 gap-4 mb-4 p-4 rounded-lg bg-background/60 border border-border/50">
              <div class="text-center">
                <div class="text-muted-foreground text-xs mb-1 font-medium uppercase tracking-wide">Layer</div>
                <div class="font-bold text-secondary-foreground text-lg">{m.layerHeight}mm</div>
              </div>
              <div class="text-center">
                <div class="text-muted-foreground text-xs mb-1 font-medium uppercase tracking-wide">Stitch</div>
                <div class="font-bold text-secondary-foreground text-lg">{m.stitchWidth}mm</div>
              </div>
              <div class="text-center">
                <div class="text-muted-foreground text-xs mb-1 font-medium uppercase tracking-wide">MR</div>
                <div class="font-bold text-secondary-foreground text-lg">{m.magicRingStitches}</div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t-2 border-primary/20">
              <span class="text-sm text-muted-foreground font-semibold">
                {m.output?.length ?? 0} {m.output?.length === 1 ? 'line' : 'lines'}
              </span>
              <span class="text-sm font-bold text-primary group-hover:translate-x-1 transition-transform inline-block">
                Open →
              </span>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </main>
</div>
