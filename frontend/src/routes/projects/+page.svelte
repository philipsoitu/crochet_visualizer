<script>
  export let data;
  const userId = data.user.sub;

  let models = data.models ?? [];
  console.log(models)

  let file = null;
  let layerHeight = 2.0;
  let stitchWidth = 3.0;
  let magicRingStitches = 6;
  let loading = false;
  let status = '';
  let statusType = '';

  function handleFileChange(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      file = files[0];
    }
  }

  async function generatePattern() {
    if (!file) {
      showStatus('Please select a file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('layer_height', layerHeight.toString());
    formData.append('stitch_width', stitchWidth.toString());
    formData.append('magic_ring_stitches', magicRingStitches.toString());

    loading = true;
    showStatus('Generating pattern...', 'loading');

    try {
      const response = await fetch('http://localhost:8000/generate-pattern', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate pattern');
      }

      const result = await response.json();

      // Log to console
      console.log('=== PATTERN RESULT ===');
      console.log(result);
      console.log('\n=== PATTERN LINES ===');
      result.pattern.forEach((line, i) => {
        console.log(`${i + 1}: ${line}`);
      });

      if (result.appendages) {
        console.log('\n=== APPENDAGES ===');
        console.log(result.appendages);
      }

      showStatus('✅ Pattern generated! Check console (F12)', 'success');
    } catch (error) {
      console.error('Error:', error);
      showStatus(`❌ Error: ${error.message}`, 'error');
    } finally {
      loading = false;
    }
  }

  function showStatus(message, type) {
    status = message;
    statusType = type;
  }
</script>

<h1>User ID: {userId}</h1>
<p>Models: {models}</p>


<div class="container">
  <h1>🧶 Crochet Pattern Generator</h1>

  <form on:submit|preventDefault={generatePattern}>
    <div class="form-group">
      <label for="file">Upload STL/OBJ File:</label>
      <input
        type="file"
        id="file"
        accept=".stl,.obj,.STL,.OBJ"
        on:change={handleFileChange}
        required
      />
    </div>

    <div class="form-group">
      <label for="layerHeight">Layer Height (mm):</label>
      <input
        type="number"
        id="layerHeight"
        bind:value={layerHeight}
        step="0.1"
        min="0.1"
      />
    </div>

    <div class="form-group">
      <label for="stitchWidth">Stitch Width (mm):</label>
      <input
        type="number"
        id="stitchWidth"
        bind:value={stitchWidth}
        step="0.1"
        min="0.1"
      />
    </div>

    <div class="form-group">
      <label for="magicRing">Magic Ring Stitches:</label>
      <input
        type="number"
        id="magicRing"
        bind:value={magicRingStitches}
        min="3"
        max="12"
      />
    </div>

    <button type="submit" disabled={loading}>
      {loading ? 'Generating...' : 'Generate Pattern'}
    </button>
  </form>

  {#if status}
    <div class="status {statusType}">
      {status}
    </div>
  {/if}
</div>

<style>
	.container {
		max-width: 600px;
		margin: 50px auto;
		padding: 20px;
	}

	h1 {
		margin-top: 0;
		color: #333;
	}

	form {
		background: white;
		padding: 30px;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		margin-bottom: 5px;
		font-weight: 500;
		color: #555;
	}

	input[type='file'],
	input[type='number'] {
		width: 100%;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
		box-sizing: border-box;
	}

	input[type='number'] {
		max-width: 200px;
	}

	button {
		background: #4caf50;
		color: white;
		padding: 12px 24px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
		width: 100%;
	}

	button:hover:not(:disabled) {
		background: #45a049;
	}

	button:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.status {
		margin-top: 20px;
		padding: 10px;
		border-radius: 4px;
	}

	.status.loading {
		background: #e3f2fd;
		color: #1976d2;
	}

	.status.success {
		background: #e8f5e9;
		color: #2e7d32;
	}

	.status.error {
		background: #ffebee;
		color: #c62828;
	}
</style>
