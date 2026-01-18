<script>
  import Header from '$lib/components/header.svelte';

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

<Header/>

<h1>User ID: {userId}</h1>
<p>Models: {models}</p>


{#if models.length === 0}
  <p>No projects yet.</p>
{:else}
  <div class="grid">
    {#each models as m (m._id)}
      <a class="card" href={`/projects/${m._id}`}>
        <div class="cardHeader">
          <h2>{m.modelName}</h2>
          <span class="pill">{m._id.slice(0, 6)}…</span>
        </div>

        <div class="meta">
          <div><strong>Layer</strong> {m.layerHeight}</div>
          <div><strong>Stitch</strong> {m.stitchWidth}</div>
          <div><strong>MR</strong> {m.magicRingStitches}</div>
        </div>

        <div class="footer">
          <span>{m.output?.length ?? 0} lines</span>
          <span class="cta">Open →</span>
        </div>
      </a>
    {/each}
  </div>
{/if}

<style>
  .title { font-size: 1.75rem; margin: 1rem 0 0.25rem; }
  .muted { opacity: 0.7; margin-bottom: 1rem; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .card {
    display: block;
    text-decoration: none;
    color: inherit;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 14px;
    padding: 1rem;
    transition: transform 120ms ease, border-color 120ms ease;
  }
  .card:hover {
    transform: translateY(-2px);
    border-color: rgba(255,255,255,0.28);
  }

  .cardHeader {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
  }

  h2 { margin: 0; font-size: 1.1rem; }

  .pill {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.18);
    opacity: 0.8;
    white-space: nowrap;
  }

  .meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-top: 0.75rem;
    opacity: 0.9;
    font-size: 0.95rem;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.9rem;
    opacity: 0.85;
    font-size: 0.95rem;
  }

  .cta { font-weight: 600; }
</style>
