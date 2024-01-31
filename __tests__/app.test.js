import { test, expect } from '@playwright/test';

const cssVariables = async (locator) => {
  const result = await locator.evaluate((el) => {
    const css = el.style.cssText;
    return css.split(';')
      .filter(Boolean)
      .map((str) => str.trim())
      .reduce((acc, str) => {
        const [key, value] = str.split(': ');
        return { ...acc, [key]: value };
      }, {});
  });

  return result;
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.waitForTimeout(300);
});

test.describe('Открытие/закрытие формы', () => {
  test('Открытие форму', async ({ page }) => {
    await page.locator('[class^=ArrowButton-module__container]').click();
    await page.waitForTimeout(500);
    const form = page.locator('form');
    await expect(form, 'Форму должно быть видно').toBeInViewport();
  });

  test('Закрытие форму', async ({ page }) => {
    await page.locator('[class^=ArrowButton-module__container]').click();
    await page.waitForTimeout(500);
    await page.locator('[class^=ArrowButton-module__container]').click();
    await page.waitForTimeout(500);
    const form = page.locator('form');
    await expect(form, 'Формы не должно быть видно').not.toBeInViewport();
  });
});

test.describe('Дефолтные значения', () => {
  const defaultVariables = {
    '--font-family': 'Open Sans',
    '--font-size': '18px',
    '--font-color': '#000000',
    '--container-width': '1394px',
    '--bg-color': '#FFFFFF',
  };

  test('Заданы дефолтные значения стилей', async ({ page }) => {
    await page.locator('[class^=ArrowButton-module__container]').click();
    await page.waitForTimeout(500);
    const main = page.locator('[class^=index-module__main]');
    const mainVariables = await cssVariables(main);
    expect(mainVariables).toMatchObject(defaultVariables);
  });
});

test.describe('Изменение формы', () => {
  test.describe.configure({ mode: 'parallel' });

  const defaultVariables = {
    '--font-family': 'Open Sans',
    '--font-size': '18px',
    '--font-color': '#000000',
    '--container-width': '1394px',
    '--bg-color': '#FFFFFF',
  };

  const forChangeVariables = {
    '--font-family': 'Ubuntu',
    '--font-size': '38px',
    '--font-color': '#FEAFE8',
    '--container-width': '948px',
    '--bg-color': '#6FC1FD'
  };

  test.beforeEach(async ({ page }) => {
    await page.locator('[class^=ArrowButton-module__container]').click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: defaultVariables['--font-family'] }).click();
    await page.locator(`li[value="${forChangeVariables['--font-family']}"]`).click();
    await page.getByTestId(`radio_radio_item_with_value__${forChangeVariables['--font-size']}`).locator('label').click();
    await page.getByRole('button', { name: 'Черный' }).click();
    await page.locator(`li[value="${forChangeVariables['--font-color']}"]`).click();
    await page.getByRole('button', { name: 'Белый' }).click();
    await page.locator(`li[value="${forChangeVariables['--bg-color']}"]`).click();
    await page.getByRole('button', { name: 'Широкий' }).click();
    await page.locator(`li[value="${forChangeVariables['--container-width']}"]`).click();
  });

  test('Изменение полей формы без применения', async ({ page }) => {
    const main = page.locator('[class^=index-module__main]');
    const mainVariables = await cssVariables(main);
    expect(mainVariables).toMatchObject(defaultVariables);
  });

  test('Изменение полей формы с применением', async ({ page }) => {
    await page.getByRole('button', { name: 'Применить' }).click();
    const main = page.locator('[class^=index-module__main]');
    const mainVariables = await cssVariables(main);
    expect(mainVariables).toMatchObject(forChangeVariables);
  });

  test('Сброс полей формы', async ({ page }) => {
    await page.getByRole('button', { name: 'Применить' }).click();
    await page.getByRole('button', { name: 'Сбросить' }).click();
    const main = page.locator('[class^=index-module__main]');
    const mainVariables = await cssVariables(main);
    expect(mainVariables).toMatchObject(defaultVariables);
  });
});