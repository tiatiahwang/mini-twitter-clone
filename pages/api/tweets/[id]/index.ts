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
      _count: {
        select: {
          favorites: true,
        },
      },
    },
  });
  const isLiked = Boolean(
    await db.favorite.findFirst({
      where: {
        tweetId: +id.toString(),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    }),
  );
  const includeIsLiked = { ...tweet, isLiked };
  res.json({
    ok: true,
    tweet: includeIsLiked,
  });
}

export default withApiSession(
  withHandler({ methods: ['GET'], handler }),
);
