import useSWR from 'swr';
import Layout from '../../components/layout';
import useUser from '../../libs/client/useUser';
import TweetItem from '../../components/tweet-item';
import { Tweet, User } from '@prisma/client';
import Button from '../../components/button';
import Link from 'next/link';

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
      {data?.tweets?.length === 0 ? (
        <div className='text-base px-4 text-indigo-400'>
          <p>아직 남기신 트윗이 없어요 😭</p>
          <p>트윗을 남기러 가보실까요?</p>
          <Link href='/tweets/upload'>
            <div className='pt-4 flex items-center space-x-2 font-bold cursor-pointer text-indigo-500 hover:text-indigo-600'>
              <span className='text-2xl'>
                트윗 남기러가기
              </span>
              <div>
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
                  ></path>
                </svg>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        data?.tweets?.map((tweet: any) => (
          <TweetItem key={tweet.id} {...tweet} />
        ))
      )}
    </Layout>
  );
};

export default MyTweets;
