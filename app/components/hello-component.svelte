<script>
  let { firstName, lastName, counter } = $props();

  let fullName = $derived(firstName + ' ' + lastName);
</script>

[Svelte] Hello {fullName}!

<div>
  <h3>Svelte Counter</h3>
  <p>
    {counter.count}
    <button type="button" onclick={() => counter.increment()}>+1</button>
  </p>
</div>
