import { pipeline } from "@huggingface/transformers";

export class Translator {
  constructor(translationPipeline) {
    this.translationPipeline = translationPipeline;
  }

  static async forProduction() {
    const defaultTranslationPipeline = await pipeline(
      "translation",
      "Xenova/nllb-200-distilled-600M",
    );

    return new Translator(defaultTranslationPipeline);
  }

  async translate(srcLang, tgtLang, text) {
    const sentences = this.#splitSentences(text);
    let translation = "";

    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i];
      const punctuation = sentences[i + 1] || "";
      const result = await this.translationPipeline(sentence, {
        src_lang: srcLang,
        tgt_lang: tgtLang,
      });

      translation += result[0].translation_text + punctuation;
    }

    return translation;
  }

  #splitSentences(text) {
    const regex = /([^.!?]+)([.!?]+\s*)*/g;
    const result = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const sentence = match[1].trim();
      const punctuation = match[2];
      if (sentence) {
        result.push(sentence, punctuation);
      }
    }

    return result;
  }
}
