import type { ProfileId } from "@/lib/db/schema";
import { PROFILES, PROFILE_IDS } from "@/lib/profiles";
import type { ProfileStat } from "@/lib/recommend";

/**
 * JSX for Open Graph share images (rendered by next/og's ImageResponse, which supports a
 * subset of CSS: flex layouts, no grid, inline styles only).
 */
export function ShareCard({
  eyebrow,
  title,
  subtitle,
  stats,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string | null;
  stats: Record<ProfileId, ProfileStat> | null;
  footer: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #064e3b 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 26, opacity: 0.75, letterSpacing: 2, textTransform: "uppercase" }}>{eyebrow}</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5 }}>{title}</div>
        {subtitle ? <div style={{ fontSize: 30, opacity: 0.85, marginTop: 8 }}>{subtitle}</div> : null}
      </div>

      {stats ? (
        <div style={{ display: "flex", gap: 16 }}>
          {PROFILE_IDS.map((p) => {
            const s = stats[p];
            const meta = PROFILES[p];
            return (
              <div
                key={p}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  padding: "20px 22px",
                  borderRadius: 20,
                  background: s.recommended ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.08)",
                  border: s.recommended ? "2px solid rgba(52,211,153,0.9)" : "2px solid rgba(255,255,255,0.12)",
                }}
              >
                <div style={{ fontSize: 24, opacity: 0.9 }}>{`${meta.emoji} ${meta.label}`}</div>
                <div style={{ fontSize: 44, fontWeight: 700, marginTop: 6 }}>{s.votes > 0 ? `${s.avg.toFixed(1)} / 5` : "no votes"}</div>
                <div style={{ fontSize: 22, opacity: 0.8 }}>
                  {s.votes > 0 ? `${s.votes} ${s.votes === 1 ? "vote" : "votes"}${s.recommended ? " · recommended" : ""}` : "no votes yet"}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, opacity: 0.85 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "white",
              color: "#0f172a",
              fontWeight: 700,
              fontSize: 26,
            }}
          >
            N
          </div>
          NestVote
        </div>
        <div>{footer}</div>
      </div>
    </div>
  );
}
