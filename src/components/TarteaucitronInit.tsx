'use client'

import Script from 'next/script'

declare global {
  interface Window {
    tarteaucitron?: { init: (p: Record<string, unknown>) => void }
  }
}

// Injected after tarteaucitron's own CSS so the cascade is guaranteed
const TAC_OVERRIDES = `
/* ── Backdrop ── */
html body.tarteaucitron-modal-open div#tarteaucitronRoot::before,
html body .tarteaucitronSize-middle.tarteaucitronBeforeVisible::before {
  background: rgba(0,0,0,0.75) !important;
  backdrop-filter: blur(6px) !important;
  -webkit-backdrop-filter: blur(6px) !important;
}

/* ── Banner ── */
html body #tarteaucitronRoot #tarteaucitronAlertBig {
  background: #000 !important;
  border: 0 !important;
  border-top: 1px solid rgba(255,255,255,0.07) !important;
  box-shadow: 0 -20px 60px rgba(0,0,0,0.6) !important;
  color: rgba(255,255,255,0.42) !important;
  font-family: var(--font-inter), system-ui, sans-serif !important;
  font-size: 11px !important;
  letter-spacing: 0.03em !important;
  line-height: 1.7 !important;
  padding: 20px clamp(1.5rem, 4vw, 5rem) !important;
  display: flex !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  gap: 12px !important;
}

#tarteaucitronRoot #tarteaucitronDisclaimerAlert,
#tarteaucitronRoot #tarteaucitronDisclaimerAlert strong {
  color: rgba(255,255,255,0.42) !important;
  font-size: 11px !important;
  font-weight: 400 !important;
  font-family: var(--font-inter), system-ui, sans-serif !important;
}

/* ── All buttons — base reset ── */
#tarteaucitronRoot #tarteaucitronAlertBig button,
#tarteaucitronRoot button {
  font-family: var(--font-inter), system-ui, sans-serif !important;
  font-size: 0.6rem !important;
  letter-spacing: 0.24em !important;
  text-transform: uppercase !important;
  border-radius: 0 !important;
  cursor: pointer !important;
  transition: border-color 500ms ease, color 500ms ease, background 500ms ease !important;
}

/* Accept / Refuse / Personalize (CTA buttons) */
#tarteaucitronRoot button.tarteaucitronCTAButton {
  background: transparent !important;
  border: 1px solid rgba(255,255,255,0.18) !important;
  color: rgba(255,255,255,0.7) !important;
  padding: 0.65rem 1.6rem !important;
  margin: 0 3px !important;
}
#tarteaucitronRoot button.tarteaucitronCTAButton:hover {
  border-color: rgba(255,255,255,0.5) !important;
  color: #fff !important;
  background: rgba(255,255,255,0.03) !important;
}

/* Privacy URL link-button */
#tarteaucitronRoot button#tarteaucitronPrivacyUrl {
  background: transparent !important;
  border: 0 !important;
  color: rgba(255,255,255,0.22) !important;
  text-decoration: underline !important;
  text-underline-offset: 3px !important;
  text-decoration-color: rgba(255,255,255,0.15) !important;
  padding: 0.65rem 0.4rem !important;
  font-size: 0.6rem !important;
  letter-spacing: 0.16em !important;
}
#tarteaucitronRoot button#tarteaucitronPrivacyUrl:hover {
  color: rgba(255,255,255,0.5) !important;
  text-decoration-color: rgba(255,255,255,0.3) !important;
}

/* Close / refuse small link */
#tarteaucitronRoot button#tarteaucitronCloseAlert {
  background: transparent !important;
  border: 0 !important;
  color: rgba(255,255,255,0.22) !important;
  padding: 0.65rem 0.8rem !important;
}
#tarteaucitronRoot button#tarteaucitronCloseAlert:hover {
  color: rgba(255,255,255,0.55) !important;
}

/* ── Full panel ── */
#tarteaucitronRoot #tarteaucitron {
  background: #000 !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  border-radius: 0 !important;
  color: rgba(255,255,255,0.45) !important;
  font-family: var(--font-inter), system-ui, sans-serif !important;
  box-shadow: 0 40px 80px rgba(0,0,0,0.8) !important;
}

/* Panel close button */
#tarteaucitronRoot button#tarteaucitronClosePanel {
  background: transparent !important;
  border: 1px solid rgba(255,255,255,0.06) !important;
  color: rgba(255,255,255,0.3) !important;
  border-radius: 0 !important;
  font-size: 0.58rem !important;
  letter-spacing: 0.22em !important;
}
#tarteaucitronRoot button#tarteaucitronClosePanel:hover {
  color: rgba(255,255,255,0.6) !important;
  border-color: rgba(255,255,255,0.18) !important;
}

/* Panel title */
#tarteaucitronRoot .tarteaucitronH1,
#tarteaucitronRoot #dialogTitle {
  color: rgba(255,255,255,0.75) !important;
  font-family: var(--font-cormorant), Georgia, serif !important;
  font-size: clamp(1.4rem, 3vw, 2rem) !important;
  font-weight: 300 !important;
  letter-spacing: 0.01em !important;
}

/* Panel disclaimer text */
#tarteaucitronRoot #tarteaucitron #tarteaucitronInfo,
#tarteaucitronRoot #tarteaucitron #tarteaucitronInfo p {
  color: rgba(255,255,255,0.38) !important;
  font-size: 11px !important;
  font-family: var(--font-inter), system-ui, sans-serif !important;
  line-height: 1.8 !important;
}

/* Services list container */
#tarteaucitronRoot #tarteaucitronServices {
  background: #000 !important;
  box-shadow: none !important;
}

/* Section title bar */
#tarteaucitronRoot #tarteaucitronServices .tarteaucitronTitle,
#tarteaucitronRoot #tarteaucitronServices .tarteaucitronTitle button {
  background: rgba(255,255,255,0.025) !important;
  border-bottom: 1px solid rgba(255,255,255,0.06) !important;
  color: rgba(255,255,255,0.3) !important;
  font-family: var(--font-inter), system-ui, sans-serif !important;
  font-size: 0.58rem !important;
  letter-spacing: 0.22em !important;
  text-transform: uppercase !important;
}

/* Service row */
#tarteaucitronRoot #tarteaucitronServices .tarteaucitronLine {
  background: transparent !important;
  border-bottom: 1px solid rgba(255,255,255,0.04) !important;
}
#tarteaucitronRoot #tarteaucitronServices .tarteaucitronLine:hover {
  background: rgba(255,255,255,0.015) !important;
}

/* Service name */
#tarteaucitronRoot .tarteaucitronName .tarteaucitronH3,
#tarteaucitronRoot .tarteaucitronName span {
  color: rgba(255,255,255,0.55) !important;
  font-family: var(--font-inter), system-ui, sans-serif !important;
  font-size: 12px !important;
}

/* Service allow/deny buttons */
#tarteaucitronRoot .tarteaucitronAsk .tarteaucitronAllow,
#tarteaucitronRoot .tarteaucitronAsk .tarteaucitronDeny {
  background: transparent !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  color: rgba(255,255,255,0.4) !important;
  border-radius: 0 !important;
  font-size: 0.58rem !important;
  letter-spacing: 0.18em !important;
  text-transform: uppercase !important;
  padding: 5px 12px !important;
}
#tarteaucitronRoot .tarteaucitronAsk .tarteaucitronAllow:hover,
#tarteaucitronRoot .tarteaucitronAsk .tarteaucitronDeny:hover {
  border-color: rgba(255,255,255,0.3) !important;
  color: rgba(255,255,255,0.75) !important;
}

/* Active state: allowed */
#tarteaucitronRoot #tarteaucitronServices .tarteaucitronIsAllowed .tarteaucitronAllow {
  background: rgba(255,255,255,0.05) !important;
  border-color: rgba(255,255,255,0.28) !important;
  color: rgba(255,255,255,0.8) !important;
}

/* Active state: denied */
#tarteaucitronRoot #tarteaucitronServices .tarteaucitronIsDenied .tarteaucitronDeny {
  background: rgba(255,255,255,0.02) !important;
  border-color: rgba(255,255,255,0.14) !important;
  color: rgba(255,255,255,0.45) !important;
}

/* Allow-all / deny-all panel buttons */
#tarteaucitronRoot #tarteaucitron #tarteaucitronAllAllowed,
#tarteaucitronRoot #tarteaucitron #tarteaucitronAllDenied {
  background: transparent !important;
  border: 1px solid rgba(255,255,255,0.15) !important;
  color: rgba(255,255,255,0.5) !important;
  border-radius: 0 !important;
  font-size: 0.6rem !important;
  letter-spacing: 0.22em !important;
  text-transform: uppercase !important;
  padding: 7px 16px !important;
  margin: 2px 4px !important;
}
#tarteaucitronRoot #tarteaucitron #tarteaucitronAllAllowed:hover,
#tarteaucitronRoot #tarteaucitron #tarteaucitronAllDenied:hover {
  border-color: rgba(255,255,255,0.4) !important;
  color: rgba(255,255,255,0.85) !important;
}

/* Back button */
#tarteaucitronRoot button#tarteaucitronBack {
  background: rgba(255,255,255,0.03) !important;
}

/* Save button row */
#tarteaucitronRoot div#tarteaucitronSave {
  background: #000 !important;
  border-top: 1px solid rgba(255,255,255,0.06) !important;
  padding: 14px 20px !important;
  text-align: right !important;
}

#tarteaucitronRoot button#tarteaucitronSaveButton {
  background: transparent !important;
  border: 1px solid rgba(255,255,255,0.18) !important;
  color: rgba(255,255,255,0.72) !important;
  font-size: 0.62rem !important;
  letter-spacing: 0.26em !important;
  text-transform: uppercase !important;
  padding: 0.75rem 2rem !important;
  border-radius: 0 !important;
}
#tarteaucitronRoot button#tarteaucitronSaveButton:hover {
  border-color: rgba(255,255,255,0.5) !important;
  color: #fff !important;
  background: rgba(255,255,255,0.03) !important;
}

/* Toggle group arrows */
#tarteaucitronRoot button.tarteaucitron-toggle-group {
  color: rgba(255,255,255,0.28) !important;
  font-size: 0.58rem !important;
  letter-spacing: 0.2em !important;
}

/* Current status label */
.tarteaucitronName .tacCurrentStatus,
.tarteaucitronName .tarteaucitronReadmoreSeparator {
  color: rgba(255,255,255,0.2) !important;
}

/* Small icon button (if shown) */
#tarteaucitronRoot #tarteaucitronAlertSmall {
  background: #000 !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  color: rgba(255,255,255,0.3) !important;
  font-family: var(--font-inter), system-ui, sans-serif !important;
  font-size: 0.6rem !important;
  letter-spacing: 0.2em !important;
  border-radius: 0 !important;
}

/* Focus ring — keep accessible but match dark theme */
#tarteaucitronRoot a:focus-visible,
#tarteaucitronRoot button:focus-visible {
  outline: 1px dashed rgba(255,255,255,0.4) !important;
  outline-offset: 3px !important;
}
`

export default function TarteaucitronInit() {
  return (
    <Script
      id="tarteaucitron-js"
      src="/tarteaucitron/tarteaucitron.js"
      strategy="afterInteractive"
      onLoad={() => {
        // Inject overrides AFTER tarteaucitron's own CSS injection
        if (!document.getElementById('tac-overrides')) {
          const s = document.createElement('style')
          s.id = 'tac-overrides'
          s.textContent = TAC_OVERRIDES
          document.head.appendChild(s)
        }

        window.tarteaucitron?.init({
          privacyUrl:               '/politique-confidentialite',
          bodyPosition:             'bottom',
          hashtag:                  '#tarteaucitron',
          cookieName:               'tarteaucitron',
          orientation:              'popup',
          showAlertSmall:           false,
          cookieslist:              false,
          showIcon:                 false,
          removeCredit:             false,
          handleBrowserDNTRequest:  false,
          useExternalCss:           false,
          useExternalJs:            false,
          lang:                     'fr',
          mandatory:                true,
          groupServices:            false,
          AcceptAllCta:             true,
          DenyAllCta:               true,
          closePopup:               false,
          moreInfoLink:             true,
          highPrivacy:              false,
        })
      }}
    />
  )
}
