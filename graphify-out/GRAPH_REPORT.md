# Graph Report - uno-multiplayer-master  (2026-09-27)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 222 nodes · 260 edges · 21 communities (11 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- package.json
- app.ts
- app.js
- output/app.js
- source_card_card
- output/board.compnent.js
- source/app.js
- db-model.js
- dependencies
- Game
- Game
- game.js
- compilerOptions
- Board
- Deck
- Players
- Deck
- Player
- Card
- Rules
- Card

## God Nodes (most connected - your core abstractions)
1. `Game` - 10 edges
2. `Game` - 10 edges
3. `compilerOptions` - 7 edges
4. `Player` - 5 edges
5. `Rules` - 5 edges
6. `Card()` - 5 edges
7. `Board` - 4 edges
8. `Deck` - 4 edges
9. `Players` - 4 edges
10. `Player` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Game` --references--> `source_deck_deck`  [EXTRACTED]
  source/game.ts →   _Bridges community 10 → community 1_

## Import Cycles
- None detected.

## Communities (21 total, 10 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (28): author, bugs, url, description, devDependencies, ts-loader, @types/express, @types/node (+20 more)

### Community 1 - "app.ts"
Cohesion: 0.10
Nodes (22): app, gameController, io, server, cardModel, cardSchema, chatModel, chatSchema (+14 more)

### Community 2 - "app.js"
Cohesion: 0.13
Nodes (17): adopt(), cors_1, db_model_1, dotenv_1, express_1, fulfilled(), game_1, http_1 (+9 more)

### Community 3 - "output/app.js"
Cohesion: 0.14
Nodes (11): cards, colorMap, contentBG, mainThemeAudio, players, _classCallCheck(), Deck(), _possibleConstructorReturn() (+3 more)

### Community 4 - "source_card_card"
Cohesion: 0.19
Nodes (5): source_card_card, Card, Deck, Player, Rules

### Community 5 - "output/board.compnent.js"
Cohesion: 0.23
Nodes (6): Board(), _classCallCheck(), _possibleConstructorReturn(), Card(), _classCallCheck(), _possibleConstructorReturn()

### Community 6 - "source/app.js"
Cohesion: 0.18
Nodes (10): app, cors_1, express_1, game, game_1, http_1, io, names (+2 more)

### Community 7 - "db-model.js"
Cohesion: 0.20
Nodes (9): cardModel, cardSchema, chatModel, chatSchema, gameModel, gameSchema, playerModel, playerSchema (+1 more)

### Community 8 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, babel-cli, babel-preset-react-app, cors, dotenv, express, mongoose, react (+2 more)

### Community 11 - "game.js"
Cohesion: 0.36
Nodes (7): adopt(), db_model_1, deck_1, fulfilled(), rejected(), rules_1, step()

### Community 12 - "compilerOptions"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, skipLibCheck, strict, target

## Knowledge Gaps
- **91 isolated node(s):** `author`, `url`, `description`, `ts-loader`, `@types/express` (+86 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 140 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mongoose` connect `app.ts` to `package.json`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Game` connect `Game` to `game.js`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `author`, `url`, `description` to the rest of the system?**
  _91 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `app.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09666666666666666 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._