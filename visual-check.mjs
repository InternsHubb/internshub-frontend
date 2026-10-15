import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer-core';

const CHROME =
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:4173/';
const SHOTS = fileURLToPath(new URL('./shots/', import.meta.url));

fs.mkdirSync(SHOTS, { recursive: true });

let failures = 0;
function check(name, condition, detail) {
  const line = `${condition ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`;
  console.log(line);
  if (!condition) failures += 1;
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const viewports = [
  { w: 360, h: 780 },
  { w: 768, h: 1024 },
  { w: 1194, h: 900 },
  { w: 1600, h: 1000 },
];

for (const { w, h } of viewports) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('requestfailed', (r) => errors.push(`requestfailed ${r.url()}`));
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`);
  });

  await page.setViewport({ width: w, height: h });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    h1: document.querySelectorAll('h1').length,
    h2: document.querySelectorAll('h2').length,
    main: document.querySelectorAll('main').length,
    aside: document.querySelectorAll('aside').length,
    dir: document.documentElement.dir || 'ltr',
    fontLoaded: document.fonts.check('700 20px "Plus Jakarta Sans"'),
    bg: getComputedStyle(document.querySelector('aside')).backgroundImage,
  }));

  check(`${w}px: no horizontal scroll`, metrics.scrollWidth <= metrics.clientWidth + 1,
    `scroll=${metrics.scrollWidth} client=${metrics.clientWidth}`);
  check(`${w}px: exactly one h1`, metrics.h1 === 1, `got ${metrics.h1}`);
  check(`${w}px: main + aside landmarks`, metrics.main === 1 && metrics.aside === 1);
  check(`${w}px: brand gradient applied`, metrics.bg.includes('linear-gradient'));
  check(`${w}px: no console/page errors`, errors.length === 0, errors.join(' | '));

  await page.screenshot({ path: `${SHOTS}${w}-ltr.png` });

  const responsive = await page.evaluate(() => {
    const visible = (el) =>
      !!el && el.offsetParent !== null && getComputedStyle(el).display !== 'none';
    const byText = (needle) =>
      [...document.querySelectorAll('aside img, aside p, aside li')].find((el) =>
        `${el.getAttribute('alt') ?? ''}${el.textContent ?? ''}`.includes(needle),
      );
    return {
      image: visible(document.querySelector('aside img')),
      card: visible(byText('Learn with structure')),
      description: visible(byText('Continue learning')),
      keyword: visible(byText('Career')),
    };
  });

  if (w < 640) {
    check('360px: brand image hidden (compact header)', !responsive.image);
    check('360px: floating cards hidden', !responsive.card);
    check('360px: description hidden', !responsive.description);
    check('360px: keyword chips hidden', !responsive.keyword);
  } else if (w < 1024) {
    check('768px: brand image visible (tablet, reduced size)', responsive.image);
    check('768px: floating cards hidden below lg (no clipping)', !responsive.card);
    check('768px: description visible', responsive.description);
    check('768px: keyword chips visible', responsive.keyword);
  } else {
    check('1194px: brand image visible', responsive.image);
    check('1194px: floating cards visible', responsive.card);
    check('1194px: description visible', responsive.description);
  }

  if (w === 1194) {
    const a11y = await page.evaluate(() => {
      const toRgb = (c) => c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
      const lum = ([r, g, b]) => {
        const f = (v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const ratio = (fg, bg) => {
        const l1 = lum(toRgb(fg));
        const l2 = lum(toRgb(bg));
        const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
        return (hi + 0.05) / (lo + 0.05);
      };
      const main = document.querySelector('main');
      const find = (needle) =>
        [...main.querySelectorAll('p, a, span')].find((el) =>
          (el.textContent ?? '').includes(needle),
        );
      const subtitle = find('Use your email');
      const link = find('Visit Help Center');
      const eyebrow = [...main.querySelectorAll('p')].find((p) =>
        p.className.includes('uppercase'),
      );
      const toggle = document.querySelector('button[aria-pressed]');
      return {
        subtitleRatio: ratio(getComputedStyle(subtitle).color, 'rgb(255,255,255)'),
        linkRatio: ratio(getComputedStyle(link).color, 'rgb(255,255,255)'),
        eyebrowRatio: ratio(getComputedStyle(eyebrow).color, 'rgb(255,255,255)'),
        eyebrowFontSize: getComputedStyle(eyebrow).fontSize,
        eyebrowColor: getComputedStyle(eyebrow).color,
        toggleHeight: toggle.getBoundingClientRect().height,
      };
    });
    check('1194: subtitle contrast >= 4.5', a11y.subtitleRatio >= 4.5, a11y.subtitleRatio.toFixed(2));
    check('1194: help link contrast >= 4.5', a11y.linkRatio >= 4.5, a11y.linkRatio.toFixed(2));
    check('1194: mock toggle touch target >= 44px', a11y.toggleHeight >= 44, `${a11y.toggleHeight}px`);
    console.log(
      `INFO form eyebrow contrast ${a11y.eyebrowRatio.toFixed(2)}:1 at ${a11y.eyebrowFontSize} (${a11y.eyebrowColor}) — DESIGN.md token #dc6e0d`,
    );

    const brandPanel = await page.evaluate(() => {
      const img = document.querySelector('aside img');
      const panel = document.querySelector('aside');
      const h2 = document.querySelector('aside h2');
      const imgRect = img.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const cs = getComputedStyle(img);
      const cards = [...document.querySelectorAll('aside .shadow-xl')].map((c) =>
        c.getBoundingClientRect(),
      );
      const innerWidth = panelRect.width - 2 * 58;
      return {
        srcIsBrandImage: img.src.includes('auth-brand-image'),
        ratio: imgRect.width / imgRect.height,
        widthShare: imgRect.width / innerWidth,
        objectFit: cs.objectFit,
        topLeft: parseFloat(cs.borderTopLeftRadius),
        topRight: parseFloat(cs.borderTopRightRadius),
        bottomRight: parseFloat(cs.borderBottomRightRadius),
        cardsCount: cards.length,
        cardsInsideImage: cards.every(
          (r) =>
            r.left >= imgRect.left - 1 &&
            r.right <= imgRect.right + 1 &&
            r.top >= imgRect.top - 1 &&
            r.bottom <= imgRect.bottom + 1,
        ),
        h2WhiteSpace: getComputedStyle(h2).whiteSpace,
        h2Text: h2.textContent,
        keywordDashes: [...document.querySelectorAll('aside ul span')]
          .map((s) => s.textContent)
          .join(''),
      };
    });
    check('1194: image uses auth-brand-image.jpg', brandPanel.srcIsBrandImage);
    check('1194: image aspect ~1.6:1', Math.abs(brandPanel.ratio - 1.6) < 0.08,
      brandPanel.ratio.toFixed(3));
    check('1194: image ~90% of panel inner width', Math.abs(brandPanel.widthShare - 0.9) < 0.03,
      brandPanel.widthShare.toFixed(3));
    check('1194: image object-fit cover', brandPanel.objectFit === 'cover');
    check('1194: asymmetric corners (TL & BR > TR & BL in LTR)',
      brandPanel.topLeft > brandPanel.topRight && brandPanel.bottomRight > brandPanel.topRight,
      JSON.stringify(brandPanel));
    check('1194: two floating cards over image', brandPanel.cardsCount === 2 && brandPanel.cardsInsideImage,
      JSON.stringify({ n: brandPanel.cardsCount, inside: brandPanel.cardsInsideImage }));
    check('1194: headline split via pre-line', brandPanel.h2WhiteSpace === 'pre-line' && brandPanel.h2Text.includes('Welcome back to'));
    check('1194: keywords dash-separated', brandPanel.keywordDashes === '——', brandPanel.keywordDashes);
  }

  if (w === 360 || w === 1194) {
    await page.click('button[aria-pressed]');
    await new Promise((r) => setTimeout(r, 200));
    const rtl = await page.evaluate(() => {
      const aside = document.querySelector('aside').getBoundingClientRect();
      const main = document.querySelector('main').getBoundingClientRect();
      return {
        dir: document.documentElement.dir,
        lang: document.documentElement.lang,
        hasArabic: document.body.innerText.includes('مرحباً بعودتك'),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        asideLeft: aside.left,
        mainLeft: main.left,
        asideWidth: aside.width,
      };
    });
    check(`${w}px RTL: dir=rtl + Arabic copy`, rtl.dir === 'rtl' && rtl.hasArabic);
    check(`${w}px RTL: lang=ar`, rtl.lang === 'ar', rtl.lang);
    check(`${w}px RTL: no horizontal scroll`, rtl.scrollWidth <= rtl.clientWidth + 1,
      `scroll=${rtl.scrollWidth} client=${rtl.clientWidth}`);
    if (w === 1194) {
      check('1194px RTL: aside on right side', rtl.asideLeft > rtl.mainLeft,
        `aside.left=${rtl.asideLeft} main.left=${rtl.mainLeft}`);
      check('1194px RTL: columns ~54/46', Math.abs(rtl.asideWidth / 1194 - 0.54) < 0.02,
        `aside.width=${rtl.asideWidth}`);
    }
    await page.screenshot({ path: `${SHOTS}${w}-rtl.png` });
    await page.click('button[aria-pressed]');
    await new Promise((r) => setTimeout(r, 200));
  }

  if (w === 1194) {
    const focusReport = [];
    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press('Tab');
      const active = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').trim().slice(0, 40),
          outlineWidth: cs.outlineWidth,
          outlineStyle: cs.outlineStyle,
        };
      });
      if (active) focusReport.push(active);
    }
    check('keyboard: tab reaches help link', focusReport.some((f) => f.tag === 'a'),
      JSON.stringify(focusReport));
    check('keyboard: tab reaches toggle button', focusReport.some((f) => f.tag === 'button'));
    check('keyboard: every focused element has visible outline',
      focusReport.every((f) => f.outlineStyle !== 'none' && f.outlineWidth !== '0px'),
      JSON.stringify(focusReport));

    const proportions = await page.evaluate(() => {
      const aside = document.querySelector('aside').getBoundingClientRect();
      const main = document.querySelector('main').getBoundingClientRect();
      const col = document.querySelector('main > div > div').getBoundingClientRect();
      return { asideW: aside.width, mainW: main.width, colW: col.width, vh: window.innerHeight };
    });
    check('1194: brand ~54% / form ~46%',
      Math.abs(proportions.asideW / 1194 - 0.54) < 0.02 && Math.abs(proportions.mainW / 1194 - 0.46) < 0.02,
      JSON.stringify(proportions));
    check('1194: form column max-width 430', Math.abs(proportions.colW - 430) <= 1,
      `col=${proportions.colW}`);
    check('1194: panel fills viewport height', proportions.vh <= 900 + 1,
      JSON.stringify(proportions));
  }

  await page.close();
}

await browser.close();
console.log(failures === 0 ? 'ALL VISUAL CHECKS PASSED' : `${failures} VISUAL CHECK(S) FAILED`);
if (failures > 0) process.exitCode = 1;
