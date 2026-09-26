## graphify

For any question about this repo's architecture, structure, components, or how to add/modify/find
code, your first action should be `graphify query "<question>"` when `graphify-out/graph.json`
exists. Use `graphify path "<A>" "<B>"` for relationship questions and `graphify explain "<concept>"`
for focused-concept questions. These return a scoped subgraph, usually much smaller than the full
report or raw grep output.

Triggers: "how do I…", "where is…", "what does … do", "add/modify a <component>",
"explain the architecture", or anything that depends on how files or classes relate.

If `graphify-out/wiki/index.md` exists, use it for broad navigation. Read `graphify-out/GRAPH_REPORT.md`
only for broad architecture review or when query/path/explain do not surface enough context. Only read
source files when (a) modifying/debugging specific code, (b) the graph lacks the needed detail, or
(c) the graph is missing or stale.

Type `/graphify` in Copilot Chat to build or update the graph.

## Development workflow

Follow this order for repository changes:

1. **GRAPH** - Query Graphify first to understand the relevant code and relationships.
2. **IMPACT** - Identify affected dependencies, callers, components, and tests.
3. **READ** - Read the relevant source code and nearby tests before deciding on a change.
4. **PLAN** - State the smallest viable solution and the validation that can disconfirm it.
5. **MODIFY** - Make the focused source change while preserving existing conventions and APIs.
6. **TEST** - Run the narrowest relevant test, typecheck, lint, or executable validation, then report any remaining gaps.

If Graphify is unavailable or its graph is missing or stale, do not claim that graph analysis was performed. State that the graph could not be queried and continue with normal codebase search and inspection.
