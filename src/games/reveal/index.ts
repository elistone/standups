import type { GameDefinition, GameRuntimeConfig, GameResult } from '../../types/game';
import { registerGame } from '../core/registry';
import { createRng } from '../../utils/random';

let winnerIndex = 0;
let revealAt = 0;
let revealed = false;

const RevealGame: GameDefinition = {
    id: 'reveal',
    displayName: 'Reveal',
    description: 'Magician reveals which hat hides the rabbit.',
    minPlayers: 2,
    maxPlayers: 6,
    component: () => import('./RevealView.vue'),
    init(config: GameRuntimeConfig) {
        const rng = createRng(config.seed);
        winnerIndex = Math.floor(rng.next() * config.players.length);
        revealAt = config.durationMs * 0.65 + rng.next() * config.durationMs * 0.2;
        revealed = false;
    },
    update({ t }) {
        if (!revealed && t >= revealAt) {
            revealed = true;
        }
    },
    tryGetResult({ progress }) {
        if (revealed || progress >= 0.95) {
            return {
                winnerIds: [winnerIndex],
                ranking: [winnerIndex]
            };
        }
    },
    dispose() { /* no state */ }
};

registerGame(RevealGame);