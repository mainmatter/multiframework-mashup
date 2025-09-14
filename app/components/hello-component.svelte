<script>
  let { firstName, lastName } = $props();

  let fullName = $derived(firstName + ' ' + lastName);
</script>

[Svelte] Hello {fullName}!
