import { useRouter } from 'next/router';
import Layout from '../components/layout';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useMutation from '../libs/client/useMutation';
import Input from '../components/input';
import Button from '../components/button';

interface LoginForm {
  email: string;
  password: string;
}

interface MutationResult {
  ok: boolean;
  message?: string;
}

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>();
  const [login, { loading, data }] =
    useMutation<MutationResult>('/api/users/login');
  const [errorMessage, setErrorMessage] = useState('');

  const onValid = (vaildForm: LoginForm) => {
    if (loading) return;
    login(vaildForm);
  };

  useEffect(() => {
    if (!data?.ok) {
      setErrorMessage(data?.message!);
    } else {
      router.push('/');
    }
  }, [data]);

  return (
    <Layout>
      <div className='px-4 space-y-4 w-full'>
        <p className='text-4xl text-indigo-500 font-bold'>
          로그인
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
            label='비밀번호'
            name='password'
            kind='password'
            type='password'
            required={true}
            register={register('password', {
              required: true,
            })}
          />
          {errorMessage !== '' ? (
            <p className='pt-4 text-center text-indigo-700 font-medium'>
              {errorMessage}
            </p>
          ) : null}
          <div className='pt-4'>
            <Button text='로그인하기' large={true} />
          </div>
        </form>
        <div className='relative pt-4'>
          <div className='absolute w-full border-t border-indigo-100' />
          <div className='relative -top-3 text-center'>
            <span className='bg-white px-2 text-sm text-indigo-200'>
              아직 계정이 없으시다면
            </span>
          </div>
          <Button
            text={'가입하기'}
            large={true}
            transparentBg={true}
            onClick={() => router.push('/create-account')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
