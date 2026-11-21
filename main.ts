// SPDX-License-Identifier: MIT
// Writes one short text to /output/entry.txt: a quiet room, held still,
// so the reader who meets it can slow down and arrive steady.

import { chmodSync, closeSync, mkdirSync, openSync, writeSync } from "node:fs";
import { join } from "node:path";

// The text itself. One scene, plain words, nothing telling the reader
// what to feel; the room does the work. Short sentences after the long
// opening one slow the reading down, beat by beat.
const ENTRY_TEXT =
  "Late light through the kitchen window, a mug warm between your hands, " +
  "a dog asleep in a square of sun. Nothing here is in a hurry. " +
  "The floor is solid, the kettle quiet now. " +
  "And when you stand, the room will still be there — steady, unhurried, ready.";

// Counts Unicode code points, not UTF-16 units or bytes.
function codePointCount(value: string): number {
  return [...value].length;
}

function fail(message: string): never {
  throw new Error(`entry refused: ${message}`);
}

function main(): void {
  const points = codePointCount(ENTRY_TEXT);
  if (points < 1 || points > 280) {
    fail(`text is ${points} code points, must be 1-280`);
  }
  if (!/\S/.test(ENTRY_TEXT)) {
    fail("text is only whitespace");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");

  const fd = openSync(target, "w", 0o644);
  try {
    writeSync(fd, ENTRY_TEXT, null, "utf8");
  } finally {
    closeSync(fd);
  }
  chmodSync(target, 0o644);
}

main();
