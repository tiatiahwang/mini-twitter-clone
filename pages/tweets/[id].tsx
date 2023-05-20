import Head from 'next/head';
import Layout from '../../components/layout';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import useTimeFormat from '../../libs/client/useTimeFormat';
import { Tweet, User } from '@prisma/client';
import { cls } from '../../libs/client/utils';
import useMutation from '../../libs/client/useMutation';

interface TweetDetailWithUser extends Tweet {
  user: User;
  _count: {
    favorites: number;
  };
  isLiked: boolean;
}

interface TweetDetailResponse {
  ok: boolean;
  tweet: TweetDetailWithUser;
}

const TweetDetail = () => {
  const router = useRouter();
  const { data, mutate } = useSWR<TweetDetailResponse>(
    router.query.id
      ? `/api/tweets/${router.query.id}`
      : null,
  );
  const [toggleFav] = useMutation(
    `/api/tweets/${data?.tweet.id}/fav`,
  );
  const onFavClick = () => {
    if (!data) return;
    mutate(
      {
        ...data,
        tweet: {
          ...data?.tweet,
          isLiked: !data?.tweet.isLiked,
          _count: {
            favorites: data?.tweet.isLiked
              ? data?.tweet._count.favorites - 1
              : data?.tweet._count.favorites + 1,
          },
        },
      },
      false,
    );
    toggleFav({});
  };

  return (
    <Layout title='트윗' canGoBack={true}>
      <Head>
        <title>트윗상세</title>
      </Head>
      <div className='m-4 space-y-4'>
        {/* 유저 아바타/이름 */}
        <div className='flex items-center space-x-2'>
          <div
            className={cls(
              'w-10 h-10 rounded-full',
              data?.tweet?.user?.avatar
                ? `${data?.tweet?.user?.avatar}`
                : 'bg-indigo-100',
            )}
          />
          <span className='text-sm text-gray-500'>
            {data?.tweet?.user?.name} ·{' '}
            <span className='text-xs'>
              {useTimeFormat(data?.tweet?.createdAt!)}
            </span>
          </span>
        </div>
        {/* 트윗 내용 */}
        <div className='text-base whitespace-pre leading-relaxed cursor-pointer hover:text-indigo-600'>
          {data?.tweet?.contents}
        </div>
        {/* 사진/동영상 링크 */}
        {data?.tweet?.url !== null ? (
          <div className='w-full h-[300px] bg-indigo-100' />
        ) : null}
        {/* 좋아요 */}
        <div
          className={cls(
            'flex justify-end text-sm text-gray-500 cursor-pointer hover:text-indigo-600',
            data?.tweet?.isLiked
              ? 'text-indigo-600 hover:text-gray-500'
              : 'text-gray-500 hover:text-indigo-600',
          )}
        >
          <div
            onClick={onFavClick}
            className='flex items-center space-x-1'
          >
            {data?.tweet?.isLiked ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              <svg
                className='h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                />
              </svg>
            )}
            <span>{data?.tweet._count.favorites}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TweetDetail;
