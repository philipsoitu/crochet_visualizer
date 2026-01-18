<script lang="ts">
  export let data;
  const { model: m } = data;
</script>

<a href="/projects">← Back</a>

<h1>{m.modelName}</h1>

<ul>
  <li><strong>Layer Height:</strong> {m.layerHeight}</li>
  <li><strong>Stitch Width:</strong> {m.stitchWidth}</li>
  <li><strong>Magic Ring Stitches:</strong> {m.magicRingStitches}</li>
</ul>

<h2>Instructions</h2>
<ol>
  {#each m.output as line}
    <li>{line}</li>
  {/each}
</ol>
