// Chat-Session-Token: wird nach bestandener Turnstile-Challenge vom Backend
// ausgestellt (POST /api/chat/verify) und autorisiert alle weiteren
// /api/chat-Aufrufe. sessionStorage, damit die Challenge Navigationen
// überlebt, aber nicht das Schließen des Tabs.

const STORAGE_KEY = "mx-chat-session"

export function getChatSessionToken(): string | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { token, expiresAt } = JSON.parse(raw) as {
      token: string
      expiresAt: number
    }
    // 30 s Puffer, damit das Token nicht mitten im Request abläuft.
    if (!token || expiresAt * 1000 < Date.now() + 30_000) {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }
    return token
  } catch {
    return null
  }
}

export function saveChatSession(token: string, expiresAt: number) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ token, expiresAt }))
  } catch {
    // z. B. Safari im privaten Modus — dann eben pro Seite eine Challenge.
  }
}

export function clearChatSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // s. o.
  }
}
