import test from "node:test";
import assert from "node:assert/strict";
import { Translator } from "./translator.mjs";

test("translate uses translator", async (context) => {
  const translationPipelineSpy = context.mock.fn(async (sent, opts) => [
    { translation_text: sent.toUpperCase() },
  ]);

  const translator = new Translator(translationPipelineSpy);
  const res = await translator.translate("en", "fr", "Hi there! Bye.");
  assert.strictEqual(res, "HI THERE! BYE.");

  assert.strictEqual(translationPipelineSpy.mock.calls.length, 2);

  const firstCall = translationPipelineSpy.mock.calls[0];
  assert.strictEqual(firstCall.arguments[0], "Hi there");
  assert.deepStrictEqual(firstCall.arguments[1], {
    src_lang: "en",
    tgt_lang: "fr",
  });

  const secondCall = translationPipelineSpy.mock.calls[1];
  assert.strictEqual(secondCall.arguments[0], "Bye");
  assert.deepStrictEqual(secondCall.arguments[1], {
    src_lang: "en",
    tgt_lang: "fr",
  });
});
