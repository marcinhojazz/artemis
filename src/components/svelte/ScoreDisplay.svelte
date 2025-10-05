<script lang="ts">
  import { gameState, resetScore } from '../../lib/store';
  // O prefixo `$` faz com que o componente Svelte "escute"
  // as mudanças no nosso store global. É reativo!
</script>

<div class="p-4 bg-black/60 rounded-xl text-white font-mono shadow-lg select-none text-center">
  <h2 class="text-4xl font-bold">
    PONTOS: {$gameState.score}
  </h2>
  <p class="text-sm mt-2">Clique no cubo 3D para pontuar!</p>
  
  <button 
    on:click={resetScore} 
    class="mt-4 px-4 py-2 bg-purple-700 rounded hover:bg-purple-600 transition-colors pointer-events-auto"
  >
    Zerar Placar
  </button>
</div>