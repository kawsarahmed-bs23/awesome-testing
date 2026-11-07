import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

export const ENVIRONMENTS = ['local', 'dev', 'staging', 'prod'] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

const envSchema = z.object({
  ENV: z.enum(ENVIRONMENTS),
  BASE_URL: z.string().url({ message: 'BASE_URL must be a valid URL' }),
  API_URL: z.string().url({ message: 'API_URL must be a valid URL' }).optional(),
  ADMIN_USERNAME: z.string().min(1, 'ADMIN_USERNAME is required'),
  ADMIN_PASSWORD: z.string().min(1, 'ADMIN_PASSWORD is required'),
});

export type EnvConfig = z.infer<typeof envSchema>;

/** Drops empty values so blank CI variables never shadow values from the .env file. */
function nonEmpty(source: NodeJS.ProcessEnv): Record<string, string> {
  return Object.fromEntries(
    Object.entries(source).filter((entry): entry is [string, string] => !!entry[1]),
  );
}

function loadEnv(): EnvConfig {
  const envName = process.env.ENV || 'staging';
  const envFile = path.resolve(__dirname, `.env.${envName}`);

  const fileValues = fs.existsSync(envFile) ? dotenv.parse(fs.readFileSync(envFile)) : {};

  // Real process env (e.g. CI secrets) always wins over the file.
  const merged = { ...fileValues, ...nonEmpty(process.env), ENV: envName };

  const result = envSchema.safeParse(merged);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.') || 'ENV'}: ${issue.message}`)
      .join('\n');
    const fileHint = fs.existsSync(envFile)
      ? `Loaded from: ${envFile}`
      : `File not found: ${envFile} (copy config/.env.example to create it)`;
    throw new Error(
      `Invalid environment configuration for ENV="${envName}".\n${issues}\n${fileHint}`,
    );
  }

  return result.data;
}

export const env: EnvConfig = loadEnv();
