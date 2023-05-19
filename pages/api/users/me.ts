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
  const profile = await db.user.findUnique({
    where: { id: req.session.user?.id },
  });
  res.json({
    ok: true,
    profile,
  });
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  }),
);
