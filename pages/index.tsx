import Layout from '../components/layout';
import Head from 'next/head';
import { Tweet, User } from '@prisma/client';
import useSWR from 'swr';
import { NextPage } from 'next';
import TweetItem from '../components/tweet-item';

interface TweetWithUser extends Tweet {
  user: User;
  _count: {
    favorites: number;
  };
  isLiked: boolean;
}

interface TweetResponse {
  tweets: TweetWithUser[];
}

const Home: NextPage = () => {
  const { data } = useSWR<TweetResponse>('/api/tweets');

  return (
    <Layout title='홈' noBottomMargin={true}>
      <Head>
        <title>홈</title>
      </Head>
      {data?.tweets?.map((tweet) => (
        <TweetItem key={tweet.id} {...tweet} />
      ))}
    </Layout>
  );
};

export default Home;
