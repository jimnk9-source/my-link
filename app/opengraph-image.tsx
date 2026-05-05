import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MyLink - 나만의 링크 페이지, 5초 만에 만드세요";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#fefaf2",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 글로우 (랜딩 페이지 디자인 계승) */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            width: "80%",
            height: "60%",
            background: "radial-gradient(ellipse at center, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "60%",
            height: "50%",
            background: "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.1) 0%, transparent 70%)",
          }}
        />
        
        {/* 그리드 패턴 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* 상단 배지 스타일 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: "100px",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            background: "rgba(124, 58, 237, 0.05)",
            color: "#7c3aed",
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 40,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 5, background: "#7c3aed" }} />
          지금 바로 무료로 시작
        </div>

        {/* 메인 타이틀 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              background: "linear-gradient(135deg, #1e1b4b 0%, #7c3aed 50%, #2563eb 100%)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "-0.05em",
              lineHeight: 1.1,
              // 글씨를 더 두껍게 보이기 위한 섀도우 기법
              textShadow: "0.5px 0 0 currentcolor, -0.5px 0 0 currentcolor, 0 0.5px 0 currentcolor, 0 -0.5px 0 currentcolor",
            }}
          >
            나만의 링크 페이지,
          </div>
          
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <div
              style={{
                fontSize: 92,
                fontWeight: 900,
                color: "#7c3aed",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                textShadow: "1px 0 0 #7c3aed, -1px 0 0 #7c3aed, 0 1px 0 #7c3aed, 0 -1px 0 #7c3aed",
              }}
            >
              5초
              {/* 물결 밑줄 재현 */}
              <svg
                width="165"
                height="15"
                viewBox="0 0 100 8"
                style={{ position: "absolute", bottom: -8, left: 0 }}
              >
                <path
                  d="M0 6 Q25 2 50 5 Q75 8 100 4"
                  stroke="#7c3aed"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </svg>
            </div>
            <div
              style={{
                fontSize: 92,
                fontWeight: 900,
                background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                backgroundClip: "text",
                color: "transparent",
                letterSpacing: "-0.05em",
                marginLeft: 15,
                textShadow: "0.5px 0 0 currentcolor, -0.5px 0 0 currentcolor, 0 0.5px 0 currentcolor, 0 -0.5px 0 currentcolor",
              }}
            >
              만에 만드세요
            </div>
          </div>
        </div>

        {/* 서브 설명 */}
        <div
          style={{
            marginTop: 50,
            fontSize: 32,
            color: "#334155",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            textShadow: "0.3px 0 0 #334155, -0.3px 0 0 #334155",
          }}
        >
          SNS, 블로그 등 모든 링크를 세련된 방식으로 공유하세요.
        </div>

        {/* 푸터 로고 */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              width: 40,
              height: 40,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              color: "white",
            }}
          >
            🔗
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            MyLink
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
