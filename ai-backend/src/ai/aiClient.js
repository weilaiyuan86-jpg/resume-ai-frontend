import OpenAI from "openai";
import {
  SYSTEM_PROMPT_GENERAL,
  buildCoverLetterPrompt,
  buildJobDescriptionPrompt,
  buildColdEmailPrompt,
} from "./aiPrompts.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || undefined,
});

const COMMON_PARAMS = {
  temperature: 0.6,
  top_p: 0.9,
  frequency_penalty: 0.2,
  presence_penalty: 0.0,
};

export async function generateCoverLetter(input) {
  const userPrompt = buildCoverLetterPrompt(input);

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL_COVER_LETTER || "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT_GENERAL },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 700,
    ...COMMON_PARAMS,
  });

  const content = completion.choices[0]?.message?.content || "";
  return postProcess(content);
}

export async function generateJobDescription(input) {
  const userPrompt = buildJobDescriptionPrompt(input);

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL_JOB_DESCRIPTION || "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT_GENERAL },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 1100,
    ...COMMON_PARAMS,
  });

  const content = completion.choices[0]?.message?.content || "";
  return postProcess(content);
}

export async function generateColdEmail(input) {
  const userPrompt = buildColdEmailPrompt(input);

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL_COLD_EMAIL || "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT_GENERAL },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 450,
    ...COMMON_PARAMS,
  });

  const content = completion.choices[0]?.message?.content || "";
  return postProcess(content);
}

function postProcess(text) {
  let result = (text || "").trim();

  const patterns = [
    /As an AI language model[, ]?/gi,
    /作为一名AI语言模型[,，]?/gi,
    /作为一个AI助手[,，]?/gi,
  ];

  for (const pattern of patterns) {
    result = result.replace(pattern, "");
  }

  result = result.replace(/```[a-z]*\n?/gi, "").replace(/```$/gi, "");

  return result.trim();
}

