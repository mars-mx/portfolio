export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export type ContactPayload = {
  name: string
  email: string
  message: string
}

export async function sendContact(payload: ContactPayload): Promise<void> {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(detail || `Request failed (${res.status})`)
  }
}
