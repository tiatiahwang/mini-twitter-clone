import { withIronSessionApiRoute } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: 'minitwitter',
  password: 'jNV4e9sQMbd5-u&La++2-Nv9u+m!s^@Z%bEB-BNx',
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}
