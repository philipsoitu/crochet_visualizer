<script>
    import ModelUploader from '$lib/components/model-uploader.svelte';
    import ShapeEditor from '$lib/components/shape-editor.svelte';
    import PatternOutput from '$lib/components/pattern-output.svelte';

    import SignupModal from '$lib/components/SignupModal.svelte';
    import SignIn from '$lib/components/SignIn.svelte';

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
            <a class="rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              href="/projects" >Get Started</a>

          </div>
        </div>
      </div>
    </section>


  </main>

  <!-- Modals -->
  <SignupModal />
  <SignIn />
</div>
