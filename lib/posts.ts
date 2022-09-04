export interface Post {
  id: number;
  userId: number;
  uuid: string;
  resourceUrl: string;
  publicId?: string;
  width?: number;
  height?: number;

  resourceType: "Image" | "Video";
  publicly: boolean;
  category: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PostCategory = "Abuse of State Resources" | "Public Finance Management" | "Natural Resource Governance";

export const categoryOptions: PostCategory[] = [
  "Abuse of State Resources",
  "Public Finance Management",
  "Natural Resource Governance",
];

export type UploadMode = "Publicly" | "Anonymously";
export const uploadModes: UploadMode[] = ["Publicly", "Anonymously"];

export function toMatrix<T extends any> (arr: T[], width: number): T[][] {
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