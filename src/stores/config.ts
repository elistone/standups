import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
    state: () => ({
        selectedGameId: '' as string,
        playerCount: 4,
        playerNames: [] as string[],
        durationSeconds: 12
    }),
    actions: {
        setGame(id: string) { this.selectedGameId = id; },
        setPlayerCount(n: number) { this.playerCount = Math.min(6, Math.max(2, n)); },
        setDuration(seconds: number) {
            this.durationSeconds = Math.min(60, Math.max(1, seconds));
        },
        ensurePlayerNames() {
            if (this.playerNames.length < this.playerCount) {
                for (let i = this.playerNames.length; i < this.playerCount; i++) {
                    this.playerNames.push(`Player ${i + 1}`);
                }
            }
            if (this.playerNames.length > this.playerCount) {
                this.playerNames.length = this.playerCount;
            }
        }
    }
});