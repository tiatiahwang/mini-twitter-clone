import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, {
  ResponseType,
} from '../../../libs/server/withHandler';
import db from '../../../libs/server/db';
import { withApiSession } from '../../../libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const {
    session: { user },
  } = req;
  if (!user) {
    return res
      .status(403)
      .json({ ok: false, message: '잘못된 요청입니다.' });
  }

  await req.session.destroy();
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  }),
);
