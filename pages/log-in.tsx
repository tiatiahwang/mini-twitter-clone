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

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onValid = (vaildForm: LoginForm) => {
    console.log(vaildForm);
  };

  return (
    <Layout>
      <div className='space-y-4 w-full'>
        <p className='text-4xl text-indigo-500 font-bold '>
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
            register={register('password ', {
              required: true,
            })}
          />
          <div className='pt-4'>
            <Button text='로그인하기' large={true} />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
