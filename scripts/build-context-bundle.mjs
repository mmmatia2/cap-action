#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT_PATH = join(ROOT, "CONTEXT_BUNDLE.md");

const fixedFiles = [
  "README.md",
  "CHANGELOG.md",
  "TEAM_LIBRARY_PROTOCOL.md"
];

function readSafe(path) {
  if (!existsSync(path)) {
    return null;
  }
  return readFileSync(path, "utf8");
}

function sectionForFile(relPath) {
  const fullPath = join(ROOT, relPath);
  const content = readSafe(fullPath);
  if (content == null) {
    return `## ${relPath}\n\n_Missing file_\n`;
  }
  return `## ${relPath}\n\n\`\`\`md\n${content.trim()}\n\`\`\`\n`;
}

function main() {
  const files = [...fixedFiles];
  const generatedAt = new Date().toISOString();

  const header = [
    "# Active Docs Bundle",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "This file is generated. It includes public active documentation only.",
    "Source of truth remains the individual docs in this repository.",
    ""
  ].join("\n");

  const body = files.map(sectionForFile).join("\n");
  const next = `${header}\n${body}`;

  writeFileSync(OUT_PATH, next, "utf8");
  console.log(`Wrote ${OUT_PATH}`);
}

main();
