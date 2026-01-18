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
            class="group block rounded-lg border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200"
          >
            <div class="flex items-start justify-between mb-4">
              <h2 class="text-xl font-serif font-medium text-card-foreground group-hover:text-primary transition-colors">
                {m.modelName}
              </h2>
              <span class="text-xs px-2 py-1 rounded-full border border-border bg-muted text-muted-foreground">
                {m._id.slice(0, 6)}…
              </span>
            </div>

            <div class="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <div class="text-muted-foreground text-xs mb-1">Layer</div>
                <div class="font-medium text-card-foreground">{m.layerHeight}mm</div>
              </div>
              <div>
                <div class="text-muted-foreground text-xs mb-1">Stitch</div>
                <div class="font-medium text-card-foreground">{m.stitchWidth}mm</div>
              </div>
              <div>
                <div class="text-muted-foreground text-xs mb-1">MR</div>
                <div class="font-medium text-card-foreground">{m.magicRingStitches}</div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-border">
              <span class="text-sm text-muted-foreground">
                {m.output?.length ?? 0} {m.output?.length === 1 ? 'line' : 'lines'}
              </span>
              <span class="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform inline-block">
                Open →
              </span>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </main>
</div>
