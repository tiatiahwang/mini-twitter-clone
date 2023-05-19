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
      <div className='w-full min-h-screen mx-auto max-w-xl'>
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}
