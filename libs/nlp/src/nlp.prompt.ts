export const buildPrompt = (input: { domains: string; subdomains: string[]; skills: string[]; description: string; yearsOfExperience?: string }) => {
  return `
You are a professional NLP keyword extraction system.

Your task:
Extract DOMAIN-SPECIFIC search keywords for indexing an expert profile.

Rules (STRICT):
- Do NOT explain anything
- Do NOT include generic or non-technical words
- Keywords MUST belong to the expert's actual professional domain
- Keywords MUST be relevant for semantic search
- Prefer technical nouns and noun phrases
- Avoid soft skills or vague terms
- Avoid duplicates
- Language: Persian (FA)

Priority order (most important first):
1. domains
2. subdomains
3. skills
4. description (only if it reinforces the above)

Expert structured data:
{
  "domains": "${input.domains}",
  "subdomains": ${JSON.stringify(input.subdomains)},
  "skills": ${JSON.stringify(input.skills)},
  "yearsOfExperience": "${input.yearsOfExperience ?? ''}"
}

Expert description:
"""
${input.description}
"""

Output format (JSON ONLY):
{
  "keywords": string[]
} `;
};
