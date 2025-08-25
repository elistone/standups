# Standup Random Outcome Entertainment App

A Vue 3 + TypeScript application providing small randomized "game show" style animations for ending a standup:
- Race
- Elimination
- Reveal

## Features
- Game selection menu
- Settings (player count 2–6, duration 1–60s)
- Pluggable game architecture
- Custom artwork + sounds (placeholders included)
- Deterministic random (optional seed, future enhancement)

## Development
```bash
pnpm install
pnpm dev
```

## Adding a Game
1. Create a folder under `src/games/<gameName>`.
2. Implement `GameDefinition` with lifecycle + render component.
3. Register game in `src/games/core/registry.ts`.

## Roadmap
- Seeded randomness toggle
- Asset pack loader
- Sound manager with global mute
- Theming system
- Score persistence