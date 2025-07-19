import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { Translator } from "./translator.js";

describe("Translator", () => {
  it("should handle single sentence with punctuation", async () => {
    const tSpy = mock.fn(async (sent) => [
      { translation_text: sent.toUpperCase() },
    ]);
    const tr = new Translator(tSpy);

    const res = await tr.translate("en", "fr", "Hello world!");
    assert.strictEqual(res, "HELLO WORLD!");
    assert.strictEqual(tSpy.mock.calls.length, 1);
    const [argSentence, argOpts] = tSpy.mock.calls[0].arguments;
    assert.strictEqual(argSentence, "Hello world");
    assert.deepStrictEqual(argOpts, { src_lang: "en", tgt_lang: "fr" });
  });

  it("should handle multiple sentences and spaces", async () => {
    const tSpy = mock.fn(async (sent) => [{ translation_text: sent }]);
    const tr = new Translator(tSpy);

    const input = "First one!   Second one?Third one.";
    const res = await tr.translate("de", "en", input);
    assert.strictEqual(res, "First one!   Second one?Third one.");

    assert.strictEqual(tSpy.mock.calls.length, 3);
    const calls = tSpy.mock.calls.map((c) => c.arguments[0]);
    assert.deepStrictEqual(calls, ["First one", "Second one", "Third one"]);
  });

  it("should ignore empty input gracefully", async () => {
    const tSpy = mock.fn();
    const tr = new Translator(tSpy);
    const res = await tr.translate("en", "es", "");
    assert.strictEqual(res, "");
    assert.strictEqual(tSpy.mock.calls.length, 0);
  });

  it("should translate without trailing punctuation", async () => {
    const tSpy = mock.fn(async (sent) => [{ translation_text: sent }]);
    const tr = new Translator(tSpy);
    const res = await tr.translate("en", "it", "No punctuation");
    assert.strictEqual(res, "No punctuation");
    assert.strictEqual(tSpy.mock.calls.length, 1);
  });
});
