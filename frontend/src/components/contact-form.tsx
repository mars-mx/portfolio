"use client"

import * as React from "react"
import { toast } from "sonner"

import { sendContact } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  const [pending, setPending] = React.useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    setPending(true)
    try {
      await sendContact({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
      })
      toast.success("Nachricht gesendet, danke! Ich melde mich.")
      form.reset()
    } catch (err) {
      toast.error("Konnte nicht gesendet werden.", {
        description: err instanceof Error ? err.message : undefined,
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required maxLength={100} autoComplete="name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Nachricht</Label>
        <Textarea id="message" name="message" required maxLength={5000} rows={5} />
      </div>
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Senden…" : "Nachricht senden"}
      </Button>
    </form>
  )
}
