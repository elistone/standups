import type { GameDefinition, GameRuntimeConfig, GameResult } from '../../types/game';
import { registerGame } from '../core/registry';
import { createRng } from '../../utils/random';

interface EliminState {
    alive: boolean[];
    heights: number[];
    rng: ReturnType<typeof createRng>;
    popTimes: number[]; // ms each will pop unless last
}

let state: EliminState | null = null;
let configRef: GameRuntimeConfig | null = null;

const EliminationGame: GameDefinition = {
    id: 'elimination',
    displayName: 'Elimination',
    description: 'Balloons rise and pop until one remains.',
    minPlayers: 2,
    maxPlayers: 6,
    component: () => import('./EliminationView.vue'),
    init(config) {
        configRef = config;
        const rng = createRng(config.seed);
        const popTimes = config.players.map(() => {
            const variance = rng.next();
            return variance * (config.durationMs * 0.9); // random pop time within 90% of duration
        });
        state = {
            alive: config.players.map(() => true),
            heights: config.players.map(() => 0),
            rng,
            popTimes
        };
    },
    update({ t }) {
        if (!state || !configRef) return;
        const total = configRef.durationMs;
        state.heights = state.heights.map((h, i) => {
            if (!state!.alive[i]) return h;
            const target = Math.min(1, t / total + state!.rng.next() * 0.002);
            return Math.min(1, Math.max(h, target));
        });
        // Pop logic
        state.alive.forEach((alive, i) => {
            if (!alive) return;
            if (t >= state!.popTimes[i]) {
                // If more than one alive, pop this one
                const remaining = state!.alive.filter(Boolean).length;
                if (remaining > 1) {
                    state!.alive[i] = false;
                }
            }
        });
    },
    tryGetResult({ progress }) {
        if (!state || !configRef) return;
        const remaining = state.alive
            .map((alive, i) => ({ alive, i }))
            .filter(r => r.alive)
            .map(r => r.i);
        if (remaining.length === 1) {
            return {
                winnerIds: [remaining[0]],
                ranking: [
                    remaining[0],
                    ...state.alive
                        .map((alive, i) => ({ alive, i }))
                        .filter(r => !r.alive)
                        .map(r => r.i)
                ]
            };
        }
        if (progress >= 1 && remaining.length > 0) {
            // Timeout - pick random among remaining
            return {
                winnerIds: [remaining[Math.floor(Math.random() * remaining.length)]],
                ranking: remaining
            };
        }
    },
    dispose() { state = null; configRef = null; }
};

registerGame(EliminationGame);