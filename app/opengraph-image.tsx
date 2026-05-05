import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MyLink - 나만의 모든 링크를 단 하나의 페이지에";
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
          background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
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
        {/* 배경 패턴 장식 */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            right: -50,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
          }}
        />

        {/* 로고 아이콘 */}
        <div
          style={{
            background: "white",
            width: 140,
            height: 140,
            borderRadius: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 80,
            boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            marginBottom: 40,
          }}
        >
          🔗
        </div>

        {/* 텍스트 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.05em",
            }}
          >
            MyLink
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.8)",
              marginTop: 10,
            }}
          >
            나만의 모든 링크를 단 하나의 페이지에
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
