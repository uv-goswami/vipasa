from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

SKIP_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "build",
    "coverage",
    ".next",
    "out",
}

delete_mode = "--delete" in sys.argv


def should_skip(path: Path) -> bool:
    try:
        rel_parts = path.relative_to(ROOT).parts
    except ValueError:
        return True

    return any(part in SKIP_DIRS for part in rel_parts)


targets = []

# Find every .ts and .tsx file
for ts_file in list(ROOT.rglob("*.ts")) + list(ROOT.rglob("*.tsx")):
    if should_skip(ts_file):
        continue

    # Ignore TypeScript declaration files like user.d.ts
    if ts_file.name.endswith(".d.ts"):
        continue

    # For src/auth.ts, check src/auth.js
    js_file = ts_file.with_suffix(".js")

    # For src/auth.ts, also check src/auth.js.map
    js_map_file = ts_file.with_suffix(".js.map")

    for candidate in [js_file, js_map_file]:
        if candidate.exists() and not should_skip(candidate):
            targets.append(candidate)


# Remove duplicates
targets = sorted(set(targets))

if not targets:
    print("No matching .js build files found.")
    sys.exit(0)


for file in targets:
    rel = file.relative_to(ROOT)

    if delete_mode:
        file.unlink()
        print(f"Deleted: {rel}")
    else:
        print(f"Would delete: {rel}")


if not delete_mode:
    print()
    print("Dry run only. To actually delete, run:")
    print("python3 scripts/delete-build-js.py --delete")