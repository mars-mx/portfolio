import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { localeAlternates } from "@/i18n/alternates"
import type { Locale } from "@/i18n/routing"
import { PageShell } from "@/components/page-shell"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "datenschutz" })

  return {
    title: t("metaTitle"),
    alternates: localeAlternates(locale, "/datenschutz"),
  }
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="pt-6 text-lg font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  )
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="pt-2 font-medium text-foreground">{children}</h3>
}

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("datenschutz")
  const tLegal = await getTranslations("legal")

  return (
    <PageShell title={t("title")}>
      {/* Rechtstext bleibt deutsch — auf EN nur ein Hinweis. */}
      {locale === "en" ? <p className="text-sm italic">{tLegal("germanOnly")}</p> : null}
      <H2>1) Einleitung und Kontaktdaten des Verantwortlichen</H2>
      <p>
        1.1 Wir freuen uns, dass du unsere Website besuchst und bedanken uns für
        dein Interesse. Im Folgenden informieren wir dich über den Umgang mit
        deinen personenbezogenen Daten bei der Nutzung unserer Website.
        Personenbezogene Daten sind hierbei alle Daten, mit denen du persönlich
        identifiziert werden kannst.
      </p>
      <p>
        1.2 Verantwortlicher für die Datenverarbeitung auf dieser Website im
        Sinne der Datenschutz-Grundverordnung (DSGVO) ist Marius Schäffer, MX
        Digital, Hollerallee 87, 28209 Bremen, Deutschland, Tel.:
        015251600215, E-Mail: marius@mxdigital.de. Der für die Verarbeitung von
        personenbezogenen Daten Verantwortliche ist diejenige natürliche oder
        juristische Person, die allein oder gemeinsam mit anderen über die
        Zwecke und Mittel der Verarbeitung von personenbezogenen Daten
        entscheidet.
      </p>

      <H2>2) Datenerfassung beim Besuch unserer Website</H2>
      <p>
        2.1 Bei der bloß informatorischen Nutzung unserer Website, also wenn du
        dich nicht registrierst oder uns anderweitig Informationen übermittelst,
        erheben wir nur solche Daten, die dein Browser an den Seitenserver
        übermittelt (sog. „Server-Logfiles“). Wenn du unsere Website aufrufst,
        erheben wir die folgenden Daten, die für uns technisch erforderlich
        sind, um dir die Website anzuzeigen:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Unsere besuchte Website</li>
        <li>Datum und Uhrzeit zum Zeitpunkt des Zugriffs</li>
        <li>Menge der gesendeten Daten in Byte</li>
        <li>Quelle/Verweis, von welchem du auf die Seite gelangtest</li>
        <li>Verwendeter Browser</li>
        <li>Verwendetes Betriebssystem</li>
        <li>Verwendete IP-Adresse (ggf.: in anonymisierter Form)</li>
      </ul>
      <p>
        Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis
        unseres berechtigten Interesses an der Verbesserung der Stabilität und
        Funktionalität unserer Website. Eine Weitergabe oder anderweitige
        Verwendung der Daten findet nicht statt. Wir behalten uns allerdings
        vor, die Server-Logfiles nachträglich zu überprüfen, sollten konkrete
        Anhaltspunkte auf eine rechtswidrige Nutzung hinweisen.
      </p>
      <p>
        2.2 Diese Website nutzt aus Sicherheitsgründen und zum Schutz der
        Übertragung personenbezogener Daten und anderer vertraulicher Inhalte
        (z.B. Bestellungen oder Anfragen an uns) eine SSL- bzw.
        TLS-Verschlüsselung. Du kannst eine verschlüsselte Verbindung an der
        Zeichenfolge „https://“ und dem Schloss-Symbol in deiner Browserzeile
        erkennen.
      </p>

      <H2>3) Hosting &amp; Content-Delivery-Network</H2>
      <p>
        3.1 Für das Hosting unserer Website und die Darstellung der
        Seiteninhalte nutzen wir einen Anbieter, der seine Leistungen selbst
        oder durch ausgewählte Sub-Unternehmer ausschließlich auf Servern
        innerhalb der Europäischen Union erbringt.
      </p>
      <p>
        Sämtliche auf unserer Website erhobenen Daten werden auf diesen Servern
        verarbeitet.
      </p>
      <p>
        Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag
        geschlossen, der den Schutz der Daten unserer Seitenbesucher
        sicherstellt und eine unberechtigte Weitergabe an Dritte untersagt.
      </p>
      <H3>3.2 Cloudflare</H3>
      <p>
        Wir nutzen ein Content Delivery Network des folgenden Anbieters:
        Cloudflare Inc., 101 Townsend St. San Francisco, CA 94107, USA
      </p>
      <p>
        Dieser Dienst ermöglicht uns, große Mediendateien wie Grafiken,
        Seiteninhalte oder Skripte über ein Netz regional verteilter Server
        schneller auszuliefern. Die Verarbeitung erfolgt zur Wahrung unseres
        berechtigten Interesses an der Verbesserung der Stabilität und
        Funktionalität unserer Website gem. Art. 6 Abs. 1 lit. f DSGVO. Wir
        haben mit dem Anbieter einen Auftragsverarbeitungsvertrag geschlossen,
        der den Schutz der Daten unserer Seitenbesucher sicherstellt und eine
        unberechtigte Weitergabe an Dritte untersagt.
      </p>
      <p>
        Für Datenübermittlungen in die USA hat sich der Anbieter dem
        EU-US-Datenschutzrahmen (EU-US Data Privacy Framework) angeschlossen,
        das auf Basis eines Angemessenheitsbeschlusses der Europäischen
        Kommission die Einhaltung des europäischen Datenschutzniveaus
        sicherstellt.
      </p>

      <H2>4) Cookies</H2>
      <p>
        Um den Besuch unserer Website attraktiv zu gestalten und die Nutzung
        bestimmter Funktionen zu ermöglichen, verwenden wir Cookies, also
        kleine Textdateien, die auf deinem Endgerät abgelegt werden. Teilweise
        werden diese Cookies nach Schließen des Browsers automatisch wieder
        gelöscht (sog. „Session-Cookies“), teilweise verbleiben diese Cookies
        länger auf deinem Endgerät und ermöglichen das Speichern von
        Seiteneinstellungen (sog. „persistente Cookies“). Im letzteren Fall
        kannst du die Speicherdauer der Übersicht zu den Cookie-Einstellungen
        deines Webbrowsers entnehmen.
      </p>
      <p>
        Sofern durch einzelne von uns eingesetzte Cookies auch personenbezogene
        Daten verarbeitet werden, erfolgt die Verarbeitung gemäß Art. 6 Abs. 1
        lit. b DSGVO entweder zur Durchführung des Vertrages, gemäß Art. 6
        Abs. 1 lit. a DSGVO im Falle einer erteilten Einwilligung oder gemäß
        Art. 6 Abs. 1 lit. f DSGVO zur Wahrung unserer berechtigten Interessen
        an der bestmöglichen Funktionalität der Website sowie einer
        kundenfreundlichen und effektiven Ausgestaltung des Seitenbesuchs.
      </p>
      <p>
        Du kannst deinen Browser so einstellen, dass du über das Setzen von
        Cookies informiert wirst und einzeln über deren Annahme entscheiden
        oder die Annahme von Cookies für bestimmte Fälle oder generell
        ausschließen kannst.
      </p>
      <p>
        Bitte beachte, dass bei Nichtannahme von Cookies die Funktionalität
        unserer Website eingeschränkt sein kann.
      </p>

      <H2>5) Kontaktaufnahme</H2>
      <H3>5.1 Eigenes Live-Chat-System</H3>
      <p>
        Diese Webseite nutzt ein Live-Chat-System, das der Beantwortung von
        Live-Anfragen dient.
      </p>
      <p>
        Die Verarbeitung von über den Chat übermittelten personenbezogenen
        Daten erfolgt entweder gemäß Art. 6 Abs. 1 lit. b DSGVO, weil es für
        die Vertragsanbahnung oder -durchführung erforderlich ist, oder gemäß
        Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an
        der effektiven Betreuung unserer Seitenbesucher. Deine so übermittelten
        Daten werden vorbehaltlich entgegenstehender gesetzlicher
        Aufbewahrungsfristen gelöscht, wenn der betroffene Sachverhalt
        abschließend geklärt ist.
      </p>
      <p>
        Zusätzlich können zum Zwecke der Erstellung pseudonymisierter
        Nutzungsprofile mithilfe von Cookies weitere Informationen erhoben und
        ausgewertet werden, die allerdings nicht deiner persönlichen
        Identifikation dienen und nicht mit anderen Datensätzen zusammengeführt
        werden. Sofern diese Informationen einen Personenbezug aufweisen,
        erfolgt die Verarbeitung gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis
        unseres berechtigten Interesses an der statistischen Analyse des
        Nutzerverhaltens zu Optimierungszwecken.
      </p>
      <p>
        Das Setzen von Cookies kann durch entsprechende Browsereinstellungen
        verhindert werden. Gegebenenfalls wird die Funktionalität unserer
        Internetseite in diesem Fall aber eingeschränkt. Der Datenerhebung und
        -speicherung zum Zwecke der Erstellung eines pseudonymisierten
        Nutzungsprofils kannst du uns gegenüber jederzeit mit Wirkung für die
        Zukunft widersprechen.
      </p>
      <H3>5.2 OpenAI</H3>
      <p>
        Auf dieser Website haben wir zur Bereitstellung eines autonomen
        Kundensupports eine Software-Lösung mit künstlicher Intelligenz des
        folgenden Anbieters eingebunden: OpenAI Ireland Limited, 1st Floor, The
        Liffey Trust Centre, 117-126 Sheriff Street Upper, Dublin 1, D01 YC43,
        Irland.
      </p>
      <p>Daten können zudem übermittelt werden an: OpenAI OpCo, LLC, USA.</p>
      <p>
        Über eine API-basierte Integration kannst du per Texteingabe
        Präferenzen mitteilen, die sodann durch Sprachmodelle des Anbieters zur
        Ermittlung interessengerechter Produktempfehlungen bearbeitet werden.
      </p>
      <p>
        Hierfür erhebt die Anbietersoftware ggf. deine personenbezogene Daten,
        um dein Anliegen automatisiert zu prüfen und sodann durch autonome
        Einleitung von Bearbeitungsprozessen einer Lösung zuzuführen.
      </p>
      <p>
        Die Erhebung und weitere Verarbeitung personenbezogener Daten erfolgt
        ausschließlich zur Bearbeitung deines konkreten Anliegens. Die
        Verarbeitung von Eingaben des Seitenbesuchers zu Zwecken des Trainings
        und der Weiterentwicklung der KI-Sprachmodelle des Anbieters wird
        ausdrücklich unterbunden.
      </p>
      <p>
        Die Datenverarbeitung erfolgt auf Basis unseres berechtigten Interesses
        an der effektiven Betreuung unserer Seitenbesucher, an der optimalen
        Vermarktung unseres Angebots und an der Automatisierung des
        Kundensupports zur Betriebsentlastung gemäß Art. 6 Abs. 1 lit. f DSGVO.
      </p>
      <p>
        Erhobene personenbezogene Daten werden vorbehaltlich entgegenstehender
        gesetzlicher Aufbewahrungsfristen gelöscht, wenn die Anbietersoftware
        gemäß automatischer mathematisch-statistischer Verfahren eine
        abschließende Klärung des Sachverhaltes feststellt.
      </p>
      <p>
        Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag
        geschlossen, der den Schutz der Daten unserer Seitenbesucher
        sicherstellt und eine unberechtigte Weitergabe an Dritte untersagt.
      </p>
      <p>
        Für die Übermittlung von Daten in die USA beruft sich der Anbieter auf
        Standardvertragsklauseln der Europäischen Kommission, welche die
        Einhaltung des europäischen Datenschutzniveaus sicherstellen sollen.
      </p>
      <H3>5.3 Google Calendar</H3>
      <p>
        Für die Bereitstellung einer Online-Terminbuchungsfunktion nutzen wir
        die Dienste des folgenden Anbieters: Google Ireland Limited, Gordon
        House, 4 Barrow St, Dublin, D04 E5W5, Irland
      </p>
      <p>Daten können zudem übertragen werden an: Google LLC, USA</p>
      <p>
        Zum Zwecke der Terminvergabe werden gemäß Art. 6 Abs. 1 lit. b DSGVO
        Vor- und Zuname sowie Mailadresse (und ggf. die Telefonnummer, sofern
        ein telefonischer Termin gewünscht ist) erhoben und gemäß Art. 6 Abs. 1
        lit. f DSGVO auf Basis unseres berechtigten Interesses an einem
        effektiven Kundenmanagement und einer effizienten Terminverwaltung an
        den Anbieter übermittelt und dort für die Terminorganisation
        gespeichert.
      </p>
      <p>
        Nach Abhaltung des Termins bzw. nach Ablauf des vereinbarten
        Terminzeitraums werden deine Daten vom Anbieter gelöscht.
      </p>
      <p>
        Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag
        geschlossen, der den Schutz der Daten unserer Seitenbesucher
        sicherstellt und eine unberechtigte Weitergabe an Dritte untersagt.
      </p>
      <p>
        Für Datenübermittlungen in die USA hat sich der Anbieter dem
        EU-US-Datenschutzrahmen (EU-US Data Privacy Framework) angeschlossen,
        das auf Basis eines Angemessenheitsbeschlusses der Europäischen
        Kommission die Einhaltung des europäischen Datenschutzniveaus
        sicherstellt.
      </p>
      <H3>5.4 WhatsApp-Business</H3>
      <p>
        Wir bieten dir die Möglichkeit, mit uns über den Nachrichtendienst
        WhatsApp der WhatsApp Ireland Limited, 4 Grand Canal Square, Grand
        Canal Harbour, Dublin 2, Irland, in Kontakt zu treten. Hierfür
        verwenden wir die sog. „Business-Version“ von WhatsApp.
      </p>
      <p>
        Sofern du uns anlässlich eines konkreten Geschäfts (beispielsweise
        einer getätigten Bestellung) per WhatsApp kontaktierst, speichern und
        verwenden wir die von dir bei WhatsApp genutzte Mobilfunknummer sowie –
        falls bereitgestellt – deinen Vor- und Nachnamen gemäß Art. 6 Abs. 1
        lit. b. DSGVO zur Bearbeitung und Beantwortung deines Anliegens. Auf
        Basis derselben Rechtsgrundlage werden wir dich per WhatsApp
        gegebenenfalls um die Bereitstellung weiterer Daten (Bestellnummer,
        Kundennummer, Anschrift oder E-Mailadresse) bitten, um deine Anfrage
        einem bestimmten Vorgang zuordnen zu können.
      </p>
      <p>
        Nutzt Du unseren WhatsApp-Kontakt für allgemeine Anfragen (etwa zum
        Leistungsspektrum, zu Verfügbarkeiten oder zu unserem Internetauftritt)
        speichern und verwenden wir die von dir bei WhatsApp genutzte
        Mobilfunknummer sowie – falls bereitgestellt – deinen Vor- und
        Nachnamen gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres
        berechtigten Interesses an der effizienten und zeitnahen Bereitstellung
        der gewünschten Informationen.
      </p>
      <p>
        Deine Daten werden stets nur zur Beantwortung deines Anliegens per
        WhatsApp verwendet. Eine Weitergabe an Dritte findet nicht statt.
      </p>
      <p>
        Bitte beachte, dass WhatsApp Business Zugriff auf das Adressbuch des
        von uns hierfür verwendeten mobilen Endgeräts erhält und im Adressbuch
        gespeicherte Telefonnummern automatisch an einen Server des
        Mutterkonzerns Meta Platforms Inc. in den USA überträgt. Für den
        Betrieb unseres WhatsApp-Business-Kontos verwenden wir ein mobiles
        Endgerät, in dessen Adressbuch ausschließlich die WhatsApp-Kontaktdaten
        solcher Nutzer gespeichert werden, die mit uns per WhatsApp auch in
        Kontakt getreten sind.
      </p>
      <p>
        Hierdurch wird sichergestellt, dass jede Person, deren
        WhatsApp-Kontaktdaten in unserem Adressbuch gespeichert sind, bereits
        bei erstmaliger Nutzung der App auf seinem Gerät durch Akzeptanz der
        WhatsApp-Nutzungsbedingungen in die Übermittlung seiner
        WhatsApp-Telefonnummer aus den Adressbüchern seiner Chat-Kontakte
        gemäß Art. 6 Abs. 1 lit. a DSGVO eingewilligt hat. Eine Übermittlung
        von Daten solcher Nutzer, die WhatsApp nicht verwenden und/oder uns
        nicht über WhatsApp kontaktiert haben, wird insofern ausgeschlossen.
      </p>
      <p>
        Zweck und Umfang der Datenerhebung und die weitere Verarbeitung und
        Nutzung der Daten durch WhatsApp sowie deine diesbezüglichen Rechte und
        Einstellungsmöglichkeiten zum Schutz deiner Privatsphäre entnimmst Du
        bitte den Datenschutzhinweisen von WhatsApp:{" "}
        <a
          href="https://www.whatsapp.com/legal/?eea=1#privacy-policy"
          target="_blank"
          rel="noreferrer"
          className="break-all underline underline-offset-2 hover:text-foreground"
        >
          https://www.whatsapp.com/legal/?eea=1#privacy-policy
        </a>
      </p>
      <p>
        Im Rahmen der oben genannten Verarbeitungen kann es zu
        Datenübertragungen an Server von Meta Platforms Inc. in den USA kommen.
      </p>
      <p>
        Für Datenübermittlungen in die USA hat sich der Anbieter dem
        EU-US-Datenschutzrahmen (EU-US Data Privacy Framework) angeschlossen,
        das auf Basis eines Angemessenheitsbeschlusses der Europäischen
        Kommission die Einhaltung des europäischen Datenschutzniveaus
        sicherstellt.
      </p>
      <p>
        5.5 Im Rahmen der Kontaktaufnahme mit uns (z.B. per Kontaktformular
        oder E-Mail) werden personenbezogene Daten erhoben. Welche Daten im
        Falle der Nutzung eines Kontaktformulars erhoben werden, ist aus dem
        jeweiligen Kontaktformular ersichtlich. Diese Daten werden
        ausschließlich zum Zweck der Beantwortung deines Anliegens bzw. für die
        Kontaktaufnahme und die damit verbundene technische Administration
        gespeichert und verwendet.
      </p>
      <p>
        Rechtsgrundlage für die Verarbeitung dieser Daten ist unser
        berechtigtes Interesse an der Beantwortung deines Anliegens gemäß
        Art. 6 Abs. 1 lit. f DSGVO. Zielt deine Kontaktierung auf den Abschluss
        eines Vertrages ab, so ist zusätzliche Rechtsgrundlage für die
        Verarbeitung Art. 6 Abs. 1 lit. b DSGVO. Deine Daten werden nach
        abschließender Bearbeitung deiner Anfrage gelöscht. Dies ist der Fall,
        wenn sich aus den Umständen entnehmen lässt, dass der betroffene
        Sachverhalt abschließend geklärt ist und sofern keine gesetzlichen
        Aufbewahrungspflichten entgegenstehen.
      </p>

      <H2>6) Seitenfunktionalitäten</H2>
      <H3>Cloudflare Turnstile</H3>
      <p>
        Auf dieser Website verwenden wir den CAPTCHA-Dienst des folgenden
        Anbieters: Cloudflare, Inc., 101 Townsend St. San Francisco, CA 94107,
        USA
      </p>
      <p>
        Der Dienst prüft, ob eine Eingabe durch eine natürliche Person oder
        missbräuchlich durch maschinelle und automatisierte Verarbeitung
        erfolgt, und blockiert Spam, DDoS-Attacken sowie ähnliche
        automatisierte Schadzugriffe. Um sicherzustellen, dass eine Handlung
        von einem Menschen und nicht von einem automatisierten Bot vorgenommen
        wird, erhebt Cloudflare Turnstile die IP-Adresse des verwendeten
        Endgeräts, Erkennungsdaten des verwendeten Browser- und
        Betriebssystem-Typs sowie Datum und Dauer des Besuchs und übermittelt
        diese zur Auswertung an Server des Anbieters.
      </p>
      <p>
        Rechtsgrundlage ist unser berechtigtes Interesse an der Feststellung
        der individuellen Eigenverantwortung im Internet und der Vermeidung von
        Missbrauch und Spam gemäß Art. 6 Abs. 1 lit. f DSGVO.
      </p>
      <p>
        Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag
        abgeschlossen, der den Schutz der Daten unserer Seitenbesucher
        sicherstellt und eine unberechtigte Weitergabe an Dritte untersagt.
      </p>
      <p>
        Für Datenübermittlungen in die USA hat sich der Anbieter dem
        EU-US-Datenschutzrahmen (EU-US Data Privacy Framework) angeschlossen,
        das auf Basis eines Angemessenheitsbeschlusses der Europäischen
        Kommission die Einhaltung des europäischen Datenschutzniveaus
        sicherstellt.
      </p>

      <H2>7) Tools und Sonstiges</H2>
      <H3>Cookie-Consent-Tool</H3>
      <p>
        Diese Website nutzt zur Einholung wirksamer Nutzereinwilligungen für
        einwilligungspflichtige Cookies und cookie-basierte Anwendungen ein
        sog. „Cookie-Consent-Tool“. Das „Cookie-Consent-Tool“ wird dir bei
        Seitenaufruf in Form einer interaktiven Benutzeroberfläche angezeigt,
        auf welcher du per Häkchensetzung Einwilligungen für bestimmte Cookies
        und/oder cookie-basierte Anwendungen erteilen kannst. Hierbei werden
        durch den Einsatz des Tools alle einwilligungspflichtigen
        Cookies/Dienste nur dann geladen, wenn du entsprechende Einwilligungen
        per Häkchensetzung erteilst. So wird sichergestellt, dass nur im Falle
        einer erteilten Einwilligung derartige Cookies auf deinem jeweiligen
        Endgerät gesetzt werden.
      </p>
      <p>
        Das Tool setzt technisch notwendige Cookies, um deine
        Cookie-Präferenzen zu speichern. Personenbezogene Nutzerdaten werden
        hierbei grundsätzlich nicht verarbeitet.
      </p>
      <p>
        Kommt es im Einzelfall zum Zwecke der Speicherung, Zuordnung oder
        Protokollierung von Cookie-Einstellungen doch zur Verarbeitung
        personenbezogener Daten (wie etwa der IP-Adresse), erfolgt diese gemäß
        Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an
        einem rechtskonformen, nutzerspezifischen und nutzerfreundlichen
        Einwilligungsmanagement für Cookies und mithin an einer
        rechtskonformen Ausgestaltung unseres Internetauftritts.
      </p>
      <p>
        Weitere Rechtsgrundlage für die Verarbeitung ist ferner Art. 6 Abs. 1
        lit. c DSGVO. Wir unterliegen als Verantwortliche der rechtlichen
        Verpflichtung, den Einsatz technisch nicht notwendiger Cookies von der
        jeweiligen Nutzereinwilligung abhängig zu machen.
      </p>
      <p>
        Soweit erforderlich, haben wir mit dem Anbieter einen
        Auftragsverarbeitungsvertrag geschlossen, der den Schutz der Daten
        unserer Seitenbesucher sicherstellt und eine unberechtigte Weitergabe
        an Dritte untersagt.
      </p>
      <p>
        Weitere Informationen zum Betreiber und den Einstellungsmöglichkeiten
        des Cookie-Consent-Tools findest du direkt in der entsprechenden
        Benutzeroberfläche auf unserer Website.
      </p>

      <H2>8) Rechte des Betroffenen</H2>
      <p>
        8.1 Das geltende Datenschutzrecht gewährt dir gegenüber uns als
        Verantwortlichen hinsichtlich der Verarbeitung deiner personenbezogenen
        Daten die nachstehenden Betroffenenrechte (Auskunfts- und
        Interventionsrechte), wobei für die jeweiligen Ausübungsvoraussetzungen
        auf die angeführte Rechtsgrundlage verwiesen wird:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Auskunftsrecht gemäß Art. 15 DSGVO;</li>
        <li>Recht auf Berichtigung gemäß Art. 16 DSGVO;</li>
        <li>Recht auf Löschung gemäß Art. 17 DSGVO;</li>
        <li>Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO;</li>
        <li>Recht auf Unterrichtung gemäß Art. 19 DSGVO;</li>
        <li>Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO;</li>
        <li>
          Recht auf Widerruf erteilter Einwilligungen gemäß Art. 7 Abs. 3
          DSGVO;
        </li>
        <li>Recht auf Beschwerde gemäß Art. 77 DSGVO.</li>
      </ul>
      <H3>8.2 Widerspruchsrecht</H3>
      <p className="uppercase">
        Wenn wir im Rahmen einer Interessenabwägung deine personenbezogenen
        Daten aufgrund unseres überwiegenden berechtigten Interesses
        verarbeiten, hast du das jederzeitige Recht, aus Gründen, die sich aus
        deiner besonderen Situation ergeben, gegen diese Verarbeitung
        Widerspruch mit Wirkung für die Zukunft einzulegen.
      </p>
      <p className="uppercase">
        Machst du von deinem Widerspruchsrecht Gebrauch, beenden wir die
        Verarbeitung der betroffenen Daten. Eine Weiterverarbeitung bleibt aber
        vorbehalten, wenn wir zwingende schutzwürdige Gründe für die
        Verarbeitung nachweisen können, die deine Interessen, Grundrechte und
        Grundfreiheiten überwiegen, oder wenn die Verarbeitung der
        Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen dient.
      </p>
      <p className="uppercase">
        Werden deine personenbezogenen Daten von uns verarbeitet, um
        Direktwerbung zu betreiben, hast du das Recht, jederzeit Widerspruch
        gegen die Verarbeitung dir betreffender personenbezogener Daten zum
        Zwecke derartiger Werbung einzulegen. Du kannst den Widerspruch wie
        oben beschrieben ausüben.
      </p>
      <p className="uppercase">
        Machst du von deinem Widerspruchsrecht Gebrauch, beenden wir die
        Verarbeitung der betroffenen Daten zu Direktwerbezwecken.
      </p>

      <H2>9) Dauer der Speicherung personenbezogener Daten</H2>
      <p>
        Die Dauer der Speicherung von personenbezogenen Daten bemisst sich
        anhand der jeweiligen Rechtsgrundlage, am Verarbeitungszweck und –
        sofern einschlägig – zusätzlich anhand der jeweiligen gesetzlichen
        Aufbewahrungsfrist (z.B. handels- und steuerrechtliche
        Aufbewahrungsfristen).
      </p>
      <p>
        Bei der Verarbeitung von personenbezogenen Daten auf Grundlage einer
        ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO werden
        die betroffenen Daten so lange gespeichert, bis du deine Einwilligung
        widerrufst.
      </p>
      <p>
        Existieren gesetzliche Aufbewahrungsfristen für Daten, die im Rahmen
        rechtsgeschäftlicher bzw. rechtsgeschäftsähnlicher Verpflichtungen auf
        der Grundlage von Art. 6 Abs. 1 lit. b DSGVO verarbeitet werden,
        werden diese Daten nach Ablauf der Aufbewahrungsfristen routinemäßig
        gelöscht, sofern sie nicht mehr zur Vertragserfüllung oder
        Vertragsanbahnung erforderlich sind und/oder unsererseits kein
        berechtigtes Interesse an der Weiterspeicherung fortbesteht.
      </p>
      <p>
        Bei der Verarbeitung von personenbezogenen Daten auf Grundlage von
        Art. 6 Abs. 1 lit. f DSGVO werden diese Daten so lange gespeichert,
        bis du dein Widerspruchsrecht nach Art. 21 Abs. 1 DSGVO ausübst, es
        sei denn, wir können zwingende schutzwürdige Gründe für die
        Verarbeitung nachweisen, die deine Interessen, Rechte und Freiheiten
        überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung
        oder Verteidigung von Rechtsansprüchen.
      </p>
      <p>
        Bei der Verarbeitung von personenbezogenen Daten zum Zwecke der
        Direktwerbung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO werden
        diese Daten so lange gespeichert, bis du dein Widerspruchsrecht nach
        Art. 21 Abs. 2 DSGVO ausübst.
      </p>
      <p>
        Sofern sich aus den sonstigen Informationen dieser Erklärung über
        spezifische Verarbeitungssituationen nichts anderes ergibt, werden
        gespeicherte personenbezogene Daten im Übrigen dann gelöscht, wenn sie
        für die Zwecke, für die sie erhoben oder auf sonstige Weise verarbeitet
        wurden, nicht mehr notwendig sind.
      </p>

      <div className="border-t border-border/60 pt-4 text-sm">
        <p>
          Copyright-Hinweis: Diese Datenschutzerklärung wurde von den
          Fachanwälten der IT-Recht Kanzlei erstellt und ist urheberrechtlich
          geschützt (
          <a
            href="https://www.it-recht-kanzlei.de"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            https://www.it-recht-kanzlei.de
          </a>
          )
        </p>
        <p className="mt-2">Stand: 08.07.2026</p>
      </div>
    </PageShell>
  )
}
