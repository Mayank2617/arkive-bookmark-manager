export interface Bookmark {
  id: string
  title: string
  url: string
  domain: string
  description: string
  image: string | null
  favicon: string
  folderId: string | null
  starred: boolean
  unread: boolean
  createdAt: string
  dominantColor: string
}

export interface Collection {
  id: string
  name: string
  icon: string
  count: number
  color: string
}

export const mockCollections: Collection[] = [
  { id: "col-1", name: "Design Inspiration", icon: "palette", count: 12, color: "hsl(280, 65%, 60%)" },
  { id: "col-2", name: "Dev Resources", icon: "code", count: 24, color: "hsl(160, 60%, 45%)" },
  { id: "col-3", name: "AI & Machine Learning", icon: "brain", count: 8, color: "hsl(220, 90%, 56%)" },
  { id: "col-4", name: "Reading List", icon: "book", count: 15, color: "hsl(30, 80%, 55%)" },
  { id: "col-5", name: "Startups & Business", icon: "briefcase", count: 6, color: "hsl(340, 75%, 55%)" },
]

export const mockBookmarks: Bookmark[] = [
  {
    id: "bk-1",
    title: "Linear - Plan and build products",
    url: "https://linear.app",
    domain: "linear.app",
    description: "Linear is a better way to build products. Meet the system designed to streamline software projects, sprints, tasks, and bug tracking.",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=600&h=340&fit=crop",
    favicon: "https://linear.app/favicon.ico",
    folderId: "col-1",
    starred: true,
    unread: false,
    createdAt: "2026-02-14T10:30:00Z",
    dominantColor: "hsl(250, 60%, 50%)",
  },
  {
    id: "bk-2",
    title: "Vercel: Build and deploy the best Web experiences",
    url: "https://vercel.com",
    domain: "vercel.com",
    description: "Vercel's frontend cloud gives developers frameworks, workflows, and infrastructure to build a faster, more personalized web.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop",
    favicon: "https://vercel.com/favicon.ico",
    folderId: "col-2",
    starred: true,
    unread: false,
    createdAt: "2026-02-13T14:20:00Z",
    dominantColor: "hsl(0, 0%, 10%)",
  },
  {
    id: "bk-3",
    title: "Tailwind CSS - Rapidly build modern websites",
    url: "https://tailwindcss.com",
    domain: "tailwindcss.com",
    description: "A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=340&fit=crop",
    favicon: "https://tailwindcss.com/favicons/favicon.ico",
    folderId: "col-2",
    starred: false,
    unread: true,
    createdAt: "2026-02-12T09:15:00Z",
    dominantColor: "hsl(198, 93%, 60%)",
  },
  {
    id: "bk-4",
    title: "OpenAI - Research and deployment company",
    url: "https://openai.com",
    domain: "openai.com",
    description: "OpenAI is an AI research and deployment company. Our mission is to ensure that artificial general intelligence benefits all of humanity.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=340&fit=crop",
    favicon: "https://openai.com/favicon.ico",
    folderId: "col-3",
    starred: true,
    unread: false,
    createdAt: "2026-02-11T16:45:00Z",
    dominantColor: "hsl(170, 60%, 45%)",
  },
  {
    id: "bk-5",
    title: "Figma: The Collaborative Interface Design Tool",
    url: "https://figma.com",
    domain: "figma.com",
    description: "Figma is the leading collaborative design tool for building meaningful products. Seamlessly design, prototype, develop, and collect feedback.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop",
    favicon: "https://figma.com/favicon.ico",
    folderId: "col-1",
    starred: false,
    unread: true,
    createdAt: "2026-02-10T11:00:00Z",
    dominantColor: "hsl(14, 89%, 55%)",
  },
  {
    id: "bk-6",
    title: "Stripe: Financial Infrastructure for the Internet",
    url: "https://stripe.com",
    domain: "stripe.com",
    description: "Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=340&fit=crop",
    favicon: "https://stripe.com/favicon.ico",
    folderId: "col-5",
    starred: false,
    unread: false,
    createdAt: "2026-02-09T08:30:00Z",
    dominantColor: "hsl(250, 80%, 60%)",
  },
  {
    id: "bk-7",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    domain: "developer.mozilla.org",
    description: "The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=340&fit=crop",
    favicon: "https://developer.mozilla.org/favicon.ico",
    folderId: "col-2",
    starred: true,
    unread: false,
    createdAt: "2026-02-08T13:20:00Z",
    dominantColor: "hsl(210, 50%, 40%)",
  },
  {
    id: "bk-8",
    title: "Hacker News",
    url: "https://news.ycombinator.com",
    domain: "news.ycombinator.com",
    description: "Hacker News is a social news website focusing on computer science and entrepreneurship.",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=340&fit=crop",
    favicon: "https://news.ycombinator.com/favicon.ico",
    folderId: "col-4",
    starred: false,
    unread: true,
    createdAt: "2026-02-07T15:10:00Z",
    dominantColor: "hsl(24, 100%, 50%)",
  },
  {
    id: "bk-9",
    title: "GitHub: Let's build from here",
    url: "https://github.com",
    domain: "github.com",
    description: "GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community.",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=340&fit=crop",
    favicon: "https://github.com/favicon.ico",
    folderId: "col-2",
    starred: true,
    unread: false,
    createdAt: "2026-02-06T09:00:00Z",
    dominantColor: "hsl(0, 0%, 15%)",
  },
  {
    id: "bk-10",
    title: "Notion: Your connected workspace",
    url: "https://notion.so",
    domain: "notion.so",
    description: "A new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=340&fit=crop",
    favicon: "https://notion.so/favicon.ico",
    folderId: "col-4",
    starred: false,
    unread: false,
    createdAt: "2026-02-05T12:30:00Z",
    dominantColor: "hsl(0, 0%, 20%)",
  },
  {
    id: "bk-11",
    title: "Supabase: The Open Source Firebase Alternative",
    url: "https://supabase.com",
    domain: "supabase.com",
    description: "Build production-grade applications with a Postgres database, Authentication, instant APIs, Realtime, Functions, Storage and Vector embeddings.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=340&fit=crop",
    favicon: "https://supabase.com/favicon.ico",
    folderId: "col-2",
    starred: false,
    unread: true,
    createdAt: "2026-02-04T17:45:00Z",
    dominantColor: "hsl(153, 60%, 50%)",
  },
  {
    id: "bk-12",
    title: "Dribbble: Discover the World's Top Designers",
    url: "https://dribbble.com",
    domain: "dribbble.com",
    description: "Dribbble is the leading destination to find and showcase creative work and home to the world's best design professionals.",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=340&fit=crop",
    favicon: "https://dribbble.com/favicon.ico",
    folderId: "col-1",
    starred: true,
    unread: false,
    createdAt: "2026-02-03T10:15:00Z",
    dominantColor: "hsl(328, 80%, 55%)",
  },
]

export const mockUser = {
  name: "Alex Morgan",
  email: "alex.morgan@gmail.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face",
}
