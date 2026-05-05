import { Metadata } from "next";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  params: Promise<{ displayname: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { displayname } = await params;
  
  let username = displayname;
  
  try {
    const nameRef = doc(db, "displayNames", displayname.toLowerCase().trim());
    const nameSnap = await getDoc(nameRef);
    
    if (nameSnap.exists()) {
      const uid = nameSnap.data().uid;
      const profileRef = doc(db, "users", uid, "profile", "data");
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        username = profileSnap.data().username || displayname;
      }
    }
  } catch (e) {
    console.error("Metadata fetch error:", e);
  }

  return {
    title: `${username} (@${displayname}) | MyLink`,
    description: `${username}님의 프로필 페이지입니다. 다양한 링크를 확인해보세요.`,
    openGraph: {
      title: `${username} | MyLink`,
      description: `${username}님의 모든 링크를 하나의 페이지에서 확인하세요.`,
      url: `https://mylink.at/${displayname}`,
      siteName: "MyLink",
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${username} | MyLink`,
      description: `${username}님의 프로필 페이지입니다.`,
    },
  };
}

export default async function ProfileLayout({ children }: Props) {
  return <>{children}</>;
}
