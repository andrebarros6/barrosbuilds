/**
 * House rule: no em dashes in anything a visitor or reader sees. This scans
 * the site's source (pages, components, product data, email copy and the
 * Learning Log content) with comments stripped, so notes for developers are
 * exempt but every string and every bit of JSX text is covered.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const ROOTS = ["app", "components", "lib", "content"];
const EM_DASH = "—";

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(tsx?|mjs|md)$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
}

function stripComments(source) {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // JSX comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // block comments
    .replace(/<!--[\s\S]*?-->/g, "") // HTML comments in Markdown
    .replace(/^\s*\/\/.*$/gm, ""); // whole-line comments
}

test("no em dashes in site or email copy", () => {
  const hits = [];
  for (const file of ROOTS.flatMap(files)) {
    stripComments(readFileSync(file, "utf8"))
      .split("\n")
      .forEach((line) => {
        if (line.includes(EM_DASH)) hits.push(`${file}: ${line.trim().slice(0, 100)}`);
      });
  }
  assert.deepEqual(hits, []);
});
