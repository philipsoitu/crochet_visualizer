<script>
  import Header from '$lib/components/header.svelte';
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  
  const model = $derived(data.model);
  const formData = $derived(form);

  // Initialize state from model, update from form if present
  let modelName = $state(data.model.modelName);
  let layerHeight = $state(data.model.layerHeight);
  let stitchWidth = $state(data.model.stitchWidth);
  let magicRingStitches = $state(data.model.magicRingStitches);
  let selectedFile = $state(null);
  let isGenerating = $state(false);
  let audioTone = $state(0);

  // Update from form data when it changes
  $effect(() => {
    if (form) {
      if (form.modelName !== undefined) modelName = form.modelName;
      if (form.layerHeight !== undefined) layerHeight = form.layerHeight;
      if (form.stitchWidth !== undefined) stitchWidth = form.stitchWidth;
      if (form.magicRingStitches !== undefined) magicRingStitches = form.magicRingStitches;
    }
  });

  function handleFileChange(event) {
    const target = event.target;
    if (target.files && target.files.length > 0) {
      selectedFile = target.files[0];
    }
  }
</script>

<Header/>

<div class="min-h-screen bg-background">
  <main class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-6">
      <a
        href="/projects"
        class="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        ← Back to Projects
      </a>
      <h1 class="text-3xl md:text-4xl font-serif font-medium tracking-tight text-foreground mb-2">
        {model.modelName}
      </h1>
      <p class="text-muted-foreground">
        Edit your project settings and view the crochet pattern
      </p>
    </div>

    <!-- Split Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left: Settings Editor -->
      <div class="space-y-6">
        <div class="rounded-lg border border-border bg-card p-6">
          <h2 class="text-xl font-serif font-medium text-card-foreground mb-6">
            Project Settings
          </h2>

          <form
            method="POST"
            action="?/generate"
            use:enhance={() => {
              isGenerating = true;
              return async ({ update }) => {
                await update();
                isGenerating = false;
              };
            }}
            enctype="multipart/form-data"
            class="space-y-6"
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
              <p class="text-xs text-muted-foreground mt-1">
                Height between each crochet round
              </p>
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
              <p class="text-xs text-muted-foreground mt-1">
                Width of each individual stitch
              </p>
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
              <p class="text-xs text-muted-foreground mt-1">
                Number of stitches in the starting magic ring
              </p>
            </div>

            <div>
              <label
                for="modelFile"
                class="block text-sm font-medium text-card-foreground mb-2"
              >
                3D Model File (STL/OBJ)
              </label>
              <input
                type="file"
                id="modelFile"
                name="modelFile"
                accept=".stl,.obj,.STL,.OBJ"
                onchange={handleFileChange}
                class="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:opacity-90"
              />
              <p class="text-xs text-muted-foreground mt-1">
                {selectedFile ? `Selected: ${selectedFile?.name || 'file'}` : 'Upload a 3D model file to generate pattern (optional if file already exists)'}
              </p>
            </div>

            <!-- Audio Tone Slider -->
            <div>
              <label
                for="audioTone"
                class="block text-sm font-medium text-card-foreground mb-2"
              >
                Audio
              </label>
              <div class="flex items-center gap-3">
                <span class="text-xs text-muted-foreground font-medium">Kind</span>
                <input
                  type="range"
                  id="audioTone"
                  name="audioTone"
                  bind:value={audioTone}
                  min="0"
                  max="1"
                  step="0.01"
                  class="flex-1 h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span class="text-xs text-muted-foreground font-medium">Mean</span>
              </div>
              <p class="text-xs text-muted-foreground mt-1">
                Adjust the tone of audio instructions
              </p>
            </div>

            {#if formData?.error}
              <div class="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                <p class="text-sm text-destructive-foreground">{formData.error}</p>
              </div>
            {/if}

            {#if formData?.success}
              <div class="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                <p class="text-sm text-green-600 dark:text-green-400">Settings saved successfully!</p>
              </div>
            {/if}

            <button
              type="submit"
              disabled={isGenerating}
              class="w-full rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating Pattern...' : 'Generate Pattern'}
            </button>
          </form>
        </div>
      </div>

      <!-- Right: Pattern Output -->
      <div class="space-y-6">
        <div class="rounded-lg border border-border bg-card p-6">
          <h2 class="text-xl font-serif font-medium text-card-foreground mb-6">
            Crochet Pattern
          </h2>

          {#if model.output && model.output.length > 0 && model.output[0] !== 'Pattern will be generated here'}
            <div class="space-y-4">
              <div class="bg-muted/50 rounded-lg p-4 mb-4">
                <h3 class="font-semibold text-foreground mb-2">Project Details</h3>
                <ul class="text-sm text-muted-foreground space-y-1">
                  <li><strong>Layer Height:</strong> {model.layerHeight}mm</li>
                  <li><strong>Stitch Width:</strong> {model.stitchWidth}mm</li>
                  <li><strong>Magic Ring:</strong> {model.magicRingStitches} stitches</li>
                  <li><strong>Total Rounds:</strong> {model.output.length}</li>
                </ul>
              </div>

              <div class="space-y-3 max-h-[600px] overflow-y-auto">
                {#each model.output as line, index}
                  <div class="border-l-2 border-primary/30 pl-4 py-2">
                    <div class="flex items-start gap-3">
                      <span class="text-xs font-mono text-muted-foreground min-w-[3rem]">
                        Round {index + 1}:
                      </span>
                      <p class="text-sm text-foreground flex-1">{line}</p>
                    </div>
                  </div>
                {/each}
              </div>

              <button
                onclick={() => {
                  const output = model.output || [];
                  const patternText = output.map((line, i) => `Round ${i + 1}: ${line}`).join('\n');
                  const text = `CROCHET PATTERN\n${'='.repeat(40)}\n\nProject: ${model.modelName}\nLayer Height: ${model.layerHeight}mm\nStitch Width: ${model.stitchWidth}mm\nMagic Ring: ${model.magicRingStitches} stitches\n\n${'='.repeat(40)}\n\nINSTRUCTIONS\n${'='.repeat(40)}\n\n${patternText}`;
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${model.modelName.replace(/\s+/g, '-')}-pattern.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                class="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download Pattern
              </button>
            </div>
          {:else}
            <div class="text-center py-12">
              <p class="text-muted-foreground mb-4">
                No pattern generated yet. Upload a 3D model to generate a crochet pattern.
              </p>
              <p class="text-sm text-muted-foreground">
                Pattern instructions will appear here once generated.
              </p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </main>
</div>
