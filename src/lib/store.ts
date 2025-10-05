import { map } from 'nanostores';

// Define a "forma" do nosso objeto de estado para ter tipagem forte
export interface GameState {
  score: number;
  status: 'playing' | 'gameOver';
}

// Cria o store usando `map` para um objeto.
// O store é exportado para que os componentes possam importá-lo.
export const gameState = map<GameState>({
  score: 0,
  status: 'playing',
});

// Ações exportadas são a maneira recomendada de modificar o estado.
// Isso evita que a lógica de negócio se espalhe pelos componentes.

/** Adiciona pontos ao placar e verifica a condição de fim de jogo. */
export function addScore(points: number) {
  // Apenas modifica o estado se o jogo estiver ativo
  if (gameState.get().status !== 'playing') return;

  const currentScore = gameState.get().score;
  gameState.setKey('score', currentScore + points);

  // Exemplo de lógica: o jogo termina ao atingir 50 pontos.
  if (gameState.get().score >= 50) {
    gameState.setKey('status', 'gameOver');
  }
}


/** Reinicia o estado do jogo para os valores iniciais. */
export function resetScore() {
    gameState.set({
        score: 0,
        status: 'playing',
    });
}