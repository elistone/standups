import type { GameDefinition, GameRuntimeConfig, GameResult } from '../../types/game';
import { registerGame } from '../core/registry';
import { createRng } from '../../utils/random';
import { updatePositions } from './state';

interface RunnerState {
    finishOrder: number[];
    finishedSet: Set<number>;
    positions: number[];
    rng: ReturnType<typeof createRng>;
}

let state: RunnerState | null = null;
let configRef: GameRuntimeConfig | null = null;

const RaceGame: GameDefinition = {
    id: 'race',
    displayName: 'Race',
    description: 'Characters race across the screen; random finish order.',
    minPlayers: 2,
    maxPlayers: 6,
    recommendedDurations: [5, 20],
    component: () => import('./RaceView.vue'),
    init(config) {
        configRef = config;
        const rng = createRng(config.seed);
        state = {
            finishOrder: [],
            finishedSet: new Set(),
            positions: config.players.map(() => 0),
            rng
        };
    },
    update({ progress }) {
        if (!state || !configRef) return;
        const baseSpeed = 0.004 + (configRef.players.length * 0.0003);
        state.positions = state.positions.map((p, i) => {
            if (state!.finishedSet.has(i)) return p;
            const variance = (state!.rng.next() - 0.5) * 0.01;
            let next = p + baseSpeed + variance;
            if (next >= 1 && !state!.finishedSet.has(i)) {
                next = 1;
                state!.finishedSet.add(i);
                state!.finishOrder.push(i);
            }
            return Math.min(1, Math.max(0, next));
        });
    },
    tryGetResult({ progress }): GameResult | undefined {
        if (!state || !configRef) return;
        if (state.finishOrder.length === configRef.players.length) {
            return {
                winnerIds: [state.finishOrder[0]],
                ranking: [...state.finishOrder]
            };
        }
        if (progress >= 1) {
            // Time expired -> rank by distance
            const ranking = state.positions
                .map((p, i) => ({ p, i }))
                .sort((a, b) => b.p - a.p)
                .map(r => r.i);
            return {
                winnerIds: [ranking[0]],
                ranking
            };
        }
    },
    dispose() {
        state = null;
        configRef = null;
    },
    extendDurationMs(base) {
        // Add a small suspense tail (10%) for finishers.
        return base * 1.1;
    }
};

registerGame(RaceGame);