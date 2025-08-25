import type { GameDefinition } from '../../types/game';

const registry: Record<string, GameDefinition> = {};

/**
 * Register a game definition. Usually called at module top-level inside each game folder.
 */
export function registerGame(def: GameDefinition) {
    if (registry[def.id]) {
        console.warn(`Game with id '${def.id}' already registered, overwriting.`);
    }
    registry[def.id] = def;
}

export function listGames(): GameDefinition[] {
    return Object.values(registry);
}

export function getGame(id: string): GameDefinition | undefined {
    return registry[id];
}