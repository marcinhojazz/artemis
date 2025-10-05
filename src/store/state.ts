import { map } from 'nanores';

// Nosso estado agora é apenas um objeto com um placar.
export const gameState = map<{ score: number }>({
  score: 0,
});

// Ação para adicionar pontos.
export function addScore() {
  gameState.setKey('score', gameState.get().score + 1);
}

// Ação para zerar o placar.
export function resetScore() {
  gameState.setKey('score', 0);
}