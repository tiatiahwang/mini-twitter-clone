import Head from 'next/head';
import Layout from '../../../components/layout';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import useTimeFormat from '../../../libs/client/useTimeFormat';
import { Tweet, User } from '@prisma/client';
import { cls } from '../../../libs/client/utils';
import useMutation from '../../../libs/client/useMutation';
import useUser from '../../../libs/client/useUser';
import Link from 'next/link';
import { useEffect } from 'react';

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

interface MutationResult {
  ok: boolean;
}

const TweetDetail = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<TweetDetailResponse>(
    router.query.id
      ? `/api/tweets/${router.query.id}`
      : null,
  );
  const [deleteTweet, { loading, data: deleteStatus }] =
    useMutation(`/api/tweets/${router.query.id}/delete`);
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

  const onClickDelete = () => {
    const check = confirm('정말로 삭제하시겠어요?');
    if (check) {
      if (loading) return;
      deleteTweet({});
    }
  };

  useEffect(() => {
    if (deleteStatus && deleteStatus?.ok) {
      router.push('/');
    }
  }, [deleteStatus, router]);

  return (
    <Layout title='트윗' canGoBack={true}>
      <Head>
        <title>트윗상세</title>
      </Head>
      <div className='m-4 space-y-4'>
        {/* 유저 아바타/이름 및 트윗 수정/삭제 */}
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <div
              className={cls(
                'w-10 h-10 rounded-full',
                data?.tweet?.user?.avatar
                  ? `${data?.tweet?.user?.avatar}`
                  : 'bg-indigo-100',
              )}
            />
            <div className='flex flex-col'>
              <span className='text-base text-gray-600 dark:text-gray-200'>
                {data?.tweet?.user?.name}
              </span>
              <span className='text-xs text-gray-600 dark:text-gray-200'>
                {useTimeFormat(data?.tweet?.createdAt!)}
              </span>
            </div>
          </div>
          {user?.id === data?.tweet?.userId ? (
            <div className='flex space-x-3'>
              <Link
                href={{
                  pathname: `/tweets/${data?.tweet?.id}/edit`,
                  query: {
                    contents: data?.tweet?.contents,
                    url: data?.tweet?.url,
                  },
                }}
              >
                <button className='hover:text-indigo-500 hover:dark:text-gray-500'>
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
                    ></path>
                  </svg>
                </button>
              </Link>
              <button
                className='hover:text-indigo-500 hover:dark:text-gray-500'
                onClick={onClickDelete}
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                  ></path>
                </svg>
              </button>
            </div>
          ) : null}
        </div>
        {/* 트윗 내용 */}
        <div className='text-base whitespace-pre leading-relaxed'>
          {data?.tweet?.contents}
        </div>
        {/* 사진 링크 */}
        {data?.tweet?.url !== null ? (
          <img
            src={data?.tweet?.url}
            className='w-full h-[300px] object-center cursor-pointer rounded-md border border-indigo-100 dark:border-gray-400'
          />
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
