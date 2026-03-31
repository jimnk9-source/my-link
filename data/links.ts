export interface LinkType {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

export const dummyLinks: LinkType[] = [
  {
    id: "link-1",
    title: "Instagram",
    url: "https://instagram.com/your_username",
    icon: "instagram",
    isActive: true,
    order: 1,
  },
  {
    id: "link-2",
    title: "YouTube",
    url: "https://youtube.com/@your_channel",
    icon: "youtube",
    isActive: true,
    order: 2,
  },
  {
    id: "link-3",
    title: "Blog",
    url: "https://blog.naver.com/your_id",
    icon: "book",
    isActive: true,
    order: 3,
  },
  {
    id: "link-4",
    title: "GitHub",
    url: "https://github.com/your_username",
    icon: "github",
    isActive: true,
    order: 4,
  },
  {
    id: "link-5",
    title: "포트폴리오",
    url: "https://your-portfolio.com",
    icon: "user",
    isActive: true,
    order: 5,
  },
];
