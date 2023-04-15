import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Head from "next/head";

const POSTS = [
  { id: "1", title: "Posts1" },
  { id: "2", title: "Posts2" },
];

// /posts -> ['posts']
// /posts/1 -> ['posts', 'post.id]
// /posts?authorId=1 -> ["posts", {authorId: 1}]
// posts/2/comments -> ["posts", post.id, 'comments']

export default function Home() {
  const queryClient = useQueryClient();
  const postQuery = useQuery({
    queryKey: ["posts"],
    // queryFn: () => wait(1000).then(() => [...POSTS]),
    queryFn: (obj) =>
      wait(1000).then(() => {
        // console.log(obj);
        return [...POSTS];
      }),
  });

  const newPostMutation = useMutation({
    mutationFn: (title: string) => {
      return wait(1000).then(() =>
        POSTS.push({ id: crypto.randomUUID(), title })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (postQuery.isLoading) return <h1>Loading...</h1>;
  if (postQuery.isError) return <pre>{JSON.stringify(postQuery.error)}</pre>;

  function wait(duration: number | undefined) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  console.log(POSTS);
  return (
    <>
      <Head>
        <title>Tanstack query</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>Tanstack query</h1>
        <div>
          {postQuery.data.map((post) => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      </main>
      <button
        disabled={newPostMutation.isLoading}
        onClick={() => newPostMutation.mutate("new post")}
      >
        Add New
      </button>
    </>
  );
}
