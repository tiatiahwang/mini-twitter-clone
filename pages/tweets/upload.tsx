import { useForm } from 'react-hook-form';
import Input from '../../components/input';
import Layout from '../../components/layout';
import TextArea from '../../components/textarea';
import Button from '../../components/button';
import useMutation from '../../libs/client/useMutation';
import { useEffect } from 'react';
import { Tweet } from '@prisma/client';
import { useRouter } from 'next/router';

interface UploadTweetForm {
  contents: string;
  url: FileList;
}

interface UploadTweetMutation {
  ok: boolean;
  tweet: Tweet;
}

const Upload = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadTweetForm>();
  const [upload, { loading, data }] =
    useMutation<UploadTweetMutation>('/api/tweets');

  const onValid = (validForm: UploadTweetForm) => {
    if (loading) return;
    upload(validForm);
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/tweets/${data.tweet.id}`);
    }
  }, [data]);

  return (
    <Layout title='트윗하기'>
      <div className='px-4 pt-4 space-y-4 w-full'>
        <form
          className='space-y-4'
          onSubmit={handleSubmit(onValid)}
        >
          <TextArea
            register={register('contents', {
              required: true,
            })}
            name='contents'
            label='내용'
          />
          <Input
            kind='url'
            name='url'
            label='사진 URL'
            type='text'
            register={register('url', {
              pattern: {
                value:
                  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
                message:
                  '올바르지 않은 url 주소네요. 다시 입력해 주세요 🥹',
              },
            })}
            required={false}
          />
          <div className='pt-4'>
            <Button text='트윗하기' large={true} />
          </div>
          {errors ? (
            <p className='text-indigo-700 font-medium dark:text-gray-400 text-center'>
              {errors.url?.message}
            </p>
          ) : null}
        </form>
      </div>
    </Layout>
  );
};

export default Upload;
