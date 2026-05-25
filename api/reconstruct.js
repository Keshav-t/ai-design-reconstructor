const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { base64, mediaType, style, format } = req.body;

  if (!base64 || !mediaType) {
    return res.status(400).json({ error: "Missing image data" });
  }

  const systemPrompt = `You are an elite design reconstruction AI.
When given an image, analyze it and reconstruct it as a clean, professional SVG.
Return ONLY a valid JSON object (no markdown, no fences) with this exact structure:
{
  "title": "short design title",
  "style": "detected style/genre",
  "colors": ["#hex1","#hex2","#hex3"],
  "description": "detailed reconstruction notes",
  "elements": ["list","of","detected","design","elements"],
  "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 700'>...complete svg...</svg>"
}
Rules:
- Remove ALL watermarks, text overlays, and branding from the output SVG
- Faithfully recreate the core artwork/design
- SVG must be complete, valid, and self-contained
- Use gradients, paths, and shapes to maximize quality
- Return ONLY the JSON object, nothing else`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 }
            },
            {
              type: "text",
              text: `Reconstruct this design. Style hint: ${style || "auto-detect"}. Output format: ${format || "print-ready"}. Remove all watermarks. Return ONLY valid JSON.`
            }
          ]
        }
      ]
    });

    const raw = message.content.map(b => b.text || "").join("");
    const clean = raw.replace(/```json|```/g, "").trim();

    // Validate JSON
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);

  } catch (err) {
    console.error("Claude API error:", err);
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: "Failed to parse AI response. Please try again." });
    }
    return res.status(500).json({ error: err.message || "Reconstruction failed" });
  }
};
