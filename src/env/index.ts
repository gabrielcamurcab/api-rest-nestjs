import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().optional().default(3333)
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error('Invalid enviroment variables', _env.error.format());

    throw new Error('Invalid enviroment variables.');
}

export type Env = z.infer<typeof envSchema>

export const env = _env.data;