const bcrypt = require('bcryptjs');

import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, {
  ResponseType,
} from '../../../../libs/server/withHandler';
import db from '../../../../libs/server/db';
import { withApiSession } from '../../../../libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method === 'GET') {
    const profile = await db.user.findUnique({
      where: { id: req.session.user?.id },
    });
    res.json({
      ok: true,
      profile,
    });
  }
  if (req.method === 'POST') {
    const {
      body: { email, username, password },
      session: { user },
    } = req;
    if (
      email === '' &&
      username === '' &&
      password === ''
    ) {
      return res.status(400).json({
        ok: false,
        message: '수정할 내용이 없어요 🥲',
      });
    }

    if (email) {
      const isExist = Boolean(
        await db.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        }),
      );
      if (isExist) {
        return res.status(409).json({
          ok: false,
          message: '다른 이메일을 입력해 주세요.',
        });
      }
      await db.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      });
      res.json({ ok: true });
    }
    if (username) {
      const isExist = Boolean(
        await db.user.findUnique({
          where: {
            name: username,
          },
          select: {
            id: true,
          },
        }),
      );
      if (isExist) {
        return res.status(409).json({
          ok: false,
          message: '다른 이름을 입력해 주세요.',
        });
      }
      await db.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name: username,
        },
      });
      res.json({ ok: true });
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        password,
        salt,
      );
      await db.user.update({
        where: {
          id: user?.id,
        },
        data: {
          password: hashedPassword,
        },
      });
      res.json({ ok: true });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  }),
);
