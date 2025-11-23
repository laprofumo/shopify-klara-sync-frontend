import React, { useState, useEffect } from "react";

const API_BASE_URL = "https://shopify-klara-sync-backend.onrender.com";

function App() {
  // Demo-State – später mit echten API-Daten ersetzen
  const [today, setToday] = useState({
    date: "2026-01-05",
    status: "prepared", // "sent" | "prepared" | "error"
    UmsatzBrutto: 780.0,
    Mwst: 58.43,
    Gutscheine: 200.0,
    lastSyncTime: "Noch nicht gesendet"
  });

  const [openDays, setOpenDays] = useState([
    { date: "2026-01-04", status: "prepared" },
    { date: "2026-01-03", status: "error" }
  ]);

  const [liveMode, setLiveMode] = useState(true);

  const [import2025Status, setImport2025Status] = useState({
    hasRun: false,
    daysTotal: 365,
    daysWithRevenue: 0,
    daysWithoutRevenue: 0,
    lastRun: null,
    lastSent: null
  });

  // --- Handler (TODO: später mit Backend verbinden) ---

  const handleSendTodayToKlara = () => {
    // TODO: API-Call zu deiner Middleware
    setToday(prev => ({
      ...prev,
      status: "sent",
      lastSyncTime: new Date().toLocaleTimeString()
    }));
  };

  const handleResendDay = date => {
    // TODO: API-Call für diesen Tag
    setOpenDays(prev => prev.filter(d => d.date !== date));
  };

  const handleIgnoreDay = date => {
    // TODO: optional loggen
    setOpenDays(prev => prev.filter(d => d.date !== date));
  };

  const handleToggleLiveMode = () => {
    // TODO: Backend über neuen Status informieren
    setLiveMode(prev => !prev);
  };

  const handleImport2025 = () => {
    // TODO: Shopify 2025 auslesen & Summen berechnen
    setImport2025Status({
      hasRun: true,
      daysTotal: 365,
      daysWithRevenue: 241,
      daysWithoutRevenue: 124,
      lastRun: new Date().toLocaleString(),
      lastSent: import2025Status.lastSent
    });
  };

  const handleSend2025ToKlara = () => {
    // TODO: Buchungen 2025 an Klara senden
    setImport2025Status(prev => ({
      ...prev,
      lastSent: new Date().toLocaleString()
    }));
  };

  // --- Anzeige-Helfer ---

  const formatCurrency = value =>
    new Intl.NumberFormat("de-CH", {
      style: "currency",
      currency: "CHF"
    }).format(value);

  const statusColor = status => {
    if (status === "sent") return "bg-emerald-100 text-emerald-800";
    if (status === "prepared") return "bg-amber-100 text-amber-800";
    if (status === "error") return "bg-red-100 text-red-800";
    return "bg-slate-100 text-slate-800";
  };

  const statusLabel = status => {
    if (status === "sent") return "An Klara gesendet";
    if (status === "prepared") return "Vorbereitet – noch nicht gesendet";
    if (status === "error") return "Fehler beim Senden";
    return "Unbekannter Status";
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex justify-center">
      <div className="w-full max-w-md px-4 py-6 pb-10">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-emerald-900">
              La Profumoteca Sync
            </h1>
            <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
              Shopify → Klara
            </span>
          </div>
          <p className="text-sm text-emerald-800 mt-1">
            Automatischer Abgleich von Online-Umsatz und Gutscheinen.
          </p>
        </header>

        {/* HEUTE */}
        <section className="mb-5">
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm font-semibold text-emerald-900">
                  Heute
                </h2>
                <p className="text-xs text-emerald-700">{today.date}</p>
              </div>
              <span
                className={
                  "text-xs font-medium px-3 py-1 rounded-full " +
                  statusColor(today.status)
                }
              >
                {statusLabel(today.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2 text-sm">
              <div>
                <p className="text-emerald-700 text-xs uppercase tracking-wide">
                  Umsatz brutto
                </p>
                <p className="font-semibold text-emerald-900">
                  {formatCurrency(today.UmsatzBrutto)}
                </p>
              </div>
              <div>
                <p className="text-emerald-700 text-xs uppercase tracking-wide">
                  MWST 8.1%
                </p>
                <p className="font-semibold text-emerald-900">
                  {formatCurrency(today.Mwst)}
                </p>
              </div>
              <div>
                <p className="text-emerald-700 text-xs uppercase tracking-wide">
                  Gutscheine verkauft
                </p>
                <p className="font-semibold text-emerald-900">
                  {formatCurrency(today.Gutscheine)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-emerald-700">
              <span>Letzter Sync: {today.lastSyncTime}</span>
            </div>

            {today.status !== "sent" && (
              <button
                onClick={handleSendTodayToKlara}
                className="mt-3 w-full rounded-xl py-2.5 text-sm font-semibold bg-emerald-600 text-white active:scale-[0.99] transition"
              >
                Tagesabschluss an Klara senden
              </button>
            )}
          </div>
        </section>

        {/* OFFENE TAGE + LIVEMODUS */}
        <section className="mb-5 space-y-4">
          {/* Live-Modus */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-emerald-900">
                  Live-Modus
                </h2>
                <p className="text-xs text-emerald-700">
                  Neue Shopify-Bestellungen automatisch sammeln.
                </p>
              </div>
              <button
                onClick={handleToggleLiveMode}
                className={
                  "relative inline-flex h-7 w-12 items-center rounded-full transition " +
                  (liveMode ? "bg-emerald-500" : "bg-slate-300")
                }
              >
                <span
                  className={
                    "inline-block h-6 w-6 transform rounded-full bg-white shadow transition " +
                    (liveMode ? "translate-x-5" : "translate-x-1")
                  }
                />
              </button>
            </div>
            <p className="mt-2 text-xs text-emerald-700">
              Status:{" "}
              <span className="font-semibold">
                {liveMode ? "AKTIV" : "INAKTIV"}
              </span>
            </p>
          </div>

          {/* Offene Tage */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-4">
            <h2 className="text-sm font-semibold text-emerald-900 mb-2">
              Offene Tage
            </h2>
            {openDays.length === 0 ? (
              <p className="text-xs text-emerald-700">
                Keine offenen Tage. Alles sauber übertragen.
              </p>
            ) : (
              <div className="space-y-2">
                {openDays.map(day => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-xs font-medium text-emerald-900">
                        {day.date}
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        {statusLabel(day.status)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleResendDay(day.date)}
                        className="text-[11px] px-2 py-1 rounded-lg bg-emerald-600 text-white"
                      >
                        Erneut senden
                      </button>
                      <button
                        onClick={() => handleIgnoreDay(day.date)}
                        className="text-[11px] px-2 py-1 rounded-lg bg-slate-200 text-slate-800"
                      >
                        Ignorieren
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 2025 IMPORT */}
        <section className="mb-5">
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-4">
            <h2 className="text-sm font-semibold text-emerald-900 mb-1">
              Rückwirkender Import 2025
            </h2>
            <p className="text-xs text-emerald-700 mb-3">
              Einmalig: Bestellungen 2025 aus Shopify einsammeln und als
              Tagesumsätze an Klara senden.
            </p>

            <div className="text-xs text-emerald-800 mb-3 space-y-1">
              <p>
                Zeitraum:{" "}
                <span className="font-semibold">
                  01.01.2025 – 31.12.2025
                </span>
              </p>
              {import2025Status.hasRun && (
                <>
                  <p>Tage insgesamt: {import2025Status.daysTotal}</p>
                  <p>Tage mit Umsatz: {import2025Status.daysWithRevenue}</p>
                  <p>
                    Tage ohne Umsatz: {import2025Status.daysWithoutRevenue}
                  </p>
                  <p>Letzter Importlauf: {import2025Status.lastRun}</p>
                  {import2025Status.lastSent && (
                    <p>
                      Zuletzt an Klara gesendet: {import2025Status.lastSent}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={handleImport2025}
                className="w-full rounded-xl py-2 text-sm font-semibold bg-emerald-500 text-white"
              >
                Daten aus Shopify einsammeln
              </button>
              <button
                onClick={handleSend2025ToKlara}
                className="w-full rounded-xl py-2 text-sm font-semibold bg-emerald-700 text-white"
              >
                Buchungen 2025 an Klara senden
              </button>
            </div>
          </div>
        </section>

        {/* EINSTELLUNGEN */}
        <section>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-4">
            <h2 className="text-sm font-semibold text-emerald-900 mb-2">
              Einstellungen / Info
            </h2>
            <div className="text-xs text-emerald-800 space-y-1">
              <p className="font-semibold">Verbundene Konten:</p>
              <p>Umsatzkonto: 3000</p>
              <p>MWST 8.1%: 2200</p>
              <p>Gutscheinverbindlichkeiten: 2030</p>
              <p>Forderungen Karten / Online: 1101</p>
              <p className="mt-2 text-[11px] text-emerald-700">
                Zahlungseingänge und Gebühren werden weiterhin direkt in Klara
                über den Kontoabgleich erfasst.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

