export type PortfolioCategory = "site" | "landing_page" | "sistema" | "video" | "criativo" | "case";

export type PortfolioProject = {
  id: string;
  name: string;
  client_name: string | null;
  image_url: string | null;
  video_url: string | null;
  description: string | null;
  service: string | null;
  category: PortfolioCategory | null;
  media_type: "image" | "video" | null;
  technologies: string[] | null;
  url: string | null;
  date: string | null;
  results: string | null;
  objective: string | null;
  work_done: string | null;
  featured: boolean | null;
};

export type Testimonial = {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
  quote: string;
  avatar_url: string | null;
  rating: number | null;
  featured: boolean | null;
};
