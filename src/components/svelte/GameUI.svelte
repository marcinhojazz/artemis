<script lang="ts">
  import { gameState, setBuildMode, startGame, resetGame, toggleSubsystem, type ModuleType, type Subsystem } from '../../stores/store';

  const SECONDS_PER_DAY = 10;
  $: missionDay = Math.floor($gameState.missionTime / SECONDS_PER_DAY);
  $: energyBalance = $gameState.resources.energy.generated - $gameState.resources.energy.consumed;
  $: oxygenBalance = $gameState.resources.oxygen.generated - $gameState.resources.oxygen.consumed;

  const handleBuildClick = (mode: ModuleType) => {
    if ($gameState.missionStatus !== 'planning') return;
    setBuildMode($gameState.buildMode === mode ? null : mode);
  }
</script>

<div class="absolute inset-0 flex flex-col p-4 gap-4 pointer-events-none text-white font-mono select-none">

  <header class="flex justify-center items-center gap-4 bg-black/50 rounded-lg p-2 text-sm md:text-base">
    <div class="p-2 rounded transition-colors" class:bg-red-800={energyBalance < 0}>
      ⚡ Energia: {energyBalance >= 0 ? '+' : ''}{energyBalance}
    </div>
    <div class="p-2 rounded transition-colors" class:bg-red-800={oxygenBalance < 0}>
      💨 Oxigênio: {oxygenBalance >= 0 ? '+' : ''}{oxygenBalance}
    </div>
    <div>📅 Dia: {missionDay} / 30</div>
  </header>

  <main class="flex-grow flex justify-between items-start">
    <aside class="flex flex-col gap-4 p-4 bg-black/50 rounded-lg self-start">
      <h3 class="font-bold">Tripulação</h3>
      {#each $gameState.crew as member (member.id)}
        <div class="w-40 md:w-48">
          <p>Tripulante {member.id} | Sono</p>
          <div class="w-full bg-gray-600 rounded-full h-4 mt-1">
            <div class="bg-blue-500 h-4 rounded-full transition-all duration-500" style="width: {member.sleep}%"></div>
          </div>
        </div>
      {/each}
    </aside>

    <aside class="flex flex-col gap-3 p-4 bg-black/50 rounded-lg self-start pointer-events-auto">
        <h3 class="font-bold">Controle de Energia</h3>
        {#each Object.entries($gameState.subsystems) as [name, data] (name)}
            <div class="flex items-center justify-between gap-4">
                <span>{name} (-{data.consumption}kW)</span>
                <button
                    on:click={() => toggleSubsystem(name as Subsystem)}
                    class="px-3 py-1 text-xs font-bold rounded transition-colors"
                    class:bg-green-600={data.status === 'online'}
                    class:hover:bg-green-500={data.status === 'online'}
                    class:bg-gray-600={data.status === 'offline'}
                    class:hover:bg-gray-500={data.status === 'offline'}
                >
                    {data.status === 'online' ? 'ON' : 'OFF'}
                </button>
            </div>
        {/each}
    </aside>
  </main>

  {#if $gameState.missionStatus === 'planning'}
    <footer class="flex justify-center items-center gap-2 md:gap-4 p-2 bg-black/50 rounded-lg pointer-events-auto self-center">
      <span>Construir:</span>
      <button on:click={() => handleBuildClick('SOLAR_PANEL')} class="p-2 border-2 rounded transition-all" class:border-yellow-400={$gameState.buildMode === 'SOLAR_PANEL'} class:scale-110={$gameState.buildMode === 'SOLAR_PANEL'}>Painel Solar</button>
      <button on:click={() => handleBuildClick('O2_GENERATOR')} class="p-2 border-2 rounded transition-all" class:border-yellow-400={$gameState.buildMode === 'O2_GENERATOR'} class:scale-110={$gameState.buildMode === 'O2_GENERATOR'}>Gerador O₂</button>
      <button on:click={() => handleBuildClick('BUNK')} class="p-2 border-2 rounded transition-all" class:border-yellow-400={$gameState.buildMode === 'BUNK'} class:scale-110={$gameState.buildMode === 'BUNK'}>Beliche</button>
      <button on:click={startGame} class="p-2 bg-green-600 rounded ml-4 md:ml-8 font-bold">▶ INICIAR</button>
    </footer>
  {/if}
</div>

{#if $gameState.missionStatus === 'success' || $gameState.missionStatus === 'failed'}
  {/if}