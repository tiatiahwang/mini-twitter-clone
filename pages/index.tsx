import Layout from '../components/layout';
import Head from 'next/head';
import { Tweet, User } from '@prisma/client';
import useSWR from 'swr';
import { NextPage } from 'next';
import useTimeFormat from '../libs/client/useTimeFormat';
import Link from 'next/link';

interface TweetWithUser extends Tweet {
  user: User;
}

interface TweetResponse {
  ok: boolean;
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
        <div key={tweet.id}>
          <div className='m-4 space-y-4'>
            {/* 유저 아바타/이름 */}
            <div className='flex items-center space-x-2'>
              <div className='w-10 h-10 rounded-full bg-indigo-100' />
              <span className='text-sm text-gray-500'>
                {tweet.user.name} ·{' '}
                <span className='text-xs'>
                  {useTimeFormat(tweet.createdAt)}
                </span>
              </span>
            </div>
            {/* 트윗 내용 */}
            <Link href={`/tweets/${tweet.id}`}>
              <div className='text-base whitespace-pre leading-relaxed cursor-pointer hover:text-indigo-600'>
                {tweet.contents}
              </div>
            </Link>
            {/* 사진/동영상 링크 */}
            {tweet.url !== null ? (
              <div className='w-full h-[300px] bg-indigo-100' />
            ) : null}
            {/* 좋아요 */}
            <div className='flex justify-end text-sm text-gray-500'>
              <div className='flex items-center space-x-1'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  ></path>
                </svg>
                <span>1</span>
              </div>
            </div>
          </div>
          <div className='border-b-[1px] border-indigo-100' />
        </div>
      ))}
    </Layout>
  );
};

export default Home;
