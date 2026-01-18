<script>
    import Header from '$lib/components/header.svelte';
    import ModelUploader from '$lib/components/model-uploader.svelte';
    import ShapeEditor from '$lib/components/shape-editor.svelte';
    import PatternOutput from '$lib/components/pattern-output.svelte';
    import Footer from '$lib/components/footer.svelte';
  
    import GetStarted from '$lib/components/GetStarted.svelte';
    import SignupModal from '$lib/components/SignupModal.svelte';
    import SignIn from '$lib/components/SignIn.svelte';
    
    let activeTab = $state('upload');
    let voxelData = $state(null);
    let patternSettings = $state({
      resolution: 16,
      stitchType: 'sc',
      colorPalette: ['#E8D5C4', '#8B7355', '#D4A574', '#F5E6D3', '#6B4423']
    });
  
    function handleModelProcessed(data) {
      voxelData = data;
    }
  
    function handleShapeCreated(data) {
      voxelData = data;
    }
</script>
  
<div class="min-h-screen flex flex-col">
  <Header />

  <main class="flex-1">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-accent/30 py-16 lg:py-24">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-foreground mb-6 text-balance">
            Transform 3D into <span class="text-primary">Crochet</span>
          </h1>
          <p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Upload any 3D model or create shapes from scratch. Get detailed crochet patterns with visual grids and written instructions.
          </p>
          <div class="mt-8 flex justify-center">
            <GetStarted />
          </div>
        </div>
      </div>
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
    </section>

    <!-- Main Tool Section -->
    <section class="py-12 lg:py-16">
      <div class="container mx-auto px-4">
        <!-- Tab Navigation -->
        <div class="flex justify-center mb-8">
          <div class="inline-flex bg-muted rounded-lg p-1 gap-1">
            <button
              onclick={() => activeTab = 'upload'}
              class="px-6 py-2.5 rounded-md text-sm font-medium transition-all {activeTab === 'upload' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
            >
              Upload Model
            </button>
            <button
              onclick={() => activeTab = 'create'}
              class="px-6 py-2.5 rounded-md text-sm font-medium transition-all {activeTab === 'create' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
            >
              Create Shape
            </button>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <!-- Input Panel -->
          <div class="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div class="p-6 border-b border-border">
              <h2 class="text-xl font-semibold text-card-foreground">
                {activeTab === 'upload' ? '3D Model Input' : 'Shape Creator'}
              </h2>
              <p class="text-sm text-muted-foreground mt-1">
                {activeTab === 'upload' ? 'Upload .obj, .stl, or .glb files' : 'Build shapes using primitives'}
              </p>
            </div>
            
            <div class="p-6">
              {#if activeTab === 'upload'}
                <ModelUploader onModelProcessed={handleModelProcessed} settings={patternSettings} />
              {:else}
                <ShapeEditor onShapeCreated={handleShapeCreated} settings={patternSettings} />
              {/if}
            </div>
          </div>

          <!-- Settings Panel -->
          <div class="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div class="p-6 border-b border-border">
              <h2 class="text-xl font-semibold text-card-foreground">Pattern Settings</h2>
              <p class="text-sm text-muted-foreground mt-1">Customize your crochet pattern output</p>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Resolution -->
              <div>
                <label for="resolution" class="block text-sm font-medium text-foreground mb-2">
                  Resolution (stitches): {patternSettings.resolution}
                </label>
                <input
                  id="resolution"
                  type="range"
                  min="8"
                  max="32"
                  bind:value={patternSettings.resolution}
                  class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div class="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Simple (8)</span>
                  <span>Detailed (32)</span>
                </div>
              </div>

              <!-- Stitch Type -->
              <div>
                <label for="stitchType" class="block text-sm font-medium text-foreground mb-2">Stitch Type</label>
                <select
                  id="stitchType"
                  bind:value={patternSettings.stitchType}
                  class="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="sc">Single Crochet (sc)</option>
                  <option value="hdc">Half Double Crochet (hdc)</option>
                  <option value="dc">Double Crochet (dc)</option>
                </select>
              </div>

              <!-- Color Palette -->
              <div>
                <span class="block text-sm font-medium text-foreground mb-2">Color Palette</span>
                <div class="flex gap-2 flex-wrap">
                  {#each patternSettings.colorPalette as color, i}
                    <label class="relative">
                      <input
                        type="color"
                        bind:value={patternSettings.colorPalette[i]}
                        class="sr-only"
                      />
                      <div
                        class="w-10 h-10 rounded-lg border-2 border-border cursor-pointer hover:scale-110 transition-transform"
                        style="background-color: {color}"
                      ></div>
                    </label>
                  {/each}
                  <button
                    onclick={() => patternSettings.colorPalette = [...patternSettings.colorPalette, '#cccccc']}
                    class="w-10 h-10 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    disabled={patternSettings.colorPalette.length >= 8}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pattern Output -->
        {#if voxelData}
          <div class="mt-12">
            <PatternOutput {voxelData} settings={patternSettings} />
          </div>
        {/if}
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 lg:py-24 bg-muted/50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-serif font-medium text-center mb-12">How It Works</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Upload or Create</h3>
            <p class="text-muted-foreground">Import your 3D model or build shapes using our intuitive editor</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Voxelize</h3>
            <p class="text-muted-foreground">Your model is converted into a 3D grid of stitches</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Get Your Pattern</h3>
            <p class="text-muted-foreground">Download visual grids and written instructions</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <Footer />

  <!-- Modals -->
  <SignupModal />
  <SignIn />
</div>
