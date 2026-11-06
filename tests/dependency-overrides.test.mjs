import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const cliRequire = createRequire(require.resolve("@sanity/cli"));

test("Sanity runtime's patched ZIP library can write and read UTF-8 content", () => {
  const runtimeRequire = createRequire(cliRequire.resolve("@sanity/runtime-cli"));
  const Zip = runtimeRequire("adm-zip");
  const archive = new Zip();
  archive.addFile("content.txt", Buffer.from("AkışAI güvenlik kontrolü", "utf8"));
  assert.equal(new Zip(archive.toBuffer()).readAsText("content.txt"), "AkışAI güvenlik kontrolü");
});

test("Vercel framework detection retains the js-yaml 3 safeLoad API", () => {
  const frameworkRequire = createRequire(cliRequire.resolve("@vercel/frameworks"));
  const yaml = frameworkRequire("js-yaml");
  assert.deepEqual(yaml.safeLoad("name: AkışAI\nbuild: npm run build\n"), {name: "AkışAI", build: "npm run build"});
});

test("typeid-js retains UUID generation and parsing through the patched dependency", () => {
  const { typeid, TypeID } = cliRequire("typeid-js");
  const id = typeid("tool");
  assert.equal(TypeID.fromString(id.toString()).toString(), id.toString());
  assert.equal(id.getType(), "tool");
});

test("both upgraded minimatch consumers retain matching and exclusion behavior", () => {
  for (const entry of [cliRequire.resolve("@oclif/core"), require.resolve("@typescript-eslint/typescript-estree")]) {
    const consumerRequire = createRequire(entry);
    const { minimatch } = consumerRequire("minimatch");
    assert.equal(minimatch("src/app/page.tsx", "src/**/*.tsx"), true);
    assert.equal(minimatch("src/app/page.css", "src/**/*.tsx"), false);
  }
});
