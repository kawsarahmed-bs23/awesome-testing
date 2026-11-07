import { expect, test } from '@fixtures/pageFixtures';

test.describe('Health check', { tag: '@smoke' }, () => {
  test('application responds with HTTP 200', async ({ apiHelper }) => {
    expect(await apiHelper.healthCheck('/')).toBe(200);
  });

  test('home page renders', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/The Internet/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('login page is reachable', async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.assertIsVisible();
  });
});
