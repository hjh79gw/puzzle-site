export interface BlogPost {
  slug: string;
  titleKey: string;
  descKey: string;
  date: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-solve-slide-puzzle',
    titleKey: 'post1Title',
    descKey: 'post1Desc',
    date: '2025-02-01',
    category: 'guide',
  },
  {
    slug: 'jigsaw-puzzle-tips',
    titleKey: 'post2Title',
    descKey: 'post2Desc',
    date: '2025-02-03',
    category: 'tips',
  },
  {
    slug: 'puzzle-brain-benefits',
    titleKey: 'post3Title',
    descKey: 'post3Desc',
    date: '2025-02-05',
    category: 'science',
  },
  {
    slug: 'history-of-photo-puzzles',
    titleKey: 'post4Title',
    descKey: 'post4Desc',
    date: '2025-02-07',
    category: 'history',
  },
  {
    slug: 'difficulty-guide',
    titleKey: 'post5Title',
    descKey: 'post5Desc',
    date: '2025-02-09',
    category: 'guide',
  },
  {
    slug: 'choosing-puzzle-photos',
    titleKey: 'post6Title',
    descKey: 'post6Desc',
    date: '2025-02-12',
    category: 'guide',
  },
];
