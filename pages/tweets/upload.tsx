import { useForm } from 'react-hook-form';
import Input from '../../components/input';
import Layout from '../../components/layout';
import TextArea from '../../components/textarea';
import Button from '../../components/button';

interface UploadTweetForm {
  contents: string;
  url: FileList;
}

interface UploadTweetMutation {
  ok: boolean;
}

const Upload = () => {
  const { register, handleSubmit } =
    useForm<UploadTweetForm>();

  const onValid = (validForm: UploadTweetForm) => {
    console.log(validForm);
  };

  return (
    <Layout>
      <div className='px-4 space-y-4 w-full'>
        <p className='text-4xl text-indigo-500 font-bold'>
          트윗하기
        </p>
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
            label='사진/동영상 URL'
            type='text'
            register={register('url')}
            required={false}
          />
          <div className='pt-4'>
            <Button text='트윗하기' large={true} />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Upload;
