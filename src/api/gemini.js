const ANALYSIS_PROMPT = `You are a video content analyst. Analyze the provided YouTube video thoroughly.

Return a JSON object with exactly this structure (NO markdown, NO code fences, ONLY valid JSON):

{
  "title": "Video title",
  "categories": ["category1", "category2"],
  "summary": "A concise 2-3 sentence summary of the video content.",
  "steps": [
    {
      "title": "Step title",
      "detail": "Detailed description of this step",
      "timestamp": "MM:SS or null if unknown"
    }
  ],
  "books": [
    {
      "title": "Book Title",
      "author": "Author Name",
      "context": "Why/how this book was mentioned"
    }
  ],
  "authors": [
    {
      "name": "Person Name",
      "context": "Who they are and why they were mentioned"
    }
  ],
  "resources": [
    {
      "name": "Resource name",
      "type": "tool|website|framework|course|podcast|other",
      "context": "How it was mentioned or recommended"
    }
  ]
}

RULES:
- categories should be from: Tutorial, Course, Review, Interview, Talk, Documentary, Lecture, How-To, Walkthrough, Discussion, Analysis, Demonstration, Workshop, Podcast, Vlog, Explainer, Case Study, Comparison, Deep Dive, Beginner, Intermediate, Advanced
- Pick 2-5 most relevant categories
- Extract ALL steps/instructions mentioned in the video, even implicit ones
- Extract ALL book references, even casual mentions
- Extract ALL people/authors mentioned, especially experts, researchers, authors
- Extract ALL tools, websites, frameworks, courses, and other resources mentioned
- If no steps exist, return empty array for steps
- If no books exist, return empty array for books
- Be thorough and complete — do NOT skip any mentioned resource`;

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Get YouTube video metadata via oEmbed
 */
export async function getVideoMeta(url) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Check if the Gemini API key is configured
 */
export async function checkApiKey() {
  try {
    const res = await fetch('/api/gemini');
    const data = await res.json();
    return data.configured;
  } catch {
    return false;
  }
}

/**
 * Analyze a YouTube video using Gemini AI
 */
export async function analyzeVideo(videoUrl) {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) {
    throw new Error('Invalid YouTube URL. Please paste a valid YouTube video link.');
  }

  const payload = {
    model: 'gemini-2.5-flash',
    contents: [
      {
        parts: [
          {
            text: ANALYSIS_PROMPT,
          },
          {
            fileData: {
              mimeType: 'video/youtube',
              fileUri: `https://www.youtube.com/watch?v=${videoId}`,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  };

  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error?.message || error.error || `API error: ${res.status}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || 'Gemini API error');
  }

  // Check for blocked content or safety filters
  const candidate = data.candidates?.[0];
  if (!candidate) {
    const blockReason = data.promptFeedback?.blockReason;
    if (blockReason) {
      throw new Error(`Content blocked by safety filter: ${blockReason}`);
    }
    throw new Error('No response from AI. The video may be unavailable or unsupported.');
  }

  if (candidate.finishReason === 'SAFETY') {
    throw new Error('Response blocked by safety filters. Try a different video.');
  }

  // Extract the text content from Gemini response
  const text = candidate.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from AI. The video may be too long or unavailable.');
  }

  // Try multiple parsing strategies
  return parseJsonResponse(text);
}

/**
 * Robustly parse JSON from an AI response that may contain extra text
 */
function parseJsonResponse(text) {
  // Strategy 1: Direct parse (works if responseMimeType is respected)
  try {
    return JSON.parse(text);
  } catch { /* continue */ }

  // Strategy 2: Strip markdown code fences
  const fenceStripped = text
    .replace(/^```(?:json)?\s*\n?/gm, '')
    .replace(/\n?```\s*$/gm, '')
    .trim();
  try {
    return JSON.parse(fenceStripped);
  } catch { /* continue */ }

  // Strategy 3: Find the first { ... } JSON object in the text
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch { /* continue */ }
  }

  // All strategies failed — show a snippet of the raw response for debugging
  const preview = text.substring(0, 200).replace(/\n/g, ' ');
  throw new Error(`Failed to parse AI response. Raw preview: "${preview}..."`);
}
