import { allPosts } from "contentlayer/generated";

import { constructMetadata, getBlurDataURL } from "@/lib/utils";
import { BlogPosts } from "@/components/content/blog-posts";

export const metadata = constructMetadata({
  title: "Blog – Oxy Auth",
  description: "Latest news and updates from Next Auth Roles Template.",
});

export default async function BlogPage() {
  const posts = await Promise.all(
    allPosts
      .filter((post) => post.published)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(async (post) => ({
        ...post,
        blurDataURL: await getBlurDataURL(post.image),
      })),
  );

  return <BlogPosts posts={posts} />;
}
