export interface Post {
  id: number;
  userId: number;
  resourceUrl: string;
  publicId?: string;
  width?: number;
  height?: number;

  resourceType: string;
  publicly: boolean;
  category: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedItem {
  image: any,
  category: string;
  description?: string;
}

export const abuseCategory: FeedItem = {
  image: require('../assets/images/feed_banner.jpeg'),
  category: "Abuse of State Resources"
};

export const categoryOptions: FeedItem[] = [
  abuseCategory,
  {
    image: require('../assets/images/violence.jpeg'),
    category: "Public Finance Management"
  },
  {
    image: require('../assets/images/tollgate.jpeg'),
    category: "Natural Resource Governance"
  },
];

export function flattenPostPages (pages: Post[][]) {
  return pages.reduce((acc, page) => {
    return [...acc, ...page];
  }, [] as Post[]);
}

export function toMatrix<T extends any> (arr: T[], width: number) {
  return arr.reduce((rows, key, index) => {
    if (index % width == 0) {
      return [...rows, [key]];
    }
    rows[rows.length - 1].push(key);
    return rows;
  }, [] as T[][]);
}

export function postHasSearchString (post: Post, searchString: string) {

  const descriptionMatches = post.description.toLowerCase().trim()
    .includes(searchString.toLowerCase().trim());

  const categoryMatches = post.category.toLowerCase().trim()
    .includes(searchString.toLowerCase().trim());

  return descriptionMatches || categoryMatches;

}

export function filterPostsBySearch (posts: Post[], searchString: string) {

  if (searchString)
    return posts.filter(post => postHasSearchString(post, searchString));

  return posts;

}