import { z } from 'zod';

const postParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: 'Invalid post ID',
  }),
});

export default postParamsSchema;
