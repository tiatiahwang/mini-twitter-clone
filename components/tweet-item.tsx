import Link from 'next/link';
import useTimeFormat from '../libs/client/useTimeFormat';
import useMutation from '../libs/client/useMutation';
import { useSWRConfig } from 'swr';
import { cls } from '../libs/client/utils';

interface TweetProps {
  id: number;
  contents: string;
  url: string | null;
  createdAt: Date;
  userId: number;
  user: { id: number; name: string; avatar: string | null };
  _count: {
    favorites: number;
  };
  isLiked: boolean;
}

const TweetItem = (tweet: TweetProps) => {
  const [toggleFav] = useMutation(
    `/api/tweets/${tweet.id}/fav`,
  );
  const { mutate } = useSWRConfig();
  const onFavClick = () => {
    if (!tweet) return;
    mutate(
      '/api/tweets',
      (prev: any) => ({
        tweets: prev.tweets.map((prevTweet: any) =>
          prevTweet.id === tweet.id
            ? {
                ...prevTweet,
                isLiked: !prevTweet.isLiked,
                _count: {
                  favorites: prevTweet.isLiked
                    ? prevTweet._count.favorites - 1
                    : prevTweet._count.favorites + 1,
                },
              }
            : prevTweet,
        ),
      }),
      false,
    );
    toggleFav({});
  };

  return (
    <div key={tweet.id}>
      <div className='m-4 space-y-4'>
        {/* 유저 아바타/이름 */}
        <div className='flex items-center space-x-2'>
          <div
            className={cls(
              'w-10 h-10 rounded-full',
              tweet.user.avatar
                ? `${tweet.user.avatar}`
                : 'bg-indigo-100',
            )}
          />
          <div className='flex flex-col'>
            <span className='text-base text-gray-500 dark:text-gray-200'>
              {tweet.user.name}
            </span>
            <span className='text-xs text-gray-500 dark:text-gray-200'>
              {useTimeFormat(tweet.createdAt!)}
            </span>
          </div>
        </div>
        {/* 트윗 내용 */}
        <Link href={`/tweets/${tweet.id}`}>
          <div className='text-base whitespace-pre leading-relaxed cursor-pointer hover:text-indigo-600 dark:hover:text-gray-400'>
            {tweet.contents}
          </div>
        </Link>
        {/* 사진 링크 */}
        <Link href={`/tweets/${tweet.id}`}>
          {tweet.url !== null ? (
            <img
              src={tweet.url}
              className='w-full h-[300px] object-center cursor-pointer rounded-md border border-indigo-100 dark:border-gray-400'
            />
          ) : (
            <div></div>
          )}
        </Link>
        {/* 좋아요 */}
        <div
          className={cls(
            'flex justify-end text-sm text-gray-500 cursor-pointer hover:text-indigo-600',
            tweet?.isLiked
              ? 'text-indigo-600 hover:text-gray-500'
              : 'text-gray-500 hover:text-indigo-600',
          )}
        >
          <div
            onClick={onFavClick}
            className='flex items-center space-x-1'
          >
            {tweet?.isLiked ? (
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
            <span>{tweet._count.favorites}</span>
          </div>
        </div>
      </div>
      <div className='border-b-[1px] border-indigo-100 dark:border-gray-400' />
    </div>
  );
};

export default TweetItem;
