import { MetadataRoute } from "next";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mylink.at"; // 배포되는 실제 도메인

  // 1. 정적 라우트
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // (선택) /login 페이지가 나중에 추가된다면 아래 주석을 해제하여 사용할 수 있습니다.
  // routes.push({
  //   url: `${baseUrl}/login`,
  //   lastModified: new Date(),
  //   changeFrequency: "monthly",
  //   priority: 0.5,
  // });

  try {
    // 2. 동적 라우트 (사용자 프로필 페이지)
    // Firestore의 displayNames 컬렉션에서 모든 사용자 닉네임 가져오기
    const displayNamesSnap = await getDocs(collection(db, "displayNames"));
    
    displayNamesSnap.forEach((doc) => {
      const displayname = doc.id;
      routes.push({
        url: `${baseUrl}/${displayname}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error("Sitemap 생성 중 오류 발생:", error);
  }

  return routes;
}
