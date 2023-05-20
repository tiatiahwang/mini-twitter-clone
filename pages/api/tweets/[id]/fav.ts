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
    session: { user },
  } = req;
  const checkFaved = await db.favorite.findFirst({
    where: {
      tweetId: +id!.toString(),
      userId: user?.id,
    },
  });
  if (checkFaved) {
    await db.favorite.delete({
      where: {
        id: checkFaved.id,
      },
    });
  } else {
    await db.favorite.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        tweet: {
          connect: {
            id: +id!.toString(),
          },
        },
      },
    });
  }
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ['POST'], handler }),
);
