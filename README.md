# Smart NPC Studio

Smart NPC Studio is a browser-based, strongly typed React application for creating, validating, editing, organizing, roleplaying, visualizing, and exporting connected Dungeons & Dragons NPCs. Generation is deterministic from a seed and uses the bundled lore catalogs; downstream systems consume the canonical NPC rather than duplicating its rules.

## Features

- Dependency-aware NPC, name, backstory, flavor, inventory, stat-block, and portrait-prompt generation
- Targeted consistency checks and section-level repair
- Responsive generator, preview, editor, workspace, dialogue, world, quest, item, stat-block, and export interfaces
- Local workspace with search, filters, folders, campaigns, favorites, archives, version history, and recovery copies
- Dialogue memory, relationship evolution, knowledge limits, and secret protection
- Player-safe and DM exports for JSON, Markdown, HTML/print, Foundry VTT, Roll20, and generic VTT
- Campaign worlds, factions, relationships, timelines, and evidence-linked quests

## Requirements and installation

- Node.js 24 LTS (Node 20.19+ or 22.12+ is also compatible with the Vite toolchain)
- npm

```bash
npm install
npm run dev
```

The development server prints its local URL. Production output is written to `dist/`.

## Commands

```bash
npm run dev        # development server
npm run typecheck  # TypeScript project validation
npm run lint       # ESLint and React Hooks checks
npm run test       # deterministic integration tests
npm run build      # typecheck and optimized production bundle
npm run verify     # complete release gate
npm run preview    # serve the production bundle locally
```

## Architecture

`src/SmartNPCGenerator` is the isolated application boundary:

```text
components/          Generator, preview, editor, workspace, and shared UI
constants/           Typed D&D lore and reusable content catalogs
features/            Dialogue, exports, items, quests, stats, visuals, and worlds
hooks/               UI orchestration and workspace integration
infrastructure/      Application error reporting
services/            Repository abstractions and local implementation
storage/             Replaceable storage-provider contract
types/               Canonical NPC and shared domain models
utils/generator/     Ordered generators, validation, repair, names, story, flavor
workspace/           Persistence metadata, queries, versions, and serialization
```

The data flow is `generate → validate → display/edit → save/version → contextual systems → export`. `NPC` is the canonical domain object. Workspace records add persistence metadata and optional flavor without changing the NPC schema. Feature services accept those existing objects through typed conversion boundaries.

Heavy dashboard, dialogue, portrait, backstory, and export interfaces are loaded on demand. Services remain UI-independent and deterministic where a seed or explicit ID/time factory is supplied.

## Data and security

The default provider stores workspace, dialogue memory, world data, images, and share records in the current browser profile. Player exports deny private structures by default, including secrets, DM notes, hidden motivations, private relationships, future hooks, and sensitive item evidence. Standalone HTML export escapes user-authored content.

Browser storage is not encrypted and must not be treated as a multi-user security boundary. Private browser share links are local convenience links, not authenticated remote sharing. For shared or sensitive deployments, implement the existing repository, storage, image-provider, and share-provider contracts with authenticated server-side providers, encryption at rest, authorization, audit logs, and backups.

If persisted workspace data is malformed, initialization fails safely and preserves the original payload under a timestamped recovery key rather than overwriting it.

## Testing

The integration suite exercises deterministic NPC generation, validation, flavor enrichment, save/load/edit/version/delete behavior, privacy-filtered exports, evidence-linked quest generation, dialogue secret protection, memory persistence, and relationship changes. Run `npm run verify` before release.

## Future expansion

Provider interfaces allow SQLite, Postgres, Supabase, Firebase, remote image services, authenticated sharing, PDF renderers, additional VTT adapters, and map renderers without moving generation rules into UI code. New work should extend canonical types and conversion boundaries instead of creating parallel NPC models.
