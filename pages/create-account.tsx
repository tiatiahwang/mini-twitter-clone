import { useForm } from 'react-hook-form';
import Input from '../components/input';
import Layout from '../components/layout';
import Button from '../components/button';
import { useEffect, useState } from 'react';
import useMutation from '../libs/client/useMutation';
import { useRouter } from 'next/router';

interface AccountForm {
  email: string;
  username: string;
  password: string;
}

interface MutationResult {
  ok: boolean;
  message?: string;
}

const CreateAccount = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<AccountForm>();
  const [join, { loading, data }] =
    useMutation<MutationResult>('/api/users/join');
  const [errorMessage, setErrorMessage] = useState('');

  const onValid = (validForm: AccountForm) => {
    if (loading) return;
    join(validForm);
  };

  useEffect(() => {
    if (!data?.ok) {
      setErrorMessage(data?.message!);
    } else {
      router.push('/log-in');
    }
  }, [data]);

  return (
    <Layout>
      <div className='px-4 space-y-4 w-full'>
        <p className='text-4xl text-indigo-500 font-bold'>
          가입하기
        </p>
        <form
          className='space-y-4'
          onSubmit={handleSubmit(onValid)}
        >
          <Input
            label='이메일'
            name='email'
            kind='email'
            type='email'
            required={true}
            register={register('email', { required: true })}
          />
          <Input
            label='이름'
            name='username'
            kind='username'
            type='username'
            required={true}
            register={register('username', {
              required: true,
            })}
          />
          <Input
            label='비밀번호'
            name='password'
            kind='password'
            type='password'
            required={true}
            register={register('password', {
              required: true,
            })}
          />
          <div className='pt-4'>
            <Button text='가입하기' large={true} />
          </div>
        </form>
        {errorMessage !== '' ? (
          <p className='text-center text-indigo-700 font-medium'>
            {errorMessage}
          </p>
        ) : null}
      </div>
    </Layout>
  );
};

export default CreateAccount;
