import { useForm } from 'react-hook-form';
import Input from '../../components/input';
import Layout from '../../components/layout';
import Button from '../../components/button';
import { useEffect, useState } from 'react';
import useMutation from '../../libs/client/useMutation';
import { useRouter } from 'next/router';
import useUser from '../../libs/client/useUser';

interface ProfileForm {
  email?: string;
  username?: string;
  password?: string;
}

interface MutationResult {
  ok: boolean;
  message?: string;
}

const Profile = () => {
  const router = useRouter();
  const { user } = useUser();
  const { register, handleSubmit, setValue } =
    useForm<ProfileForm>();
  const [editProfile, { loading, data }] =
    useMutation<MutationResult>('/api/users/me');
  const [
    logout,
    { loading: logoutLoading, data: logoutStatus },
  ] = useMutation<MutationResult>('/api/users/logout');
  const [errorMessage, setErrorMessage] = useState('');

  const onValid = (validForm: ProfileForm) => {
    if (loading) return;
    if (validForm.email === user?.email) {
      validForm.email = '';
    }
    if (validForm.username === user?.name) {
      validForm.username = '';
    }
    editProfile(validForm);
  };

  useEffect(() => {
    if (user?.email) setValue('email', user.email);
    if (user?.name) setValue('username', user.name);
  }, [user, setValue]);

  useEffect(() => {
    if (!data?.ok) {
      setErrorMessage(data?.message!);
    } else {
      alert('수정이 완료되었습니다 😃');
    }
  }, [data]);

  const onClickLogout = () => {
    if (logoutLoading) return;
    logout({});
  };

  useEffect(() => {
    if (logoutStatus && logoutStatus.ok) {
      router.push('/');
    }
  }, [logoutStatus]);

  return (
    <Layout title='프로필'>
      <div className='px-4 space-y-4 w-full'>
        <form
          className='space-y-4'
          onSubmit={handleSubmit(onValid)}
        >
          <Input
            label='이메일'
            name='email'
            kind='email'
            type='email'
            required={false}
            register={register('email')}
          />
          <Input
            label='이름'
            name='username'
            kind='username'
            type='username'
            required={false}
            register={register('username')}
          />
          <Input
            label='비밀번호'
            name='password'
            kind='password'
            type='password'
            required={false}
            register={register('password')}
          />
          <div className='pt-4'>
            <Button text='프로필 수정하기' large={true} />
          </div>
        </form>
        {errorMessage !== '' ? (
          <p className='text-center text-indigo-700 font-medium'>
            {errorMessage}
          </p>
        ) : null}
        <div className=''>
          <Button
            text={'로그아웃'}
            large={true}
            transparentBg={true}
            onClick={onClickLogout}
          />
          <Button
            text={'탈퇴하기'}
            large={true}
            transparentBg={true}
            onClick={() => router.push('/create-account')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
