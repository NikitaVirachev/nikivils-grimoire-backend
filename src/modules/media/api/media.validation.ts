import { z } from 'zod';

const mediaParamsSchema = z.object({
  mediaId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export default mediaParamsSchema;
