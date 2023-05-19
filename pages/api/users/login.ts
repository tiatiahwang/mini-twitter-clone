const bcrypt = require('bcryptjs');

import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, {
  ResponseType,
} from '../../../libs/server/withHandler';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const { email, password } = req.body;

  const isExist = await db?.user.findUnique({
    where: {
      email,
    },
  });
  if (!isExist) {
    return res.status(404).json({
      ok: false,
      message: '가입되지 않은 이메일 입니다.',
    });
  }

  const isMatch = await bcrypt.compare(
    password,
    isExist.password,
  );
  if (!isMatch) {
    return res.status(404).json({
      ok: false,
      message: '비밀번호를 확인해 주세요.',
    });
  }

  req.session.user = {
    id: isExist.id,
  };
  await req.session.save();

  res.json({ ok: true });
}

export default withHandler({
  methods: ['POST'],
  handler,
  isPrivate: false,
});
