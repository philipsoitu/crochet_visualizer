<script>
    let { onModelProcessed, settings } = $props();
    
    let isDragging = $state(false);
    let file = $state(null);
    let isProcessing = $state(false);
    let previewUrl = $state(null);
  
    function handleDragOver(e) {
      e.preventDefault();
      isDragging = true;
    }
  
    function handleDragLeave() {
      isDragging = false;
    }
  
    function handleDrop(e) {
      e.preventDefault();
      isDragging = false;
      const droppedFile = e.dataTransfer?.files[0];
      if (droppedFile) {
        processFile(droppedFile);
      }
    }
  
    function handleFileInput(e) {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        processFile(selectedFile);
      }
    }
  
    function processFile(uploadedFile) {
      const validExtensions = ['.obj', '.stl'];
      const extension = uploadedFile.name.toLowerCase().slice(uploadedFile.name.lastIndexOf('.'));
      
      if (!validExtensions.includes(extension)) {
        alert('Please upload a valid 3D file (.obj, .stl)');
        return;
      }
  
      file = uploadedFile;
      previewUrl = URL.createObjectURL(uploadedFile);
      processModel();
    }
  
    async function processModel() {
      if (!file) return;
      
      isProcessing = true;
      
      // Simulate voxelization process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate demo voxel data based on resolution
      const res = settings.resolution;
      const voxels = [];
      
      // Create a simple sphere shape as demo
      const center = res / 2;
      const radius = res / 2 - 1;
      
      for (let z = 0; z < res; z++) {
        const layer = [];
        for (let y = 0; y < res; y++) {
          const row = [];
          for (let x = 0; x < res; x++) {
            const dx = x - center;
            const dy = y - center;
            const dz = z - center;
            const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
            
            if (distance <= radius) {
              // Assign color based on height
              const colorIndex = Math.floor((z / res) * settings.colorPalette.length);
              row.push(Math.min(colorIndex, settings.colorPalette.length - 1));
            } else {
              row.push(-1); // Empty
            }
          }
          layer.push(row);
        }
        voxels.push(layer);
      }
      
      isProcessing = false;
      onModelProcessed?.({
        voxels,
        dimensions: { x: res, y: res, z: res },
        fileName: file.name
      });
    }
  
    function clearFile() {
      file = null;
      previewUrl = null;
    }
  </script>
  
  <div class="space-y-4">
    {#if !file}
      <div
        class="relative border-2 border-dashed rounded-xl p-8 text-center transition-colors {isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        role="button"
        tabindex="0"
      >
        <input
          type="file"
          accept=".obj,.stl,.glb,.gltf"
          onchange={handleFileInput}
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          <div>
            <p class="text-foreground font-medium">Drop your 3D model here</p>
            <p class="text-sm text-muted-foreground mt-1">or click to browse</p>
          </div>
          <p class="text-xs text-muted-foreground">Supports .stl, .obj, and whatever else trimesh accepts</p>
        </div>
      </div>
    {:else}
      <div class="bg-muted/50 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-foreground">{file.name}</p>
              <p class="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button
            onclick={clearFile}
            class="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Remove file"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
  
        {#if isProcessing}
          <div class="mt-4">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing model...
            </div>
            <div class="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full animate-pulse" style="width: 60%"></div>
            </div>
          </div>
        {/if}
      </div>
  
      <button
        onclick={processModel}
        disabled={isProcessing}
        class="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Generate Pattern'}
      </button>
    {/if}
  </div>
  
