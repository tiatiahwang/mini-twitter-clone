import { NextApiRequest, NextApiResponse } from 'next';
import { withApiSession } from '../../../libs/server/withSession';
import withHandler, {
  ResponseType,
} from '../../../libs/server/withHandler';
import db from '../../../libs/server/db';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const {
    query: { id },
  } = req;
  const tweet = await db.tweet.findFirst({
    where: {
      id: +id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  res.json({
    ok: true,
    tweet,
  });
}

export default withApiSession(
  withHandler({ methods: ['GET'], handler }),
);
