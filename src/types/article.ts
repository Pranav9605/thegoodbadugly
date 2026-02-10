export interface Chapter {
  date: string;
  title: string;
  summary: string;
  content: string;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  category: "good" | "bad" | "ugly";
  status: "ongoing" | "concluded";
  chapters: Chapter[];
  author?: string;
  image?: string;
}
