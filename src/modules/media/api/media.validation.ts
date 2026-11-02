import { z } from 'zod';

const mediaParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: 'Invalid media ID',
  }),
});

export default mediaParamsSchema;
