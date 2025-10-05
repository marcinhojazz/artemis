import { map } from 'nanostores';

// --- TIPOS E CONSTANTES DO JOGO ---
const MISSION_DURATION_DAYS = 30;
const SECONDS_PER_DAY = 10;
const NEGATIVE_RESOURCE_LIMIT_SECONDS = 20;

export type ModuleType = 'SOLAR_PANEL' | 'O2_GENERATOR' | 'BUNK';
export interface PlacedModule {
  id: number;
  type: ModuleType;
  position: [number, number, number];
}
export interface CrewMember {
  id: number;
  sleep: number;
}
export type Subsystem = 'ECLSS' | 'ILUMINACAO' | 'COZINHA' | 'COMUNICACAO';
export type SubsystemStatus = 'online' | 'offline';

export interface GameState {
  missionStatus: 'planning' | 'running' | 'failed' | 'success';
  missionTime: number; // em segundos
  modules: PlacedModule[];
  crew: CrewMember[];
  resources: {
    energy: { generated: number; consumed: number };
    oxygen: { generated: number; consumed: number };
  };
  failTimers: { energy: number; oxygen: number };
  buildMode: ModuleType | null;
  subsystems: Record<Subsystem, { status: SubsystemStatus, consumption: number }>;
}

// --- STORE INICIAL ---
export const gameState = map<GameState>({
  missionStatus: 'planning',
  missionTime: 0,
  modules: [],
  crew: [{ id: 1, sleep: 100 }, { id: 2, sleep: 100 }],
  resources: { energy: { generated: 0, consumed: 0 }, oxygen: { generated: 0, consumed: 0 } },
  failTimers: { energy: 0, oxygen: 0 },
  buildMode: null,
  subsystems: {
    'ECLSS': { status: 'online', consumption: 2 },
    'ILUMINACAO': { status: 'online', consumption: 0.5 },
    'COZINHA': { status: 'online', consumption: 1 },
    'COMUNICACAO': { status: 'online', consumption: 1 },
  }
});

// --- AÇÕES ---
export function setBuildMode(mode: ModuleType | null) {
  gameState.setKey('buildMode', mode);
}

export function toggleSubsystem(system: Subsystem) {
  const currentSubsystems = gameState.get().subsystems;
  const currentStatus = currentSubsystems[system].status;
  const newSubsystems = { ...currentSubsystems };
  newSubsystems[system].status = currentStatus === 'online' ? 'offline' : 'online';
  gameState.setKey('subsystems', newSubsystems);
  calculateResources();
}

function calculateResources() {
  const state = gameState.get();
  let energyGenerated = 0, energyConsumed = 0, oxygenGenerated = 0;
  state.modules.forEach(m => {
    if (m.type === 'SOLAR_PANEL') energyGenerated += 25;
    if (m.type === 'O2_GENERATOR') { energyConsumed += 15; oxygenGenerated += 20; }
    if (m.type === 'BUNK') energyConsumed += 5;
  });
  Object.values(state.subsystems).forEach(system => {
    if (system.status === 'online') {
      energyConsumed += system.consumption;
    }
  });
  const oxygenConsumed = 10;
  gameState.setKey('resources', {
    energy: { generated: energyGenerated, consumed: energyConsumed },
    oxygen: { generated: oxygenGenerated, consumed: oxygenConsumed },
  });
}

export function addModule(type: ModuleType, position: [number, number, number]) {
  const newModule: PlacedModule = { id: Date.now(), type, position };
  gameState.setKey('modules', [...gameState.get().modules, newModule]);
  setBuildMode(null);
  calculateResources();
}

export function startGame() {
  gameState.setKey('missionStatus', 'running');
}

export function resetGame() {
    gameState.set({
      missionStatus: 'planning',
      missionTime: 0,
      modules: [],
      crew: [{ id: 1, sleep: 100 }, { id: 2, sleep: 100 }],
      resources: { energy: { generated: 0, consumed: 0 }, oxygen: { generated: 0, consumed: 0 } },
      failTimers: { energy: 0, oxygen: 0 },
      buildMode: null,
      // ===== AJUSTE NECESSÁRIO ESTÁ AQUI =====
      // Adicionamos a propriedade `subsystems` para que o objeto
      // corresponda à interface `GameState`.
      subsystems: {
        'ECLSS': { status: 'online', consumption: 2 },
        'ILUMINACAO': { status: 'online', consumption: 0.5 },
        'COZINHA': { status: 'online', consumption: 1 },
        'COMUNICACAO': { status: 'online', consumption: 1 },
      }
    });
}

// O MOTOR DO JOGO: CHAMADO A CADA SEGUNDO
export function gameTick() {
  const state = gameState.get();
  if (state.missionStatus !== 'running') return;

  const newTime = state.missionTime + 1;

  // 1. Lógica da Tripulação
  let bunksAvailable = state.modules.filter(m => m.type === 'BUNK').length;
  const newCrew = [...state.crew].sort((a, b) => a.sleep - b.sleep);
  newCrew.forEach(member => {
    if (bunksAvailable > 0) {
      member.sleep = Math.min(100, member.sleep + 5);
      bunksAvailable--;
    } else {
      member.sleep = Math.max(0, member.sleep - 1);
    }
  });

  // 2. Lógica de Recursos e Falha
  const energyBalance = state.resources.energy.generated - state.resources.energy.consumed;
  const oxygenBalance = state.resources.oxygen.generated - state.resources.oxygen.consumed;
  const newFailTimers = { ...state.failTimers };
  energyBalance < 0 ? newFailTimers.energy++ : newFailTimers.energy = 0;
  oxygenBalance < 0 ? newFailTimers.oxygen++ : newFailTimers.oxygen = 0;

  if (newCrew.some(m => m.sleep <= 0) || newFailTimers.energy >= NEGATIVE_RESOURCE_LIMIT_SECONDS || newFailTimers.oxygen >= NEGATIVE_RESOURCE_LIMIT_SECONDS) {
    gameState.setKey('missionStatus', 'failed');
    return;
  }

  // 3. Lógica de Vitória
  const missionDay = Math.floor(newTime / SECONDS_PER_DAY);
  if (missionDay >= MISSION_DURATION_DAYS) {
    gameState.setKey('missionStatus', 'success');
    return;
  }

  // 4. Salva o novo estado
  gameState.set({
    ...state,
    missionTime: newTime,
    crew: newCrew.sort((a, b) => a.id - b.id),
    failTimers: newFailTimers,
  });
}