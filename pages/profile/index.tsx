import { useForm } from 'react-hook-form';
import Input from '../../components/input';
import Layout from '../../components/layout';
import Button from '../../components/button';
import { useEffect, useState } from 'react';
import useMutation from '../../libs/client/useMutation';
import { useRouter } from 'next/router';
import useUser from '../../libs/client/useUser';
import { cls } from '../../libs/client/utils';

interface ProfileForm {
  email?: string;
  username?: string;
  password?: string;
  avatar?: string;
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
  const [avatarColor, setAvatarColor] = useState(
    user?.avatar,
  );

  const onValid = ({
    email,
    password,
    username,
    avatar,
  }: ProfileForm) => {
    if (loading) return;
    if (email === user?.email) {
      email = '';
    }
    if (username === user?.name) {
      username = '';
    }
    if (avatar === user?.avatar) {
      avatar = '';
    }
    editProfile({
      email,
      password,
      username,
      avatar: avatarColor,
    });
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
          <div className='flex justify-between space-x-4'>
            <div
              className={cls(
                'w-20 h-20 rounded-full cursor-pointer',
                avatarColor
                  ? `${avatarColor}`
                  : 'bg-indigo-100',
              )}
            />
            <div className='space-y-2'>
              <div className='text-xs'>
                아바타 색상 선택
              </div>
              <div className='flex space-x-2'>
                <div className='w-6 h-6 bg-indigo-100 rounded-full cursor-pointer' />
                <div
                  className='w-6 h-6 bg-indigo-200 rounded-full cursor-pointer'
                  onClick={() =>
                    setAvatarColor('bg-indigo-200')
                  }
                />
                <div
                  className='w-6 h-6 bg-indigo-300 rounded-full cursor-pointer'
                  onClick={() =>
                    setAvatarColor('bg-indigo-300')
                  }
                />
                <div
                  className='w-6 h-6 bg-indigo-400 rounded-full cursor-pointer'
                  onClick={() =>
                    setAvatarColor('bg-indigo-400')
                  }
                />
                <div
                  className='w-6 h-6 bg-indigo-500 rounded-full cursor-pointer'
                  onClick={() =>
                    setAvatarColor('bg-indigo-500')
                  }
                />
                <div
                  className='w-6 h-6 bg-indigo-600 rounded-full cursor-pointer'
                  onClick={() =>
                    setAvatarColor('bg-indigo-600')
                  }
                />
              </div>
              <div className='flex space-x-2'>
                <div
                  className='w-6 h-6 bg-pink-100 rounded-full cursor-pointer'
                  onClick={() =>
                    setAvatarColor('bg-pink-100')
                  }
                />
                <div
                  className='w-6 h-6 bg-pink-200 rounded-full cursor-pointer'
                  onClick={() =>
                    setAvatarColor('bg-pink-200')
                  }
                />
                <div
                  className='w-6 h-6 bg-pink-300 rounded-full cursor-pointer'
                  onClick={() =>
                    setAvatarColor('bg-pink-300')
                  }
                />
                <div
                  className='w-6 h-6 bg-pink-400 rounded-full cursor-pointer'
                  onClick={() =>
                    setAvatarColor('bg-pink-400')
                  }
                />
                <div
                  className='w-6 h-6 bg-pink-500 rounded-full cursor-pointer'
                  onClick={() =>
                    setAvatarColor('bg-pink-500')
                  }
                />
                <div
                  className='w-6 h-6 bg-pink-600 rounded-full cursor-pointer'
                  onClick={() =>
                    setAvatarColor('bg-pink-600')
                  }
                />
              </div>
            </div>
          </div>
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
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
