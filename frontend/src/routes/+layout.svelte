<script>
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen font-sans">
  {@render children()}
</div>