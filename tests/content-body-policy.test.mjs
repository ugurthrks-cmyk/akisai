import assert from "node:assert/strict";
import test from "node:test";
import { hasLegacyMarkdown } from "../src/lib/content-body-policy.ts";

test("only nonempty string markdown activates the legacy body", () => {
  for (const value of [undefined, null, "", "   ", "\n\t", 0, false, {}, []]) {
    assert.equal(hasLegacyMarkdown(value), false);
  }
  for (const value of ["## Başlık", "  Türkçe içerik\n", "<p>İçerik</p>"]) {
    assert.equal(hasLegacyMarkdown(value), true);
  }
});

test("body format decision matches the previous renderer for every supported input", () => {
  const oldDecision = (value) => typeof value === "string" && value.trim() ? value : undefined;
  for (const value of [undefined, null, "", " \n", " ## Başlık ", 42, {}, ["text"]]) {
    assert.equal(hasLegacyMarkdown(value), Boolean(oldDecision(value)));
    if (hasLegacyMarkdown(value)) assert.equal(value, oldDecision(value));
  }
});
