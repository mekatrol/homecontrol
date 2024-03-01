import { test, expect } from '@playwright/test';

test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('div.sidebar-slider > h1')).toHaveText('hello');
});
