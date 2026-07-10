import path from "path"

import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

import type { Locale } from "@/i18n/routing"
import { siteConfig, siteText } from "@/lib/site"
import { profileContent, techStack, type TimelineItem } from "@/lib/profile"

const fontsDir = path.join(process.cwd(), "src/fonts")

Font.register({
  family: "Geist",
  fonts: [
    { src: path.join(fontsDir, "Geist-400.ttf"), fontWeight: 400 },
    { src: path.join(fontsDir, "Geist-500.ttf"), fontWeight: 500 },
    { src: path.join(fontsDir, "Geist-600.ttf"), fontWeight: 600 },
  ],
})

Font.register({
  family: "Geist Mono",
  fonts: [
    { src: path.join(fontsDir, "GeistMono-400.ttf"), fontWeight: 400 },
    { src: path.join(fontsDir, "GeistMono-600.ttf"), fontWeight: 600 },
  ],
})

// Keine automatische Worttrennung — deutsche Komposita nicht mitten im Wort umbrechen.
Font.registerHyphenationCallback((word) => [word])

const zinc = {
  900: "#18181b",
  600: "#52525b",
  400: "#a1a1aa",
  200: "#e4e4e7",
}

// Maße 1:1 aus der /profil-Webansicht übernommen (px × 0.75 = pt).
const s = StyleSheet.create({
  page: {
    fontFamily: "Geist",
    fontSize: 7.5,
    color: zinc[900],
    backgroundColor: "#ffffff",
    paddingVertical: 31.2,
    paddingHorizontal: 39.7,
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: zinc[200],
    paddingBottom: 7.5,
  },
  topBarText: {
    fontFamily: "Geist Mono",
    fontSize: 6,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: zinc[400],
  },
  header: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
  },
  name: {
    fontFamily: "Geist Mono",
    fontSize: 20.25,
    fontWeight: 600,
  },
  tagline: {
    marginTop: 3,
    fontSize: 9.75,
    color: zinc[600],
  },
  intro: {
    marginTop: 10.5,
    maxWidth: 317,
    fontSize: 7.5,
    lineHeight: 1.625,
    color: zinc[600],
  },
  contactRow: {
    marginTop: 9,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  contactItem: {
    fontFamily: "Geist Mono",
    fontSize: 6.4,
    color: zinc[600],
  },
  photo: {
    width: 90.7,
    height: 90.7,
    borderRadius: 45.35,
    borderWidth: 1,
    borderColor: zinc[200],
    objectFit: "cover",
  },
  content: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: zinc[200],
    paddingTop: 15,
    flexDirection: "row",
    flexGrow: 1,
  },
  main: {
    flex: 1.55,
    paddingRight: 24,
  },
  side: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: zinc[200],
    paddingLeft: 18,
  },
  heading: {
    fontFamily: "Geist Mono",
    fontSize: 6.4,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: zinc[400],
  },
  serviceRow: {
    flexDirection: "row",
    gap: 6,
  },
  serviceIndex: {
    width: 12,
    paddingTop: 0.5,
    fontFamily: "Geist Mono",
    fontSize: 6.4,
    color: zinc[400],
  },
  itemTitle: {
    fontSize: 8.25,
    fontWeight: 600,
    lineHeight: 1.375,
  },
  itemNote: {
    marginTop: 1.5,
    fontSize: 7.1,
    lineHeight: 1.55,
    color: zinc[600],
  },
  micro: {
    fontFamily: "Geist Mono",
    fontSize: 6,
    color: zinc[400],
  },
  stackLine: {
    marginTop: 2,
    fontFamily: "Geist Mono",
    fontSize: 6,
    color: zinc[400],
  },
  techRow: {
    marginTop: 9,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 3.5,
  },
  techItem: {
    fontFamily: "Geist Mono",
    fontSize: 6,
    color: zinc[600],
  },
  sidePeriod: {
    fontFamily: "Geist Mono",
    fontSize: 6,
    color: zinc[400],
  },
  sideTitle: {
    marginTop: 1,
    fontSize: 7.5,
    fontWeight: 500,
    lineHeight: 1.375,
  },
  sideOrg: {
    fontSize: 6.75,
    color: zinc[600],
  },
  footer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: zinc[200],
    paddingTop: 7.5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontFamily: "Geist Mono",
    fontSize: 6,
    color: zinc[400],
  },
})

function SideTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <View style={{ marginTop: 9, gap: 9 }}>
      {items.map((item) => (
        <View key={item.period + item.title}>
          <Text style={s.sidePeriod}>{item.period}</Text>
          <Text style={s.sideTitle}>{item.title}</Text>
          {item.org ? <Text style={s.sideOrg}>{item.org}</Text> : null}
        </View>
      ))}
    </View>
  )
}

export type ProfilPdfLabels = {
  title: string
  stand: string
  schwerpunkte: string
  projekthistorie: string
  werdegang: string
  ausbildung: string
  techStack: string
}

export function ProfilPdf({
  locale,
  labels,
}: {
  locale: Locale
  labels: ProfilPdfLabels
}) {
  const { services, werdegang, ausbildung, projekte } = profileContent[locale]
  const { tagline, description } = siteText[locale]

  return (
    <Document
      title={`${siteConfig.name} — ${labels.title}`}
      author={siteConfig.name}
      subject={tagline}
      creator={siteConfig.brand}
    >
      <Page size="A4" style={s.page}>
        {/* Kopfzeile */}
        <View style={s.topBar}>
          <Text style={s.topBarText}>
            {siteConfig.brand} — {labels.title}
          </Text>
          <Text style={s.topBarText}>mxdigital.de</Text>
        </View>

        {/* Kopf */}
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{siteConfig.name}</Text>
            <Text style={s.tagline}>{tagline}</Text>
            <Text style={s.intro}>{description}</Text>
            <View style={s.contactRow}>
              <Text style={s.contactItem}>{siteConfig.email}</Text>
              <Text style={s.contactItem}>{siteConfig.phone}</Text>
              <Text style={s.contactItem}>mxdigital.de</Text>
            </View>
          </View>
          <Image
            src={path.join(process.cwd(), "public/marius_schaeffer.jpg")}
            style={s.photo}
          />
        </View>

        {/* Inhalt */}
        <View style={s.content}>
          {/* Hauptspalte */}
          <View style={s.main}>
            <View>
              <Text style={s.heading}>{labels.schwerpunkte}</Text>
              <View style={{ marginTop: 9, gap: 10.5 }}>
                {services.map((service) => (
                  <View key={service.title} style={s.serviceRow}>
                    <Text style={s.serviceIndex}>{service.index}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={s.itemTitle}>{service.title}</Text>
                      <Text style={s.itemNote}>{service.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ marginTop: 26 }}>
              <Text style={s.heading}>{labels.projekthistorie}</Text>
              <View style={{ marginTop: 9, gap: 12 }}>
                {projekte.map((p) => (
                  <View key={p.period + p.title}>
                    <Text style={s.micro}>
                      {p.period} · {p.industry} · {p.role}
                    </Text>
                    <Text style={[s.itemTitle, { marginTop: 1.5 }]}>
                      {p.title}
                    </Text>
                    <Text style={s.itemNote}>{p.note}</Text>
                    <Text style={s.stackLine}>{p.stack.join(" · ")}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Seitenspalte */}
          <View style={s.side}>
            <View>
              <Text style={s.heading}>{labels.werdegang}</Text>
              <SideTimeline items={werdegang} />
            </View>

            <View style={{ marginTop: 26 }}>
              <Text style={s.heading}>{labels.ausbildung}</Text>
              <SideTimeline items={ausbildung} />
            </View>

            <View style={{ marginTop: 26 }}>
              <Text style={s.heading}>{labels.techStack}</Text>
              <View style={s.techRow}>
                {techStack.map((tech, i) => (
                  <Text key={tech} style={s.techItem}>
                    {tech}
                    {i < techStack.length - 1 ? "  ·  " : ""}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Fußzeile */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            {siteConfig.name} · {siteConfig.brand} · mxdigital.de ·
            linkedin.com/in/mars-mx · github.com/mars-mx
          </Text>
          <Text style={s.footerText}>{labels.stand}</Text>
        </View>
      </Page>
    </Document>
  )
}
