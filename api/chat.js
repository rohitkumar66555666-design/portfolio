import { ROHIT_PROFILE_CONTEXT } from '../src/config/aiProfile.js'

/**
 * Vercel Serverless Function: POST /api/chat
 *
 * Proxies chat messages to Groq's OpenAI-compatible endpoint with
 * ROHIT_PROFILE_CONTEXT injected as the system message server-side, so
 * visitors can't strip or tamper with the persona prompt.
 *
 * Env vars (set locally in .env.local and in Vercel dashboard):
 *   GROQ_API_KEY  — required (https://console.groq.com/keys)
 *   GROQ_MODEL    — optional, defaults to llama-3.3-70b-versatile
 *
 * Response shape:
 *   { live: true,  reply: string }  → real LLM answer
 *   { live: false, error?: string } → client should fall back to local KB
 */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ live: false, error: 'Method not allowed' })
  }

  const { messages } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ live: false, error: 'Missing messages array' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    // No key configured (e.g. local dev without .env.local) — let the
    // client fall back to its built-in knowledge base.
    return res.status(200).json({ live: false, error: 'GROQ_API_KEY not configured' })
  }

  // Keep only the recent turns, sanitize roles/content, cap payload size.
  const MAX_TURNS = 12
  const MAX_CHARS = 4000
  const history = messages
    .filter(
      (m) =>
        m &&
        typeof m.content === 'string' &&
        m.content.trim() !== '' &&
        (m.role === 'user' || m.role === 'assistant')
    )
    .slice(-MAX_TURNS)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_CHARS),
    }))

  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return res.status(400).json({ live: false, error: 'No user message found' })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: ROHIT_PROFILE_CONTEXT }, ...history],
        temperature: 0.6,
        max_tokens: 400,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      console.error(`Groq API error ${response.status}: ${errText.slice(0, 300)}`)
      return res
        .status(502)
        .json({ live: false, error: 'Upstream LLM request failed' })
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      return res.status(502).json({ live: false, error: 'Empty LLM response' })
    }

    return res.status(200).json({ live: true, reply })
  } catch (err) {
    console.error('Groq request failed:', err?.name, err?.message)
    return res.status(502).json({ live: false, error: 'LLM request failed' })
  }
}
