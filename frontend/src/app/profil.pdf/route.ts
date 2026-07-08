import { createElement, type ReactElement } from "react"
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer"

import { ProfilPdf } from "@/components/profil-pdf"

export async function GET() {
  const now = new Date()
  const stand = new Intl.DateTimeFormat("de-DE", {
    month: "long",
    year: "numeric",
  }).format(now)

  const datum = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
  const filename = `${datum}_Profil_Marius_Schäffer.pdf`
  const filenameAscii = `${datum}_Profil_Marius_Schaeffer.pdf`

  const buffer = await renderToBuffer(
    createElement(ProfilPdf, { stand }) as ReactElement<DocumentProps>
  )

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filenameAscii}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  })
}
