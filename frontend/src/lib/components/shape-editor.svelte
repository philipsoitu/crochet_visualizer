<script>
  let { onShapeCreated, settings } = $props();
  
  let selectedShape = $state('sphere');
  let shapeSize = $state(1);
  let isGenerating = $state(false);

  const shapes = [
    { id: 'sphere', name: 'Sphere', icon: '◯' },
    { id: 'cube', name: 'Cube', icon: '◻' },
    { id: 'cylinder', name: 'Cylinder', icon: '⬭' },
    { id: 'cone', name: 'Cone', icon: '△' },
    { id: 'torus', name: 'Torus', icon: '◎' },
    { id: 'heart', name: 'Heart', icon: '♥' }
  ];

  async function generateShape() {
    isGenerating = true;
    await new Promise(resolve => setTimeout(resolve, 1000));

    const res = settings.resolution;
    const voxels = [];
    const center = res / 2;
    const radius = (res / 2 - 1) * shapeSize;

    for (let z = 0; z < res; z++) {
      const layer = [];
      for (let y = 0; y < res; y++) {
        const row = [];
        for (let x = 0; x < res; x++) {
          const dx = x - center;
          const dy = y - center;
          const dz = z - center;
          let filled = false;

          switch (selectedShape) {
            case 'sphere':
              filled = Math.sqrt(dx*dx + dy*dy + dz*dz) <= radius;
              break;
            case 'cube':
              filled = Math.abs(dx) <= radius && Math.abs(dy) <= radius && Math.abs(dz) <= radius;
              break;
            case 'cylinder':
              filled = Math.sqrt(dx*dx + dz*dz) <= radius && Math.abs(dy) <= radius;
              break;
            case 'cone':
              const coneRadius = radius * (1 - (y + center) / res);
              filled = Math.sqrt(dx*dx + dz*dz) <= coneRadius && y >= -center;
              break;
            case 'torus':
              const R = radius * 0.7;
              const r = radius * 0.3;
              const q = Math.sqrt(dx*dx + dz*dz) - R;
              filled = Math.sqrt(q*q + dy*dy) <= r;
              break;
            case 'heart':
              // Simplified heart shape
              const heartX = dx / radius;
              const heartY = dy / radius;
              const heartZ = dz / radius;
              const heartEq = Math.pow(heartX*heartX + heartY*heartY + heartZ*heartZ - 1, 3) - heartX*heartX*heartZ*heartZ*heartZ - heartY*heartY*heartZ*heartZ*heartZ*0.1;
              filled = heartEq <= 0 && Math.abs(dx) <= radius && Math.abs(dy) <= radius && Math.abs(dz) <= radius;
              break;
          }

          if (filled) {
            const colorIndex = Math.floor((z / res) * settings.colorPalette.length);
            row.push(Math.min(colorIndex, settings.colorPalette.length - 1));
          } else {
            row.push(-1);
          }
        }
        layer.push(row);
      }
      voxels.push(layer);
    }

    isGenerating = false;
    onShapeCreated?.({
      voxels,
      dimensions: { x: res, y: res, z: res },
      shapeName: shapes.find(s => s.id === selectedShape)?.name || 'Shape'
    });
  }
</script>

<div class="space-y-6">
  <!-- Shape Selection -->
  <div>
    <span class="block text-sm font-medium text-foreground mb-3">Select Shape</span>
    <div class="grid grid-cols-3 gap-2">
      {#each shapes as shape}
        <button
          onclick={() => selectedShape = shape.id}
          class="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 {selectedShape === shape.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
        >
          <span class="text-2xl">{shape.icon}</span>
          <span class="text-xs font-medium">{shape.name}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Size Slider -->
  <div>
    <label for="size-slider" class="block text-sm font-medium text-foreground mb-2">
      Size: {Math.round(shapeSize * 100)}%
    </label>
    <input
      id="size-slider"
      type="range"
      min="0.5"
      max="1"
      step="0.1"
      bind:value={shapeSize}
      class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
    />
  </div>

  <!-- Preview -->
  <div class="bg-muted/50 rounded-xl p-6 text-center">
    <div class="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
      <span class="text-5xl opacity-70">
        {shapes.find(s => s.id === selectedShape)?.icon}
      </span>
    </div>
    <p class="text-sm text-muted-foreground mt-3">
      {shapes.find(s => s.id === selectedShape)?.name} at {settings.resolution}x{settings.resolution}x{settings.resolution}
    </p>
  </div>

  <!-- Generate Button -->
  <button
    onclick={generateShape}
    disabled={isGenerating}
    class="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {#if isGenerating}
      <span class="flex items-center justify-center gap-2">
        <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating...
      </span>
    {:else}
      Generate Pattern
    {/if}
  </button>
</div>
