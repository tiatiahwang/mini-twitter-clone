import { NextApiRequest, NextApiResponse } from 'next';
import { withApiSession } from '../../../../libs/server/withSession';
import withHandler, {
  ResponseType,
} from '../../../../libs/server/withHandler';
import db from '../../../../libs/server/db';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const {
    query: { id },
  } = req;
  await db.tweet.delete({
    where: {
      id: +id.toString(),
    },
  });
  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({ methods: ['POST'], handler }),
);
