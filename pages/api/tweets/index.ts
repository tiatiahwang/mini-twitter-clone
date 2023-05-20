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
  if (req.method === 'GET') {
    const {
      session: { user },
    } = req;
    const tweets = await db.tweet.findMany({
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
        favorites: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const includeIsLiked = tweets.map((tweet: any) => ({
      ...tweet,
      isLiked:
        tweet.favorites.filter(
          (favorite: any) => favorite.userId === user?.id,
        ).length === 1
          ? true
          : false,
    }));

    res.json({
      ok: true,
      tweets: includeIsLiked,
    });
  }
  if (req.method === 'POST') {
    const {
      body: { contents, url },
      session: { user },
    } = req;
    const tweet = await db.tweet.create({
      data: {
        contents,
        url: url === '' ? null : url,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      tweet,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ['GET', 'POST'], handler }),
);
