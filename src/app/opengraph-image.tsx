import { ImageResponse } from "next/og";

export const alt = "Chethan Kumar — Aspiring Ethical Hacker & Cybersecurity Learner";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          backgroundColor: "#05080A",
          fontFamily: "monospace",
          border: "4px solid rgba(0, 255, 156, 0.4)",
          position: "relative"
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(0, 255, 156, 0.2)",
            paddingBottom: "24px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#FF3B6B"
              }}
            />
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#00E5FF"
              }}
            />
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#00FF9C"
              }}
            />
            <span
              style={{
                color: "#6B8A7D",
                fontSize: "20px",
                marginLeft: "12px",
                letterSpacing: "1px"
              }}
            >
              chethan@kali:~# portfolio --inspect
            </span>
          </div>
          <div
            style={{
              color: "#00FF9C",
              fontSize: "18px",
              padding: "6px 14px",
              border: "1px solid rgba(0, 255, 156, 0.4)",
              borderRadius: "4px",
              backgroundColor: "rgba(0, 255, 156, 0.05)"
            }}
          >
            [STATUS: RED TEAM OPEN]
          </div>
        </div>

        {/* Center / Hero text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              color: "#00E5FF",
              fontSize: "22px",
              letterSpacing: "2px",
              textTransform: "uppercase"
            }}
          >
            &gt; Identity verified // VTU 2023-2027
          </div>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#00FF9C",
              letterSpacing: "-1px",
              lineHeight: 1.1
            }}
          >
            CHETHAN KUMAR
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#D7FFE9",
              maxWidth: "1000px"
            }}
          >
            Aspiring Ethical Hacker • Cyber Range Builder • Offensive Security Learner
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(0, 255, 156, 0.2)",
            paddingTop: "24px"
          }}
        >
          <div style={{ color: "#6B8A7D", fontSize: "20px" }}>
            80 Rooms Built • 168 Tests Passing • Top 4 SIH
          </div>
          <div style={{ color: "#00FF9C", fontSize: "20px" }}>
            chethankp365@gmail.com
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}

