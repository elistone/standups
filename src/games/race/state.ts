import { ref, readonly } from 'vue';

// Shared reactive accessor for view (pulls from global module state)
const positionsRef = ref<number[]>([]);

export function useRaceState() {
    // Module bridging: the game logic mutates via an assigned callback.
    return {
        positions: readonly(positionsRef),
        _internalUpdate(newPositions: number[]) {
            positionsRef.value = newPositions;
        }
    };
}

// Wire into the game logic by monkey patching from index.ts
// (Simplest for initial skeleton; could be improved with an event bus.)
export function updatePositions(newPositions: number[]) {
    positionsRef.value = newPositions.slice();
}