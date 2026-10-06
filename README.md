# Low-Level Design in TypeScript

A TypeScript workspace for practicing and documenting Low-Level Design (LLD) problems.

## Structure

Each LLD lives in its own self-contained module under `src/`:

```text
src/
├── parking-lot/
│   ├── enums/
│   ├── factories/
│   ├── models/
│   ├── services/
│   ├── strategies/
│   ├── utils/
│   ├── __tests__/
│   ├── example.ts
│   └── index.ts
├── rate-limiter/
├── elevator/
└── ...
```

The goal is to keep every problem independent while sharing the same TypeScript tooling.

## LLDs

| Problem | Status |
| --- | --- |
| [Parking Lot](./src/parking-lot/README.md) | ✅ |
| Rate Limiter | Planned |

## Setup

```bash
pnpm install
pnpm typecheck
pnpm test
```

Run the Parking Lot example:

```bash
pnpm parking-lot
```

## Adding another LLD

Create a sibling folder under `src/` and follow the same boundaries where they make sense:

- `models/` — domain entities
- `enums/` — finite domain values
- `services/` — orchestration/application logic
- `strategies/` — interchangeable behavior
- `factories/` — object/strategy creation
- `utils/` — problem-specific utilities
- `__tests__/` — behavior-focused tests
- `example.ts` — runnable scenario
- `README.md` — design notes and trade-offs

Do not force folders or design patterns into an LLD that does not need them.
