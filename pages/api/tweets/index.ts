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
    const tweets = await db.tweet.findMany({
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
      tweets,
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
