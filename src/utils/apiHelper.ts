import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { createLogger } from './logger';

const log = createLogger('ApiHelper');

/**
 * Thin wrapper around Playwright's APIRequestContext for hybrid API + UI tests:
 * seed data before a UI flow, verify side effects after it, or run fast health checks.
 */
export class ApiHelper {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string,
  ) {}

  private url(endpoint: string): string {
    return new URL(endpoint, this.baseURL).toString();
  }

  async get(endpoint: string, headers?: Record<string, string>): Promise<APIResponse> {
    log.debug(`GET ${endpoint}`);
    return this.request.get(this.url(endpoint), { headers });
  }

  async post(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    log.debug(`POST ${endpoint}`);
    return this.request.post(this.url(endpoint), { data, headers });
  }

  async put(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    log.debug(`PUT ${endpoint}`);
    return this.request.put(this.url(endpoint), { data, headers });
  }

  async delete(endpoint: string, headers?: Record<string, string>): Promise<APIResponse> {
    log.debug(`DELETE ${endpoint}`);
    return this.request.delete(this.url(endpoint), { headers });
  }

  /** Returns the HTTP status of the given endpoint (defaults to the root). */
  async healthCheck(endpoint = '/'): Promise<number> {
    const response = await this.get(endpoint);
    log.info(`Health check ${endpoint} -> ${response.status()}`);
    return response.status();
  }
}
