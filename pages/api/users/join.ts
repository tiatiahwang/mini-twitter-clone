const bcrypt = require('bcryptjs');

import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, {
  ResponseType,
} from '../../../libs/server/withHandler';
import db from '../../../libs/server/db';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const { email, password, username } = req.body;

  const checkEmail = await db.user.findUnique({
    where: {
      email,
    },
  });

  const checkUsername = await db.user.findUnique({
    where: {
      name: username,
    },
  });

  if (checkEmail && checkUsername) {
    return res.status(409).json({
      ok: false,
      message: '이메일과 이름이 모두 사용중 입니다.',
    });
  } else if (checkEmail && !checkUsername) {
    return res.status(409).json({
      ok: false,
      message: '다른 이메일을 입력해 주세요.',
    });
  } else if (!checkEmail && checkUsername) {
    return res.status(409).json({
      ok: false,
      message: '다른 이름을 입력해 주세요.',
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name: username,
    },
  });

  res.json({
    ok: true,
  });
}

export default withHandler({
  methods: ['POST'],
  handler,
  isPrivate: false,
});
