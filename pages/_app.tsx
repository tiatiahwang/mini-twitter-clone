import { SWRConfig } from 'swr';
import '../styles/globals.css';

export default function App({ Component, pageProps }: any) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className='w-full min-h-screen text-gray-700 bg-[#F5F5F5] dark:text-white dark:bg-[#111827] fixed inset-0 overflow-auto'>
        <div className='mx-auto max-w-xl bg-[#f9f9f9] dark:bg-[#1F2937]'>
          <Component {...pageProps} />
        </div>
      </div>
    </SWRConfig>
  );
}
