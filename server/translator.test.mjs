import test from "node:test";
import assert from "node:assert/strict";
import { Translator } from "./translator.mjs";

test("translate uses translator", async () => {
  const mockTranslationPipeline = async (sent, opts) => [
    { translation_text: sent.toUpperCase() },
  ];

  const translator = new Translator(mockTranslationPipeline);
  const res = await translator.translate("en", "fr", "Hi there! Bye.");
  assert.strictEqual(res, "HI THERE! BYE.");
});
