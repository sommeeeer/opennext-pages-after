import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';

type Repo = {
  name: string;
  stargazers_count: number;
};

export const getServerSideProps = (async () => {
  // Fetch data from external API
  const res = await fetch('https://api.github.com/repos/vercel/next.js');
  const time = new Date().toISOString();
  console.log('initial time: ', time);
  const repo: Repo = await res.json();
  // Pass data to the page via props
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for('@next/request-context');
  // @ts-expect-error thi sis fine
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL].get().waitUntil(
    new Promise((resolve) => {
      setTimeout(() => {
        const time = new Date().toISOString();
        console.log('waited for 5 seconds: ', time);
        resolve('we here');
      }, 5000);
    })
  );
  return { props: { repo } };
}) satisfies GetServerSideProps<{ repo: Repo }>;

export default function Page({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <p>{repo.stargazers_count}</p>
    </main>
  );
}
