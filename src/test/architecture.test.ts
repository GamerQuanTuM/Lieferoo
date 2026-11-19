import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Enforces the module boundaries documented in docs/ARCHITECTURE.md:
 *   domain → imports nothing from the app
 *   shared → may use domain only
 *   features → talk to each other ONLY through `@/features/<name>` (the index.ts), never deep paths
 *   no import cycles between features
 */
const SRC = join(process.cwd(), "src");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(n) ? [p] : [];
  });
}

interface Imp { file: string; spec: string }
const rel = (p: string) => relative(SRC, p).replace(/\\/g, "/");
const files = walk(SRC).filter((f) => !/\.test\.ts$/.test(f) && !rel(f).startsWith("test/"));
const imports: Imp[] = files.flatMap((f) =>
  [...readFileSync(f, "utf8").matchAll(/(?:from|import)\s+["']([^"']+)["']/g)].map((m) => ({ file: rel(f), spec: m[1] })),
);
const featureOf = (path: string) => path.match(/^features\/([^/]+)\//)?.[1];

describe("architecture", () => {
  it("scans a plausible number of files", () => expect(files.length).toBeGreaterThan(20));

  it("domain imports nothing from the app", () => {
    const bad = imports.filter((i) => i.file.startsWith("domain/") && /^(@\/|\.\.)/.test(i.spec) && !i.spec.startsWith("@/domain"));
    expect(bad).toEqual([]);
  });

  it("shared only depends on domain/shared", () => {
    const bad = imports.filter((i) => i.file.startsWith("shared/") && /^@\/(features|data|app)/.test(i.spec));
    expect(bad).toEqual([]);
  });

  it("features never import the app shell", () => {
    expect(imports.filter((i) => i.file.startsWith("features/") && i.spec.startsWith("@/app"))).toEqual([]);
  });

  it("features use other features only through their index (no deep imports)", () => {
    const bad = imports.filter((i) => {
      const mine = featureOf(i.file);
      if (!mine || !i.spec.startsWith("@/features/")) return false;
      const [, , other, ...rest] = i.spec.split("/");
      return other !== mine && rest.length > 0;
    });
    expect(bad).toEqual([]);
  });

  it("features do not reach outside their folder with ../", () => {
    const bad = imports.filter((i) => featureOf(i.file) && i.spec.startsWith("../"));
    expect(bad).toEqual([]);
  });

  it("there are no import cycles between features", () => {
    const graph = new Map<string, Set<string>>();
    for (const i of imports) {
      const mine = featureOf(i.file);
      const other = i.spec.match(/^@\/features\/([^/]+)/)?.[1];
      if (mine && other && other !== mine) graph.set(mine, (graph.get(mine) ?? new Set()).add(other));
    }
    const visiting = new Set<string>();
    const done = new Set<string>();
    const cycle: string[] = [];
    const visit = (n: string, path: string[]) => {
      if (visiting.has(n)) { cycle.push([...path, n].join(" → ")); return; }
      if (done.has(n)) return;
      visiting.add(n);
      for (const m of graph.get(n) ?? []) visit(m, [...path, n]);
      visiting.delete(n);
      done.add(n);
    };
    for (const n of graph.keys()) visit(n, []);
    expect(cycle).toEqual([]);
  });

  it("every feature has an index.ts (its public API) and a README", () => {
    const features = readdirSync(join(SRC, "features")).filter((n) => statSync(join(SRC, "features", n)).isDirectory());
    for (const f of features) {
      const names = readdirSync(join(SRC, "features", f));
      expect(names, `${f}/index.ts`).toContain("index.ts");
      expect(names, `${f}/README.md`).toContain("README.md");
    }
  });
});
