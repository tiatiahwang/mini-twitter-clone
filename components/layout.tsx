import { useRouter } from 'next/router';
import { cls } from '../libs/client/utils';
import NavBar from './navbar';
import ToggleMode from './toggle-mode';

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  noBottomMargin?: boolean;
  children: React.ReactNode;
}

export default function Layout({
  title,
  canGoBack,
  noBottomMargin = false,
  children,
}: LayoutProps) {
  const router = useRouter();
  const onClick = () => {
    router.back();
  };
  return (
    <div className='flex min-h-screen pt-4'>
      <NavBar />
      <div className='flex-1 pl-[60px]'>
        <div
          className={cls(
            'px-4',
            noBottomMargin ? '' : 'pb-4',
          )}
        >
          {canGoBack ? (
            <button
              onClick={onClick}
              className='text-indigo-500 dark:text-gray-500'
            >
              <svg
                className='h-6 w-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='3'
                  d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
                ></path>
              </svg>
            </button>
          ) : null}
          <div className='flex justify-between'>
            {title ? (
              <span
                className={cls(
                  'text-4xl text-indigo-500 dark:text-gray-300 font-bold',
                  canGoBack ? 'pl-4' : '',
                  '',
                )}
              >
                {title}
              </span>
            ) : null}
            <ToggleMode />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
