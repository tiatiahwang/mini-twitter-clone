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
    body: { contents, url },
    query: { id },
    session: { user },
  } = req;
  await db.tweet.update({
    where: {
      id: +id.toString(),
    },
    data: {
      contents,
      url: url === '' ? null : url,
    },
  });
  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({ methods: ['POST'], handler }),
);
