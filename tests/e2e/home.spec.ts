import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('hero section is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Votre site professionnel en 5 jours' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Commander mon site maintenant' })).toBeVisible();
  });
});
