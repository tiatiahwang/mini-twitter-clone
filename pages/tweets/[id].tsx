import React from 'react';

import Head from 'next/head';
import Layout from '../../components/layout';

const Home = () => {
  return (
    <Layout title='트윗' canGoBack={true}>
      <Head>
        <title>트윗상세</title>
      </Head>

      <div className='m-4 space-y-4'>
        <div className='flex items-center space-x-2'>
          <div className='w-10 h-10 rounded-full bg-indigo-100' />
          <span className='text-sm text-gray-500'>
            유저네임 | 15시간전
          </span>
        </div>
        <div className='text-base'>
          내용내용내용내용내용내용내용내용내용내용내용내용
        </div>
        <div className='w-full h-[300px] bg-indigo-100' />
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
    </Layout>
  );
};

export default Home;
