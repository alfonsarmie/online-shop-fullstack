import { test, expect } from '@playwright/test';

test.describe('E2E - Test obligatorio', () => {
  test('usuario puede acceder y navegar en la aplicación', async ({ page }) => {
    // 1. Acceder a la aplicación
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 2. Verificar que la página principal carga correctamente
    await expect(page).toHaveTitle(/Rowing Club|Frontend/i);
    await expect(page.locator('body')).toBeVisible();
    
    // 3. Verificar que el navbar existe y es funcional
    const navbar = page.locator('nav, .navbar, header');
    await expect(navbar).toBeVisible();
    
    // 4. Probar navegación básica (si existe)
    const homeLink = page.locator('a[href="/"], a:has-text("Inicio"), a:has-text("Home")').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page.url()).toMatch(/\/$|\/home$/);
    }
    
    // 5. Verificar que hay contenido significativo
    const bodyContent = await page.textContent('body');
    expect(bodyContent?.length).toBeGreaterThan(100);
    
    // 6. Tomar screenshot manual
    await page.screenshot({ path: 'test-results/aplicacion-funcionando.png' });
    
    console.log('✅ Test E2E obligatorio completado - Aplicación funcional');
    console.log('📸 Screenshot guardado en: test-results/aplicacion-funcionando.png');
  });
});