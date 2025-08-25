export type Player = {
    id: number;
    name: string;
    color?: string;
    avatarUrl?: string;
};

export interface GameRuntimeConfig {
    players: Player[];
    durationMs: number;
    seed?: string;
}

export interface GameResult {
    winnerIds: number[]; // first candidate(s)
    ranking?: number[];  // ordered player ids
    meta?: Record<string, unknown>;
}

export interface GameFrameState {
    t: number; // elapsed ms
    progress: number; // 0..1
}

export interface GameDefinition {
    id: string;
    displayName: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    // approximate recommended min & max duration (for UI guidance)
    recommendedDurations?: [number, number];
    // Vue component that handles rendering
    component: () => Promise<unknown>;
    // Initialize internal state (returned value kept by runner)
    init(config: GameRuntimeConfig): void | object;
    // Called each frame with monotonic time
    update?(state: GameFrameState): void;
    // Provide result early if concluded; return undefined to continue.
    tryGetResult?(state: GameFrameState): GameResult | undefined;
    // Called when user aborts or after result shown
    dispose?(): void;
    // Optional: dramatic finish extension
    extendDurationMs?(base: number): number;
}