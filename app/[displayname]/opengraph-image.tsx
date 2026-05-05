import { ImageResponse } from "next/og";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const runtime = "edge";

export const alt = "MyLink Profile";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ displayname: string }> }) {
  const { displayname } = await params;
  
  let username = displayname;
  
  try {
    // 1. displayname으로 UID 조회
    const nameRef = doc(db, "displayNames", displayname.toLowerCase().trim());
    const nameSnap = await getDoc(nameRef);
    
    if (nameSnap.exists()) {
      const uid = nameSnap.data().uid;
      // 2. 해당 UID의 프로필 정보 조회
      const profileRef = doc(db, "users", uid, "profile", "data");
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        username = profileSnap.data().username || displayname;
      }
    }
  } catch (e) {
    console.error("OG Image data fetch error:", e);
  }

  const initial = username.charAt(0).toUpperCase();

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
        {/* 장식 요소 */}
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
          }}
        />
        
        {/* 프로필 이미지(이니셜) 박스 */}
        <div
          style={{
            background: "white",
            width: 180,
            height: 180,
            borderRadius: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 90,
            fontWeight: "bold",
            color: "#7c3aed",
            boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
            marginBottom: 40,
            border: "8px solid rgba(255,255,255,0.3)",
          }}
        >
          {initial}
        </div>

        {/* 사용자 정보 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 15,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            {username}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.7)",
              background: "rgba(0,0,0,0.1)",
              padding: "8px 24px",
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            mylink.at/@{displayname}
          </div>
        </div>

        {/* 푸터 로고 */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: 0.8,
          }}
        >
          <span style={{ fontSize: 24 }}>🔗</span>
          <span style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>MyLink</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
