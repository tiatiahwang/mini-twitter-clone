import useSWR from 'swr';
import Layout from '../../components/layout';
import useUser from '../../libs/client/useUser';
import TweetItem from '../../components/tweet-item';
import { Tweet, User } from '@prisma/client';

interface MyTweetWithUser extends Tweet {
  user: User;
  _count: {
    favorites: number;
  };
  isLiked: boolean;
}

interface MyTweetResponse {
  tweets: MyTweetWithUser[];
}

const MyTweets = () => {
  const { user } = useUser();
  const { data } = useSWR<MyTweetResponse>(
    '/api/users/me/mytweets',
  );
  return (
    <Layout title={`${user?.name}님의 트윗`} canGoBack>
      {data?.tweets?.map((tweet: any) => (
        <TweetItem key={tweet.id} {...tweet} />
      ))}
    </Layout>
  );
};

export default MyTweets;
