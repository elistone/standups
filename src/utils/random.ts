// Simple seedable PRNG (Mulberry32) for optional determinism
export function createRng(seed: string | number | undefined) {
    if (seed === undefined) {
        return {
            next: () => Math.random()
        };
    }
    let s = typeof seed === 'number' ? seed : hashStr(seed);
    return {
        next: () => {
            s |= 0; s = (s + 0x6D2B79F5) | 0;
            let t = Math.imul(s ^ (s >>> 15), 1 | s);
            t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        }
    };
}

function hashStr(str: string) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return (h ^ (h >>> 16)) >>> 0;
}