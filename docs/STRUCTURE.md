# Project Structure

## Root

- `index.html`: landing page
- `pages/app-vrtech.html`: page giới thiệu VRTECH Nexus
- `pages/products/*.html`: các trang sản phẩm riêng

## Components

- `components/shared/`
  - `header.html`
  - `footer.html`

- `components/landing/`
  - toàn bộ section dùng cho landing page:
  - `hero.html`, `problem.html`, `solution.html`, `nexus.html`, `products.html`, `compare.html`, `experience.html`, `official.html`, `vietmap.html`, `warranty.html`, `cta.html`

- `components/product/`
  - toàn bộ section dùng cho product page:
  - `hero.html`, `reasons.html`, `nexus.html`, `performance.html`, `features.html`, `images.html`, `compare.html`, `warranty.html`, `cta.html`

## CSS

- `css/core/`
  - `base.css`: token, font, reset, button, section base
  - `main.css`: file import trung tâm

- `css/layout/`
  - `header.css`
  - `footer.css`
  - `responsive.css`

- `css/sections/`
  - `hero.css`
  - `sections.css`
  - `products.css`

- `css/pages/`
  - `product-page.css`
  - `app.css`

## JavaScript

- `js/core/`
  - `main.js`
  - `menu.js`
  - `reveal.js`

- `js/pages/`
  - `landing-loader.js`
  - `app-page.js`
  - `product-page.js`

- `js/data/`
  - `component-registry.js`
  - `products-data.js`

## Images

- `images/logo/`: logo và biến thể logo
- `images/products/`: bộ ảnh cũ
- `images/products12th/`: bộ ảnh 12 tháng đang dùng cho gallery/product data cũ
- `images/products12thv2/`: bộ ảnh 12 tháng đã sắp xếp lại tên `01` -> `07`, đang dùng cho cover/hero ngoài landing và hero sản phẩm

## Current Asset Rule

- Cover landing hero: `images/products12thv2/all/`
- Card 5 sản phẩm ngoài landing: `images/products12thv2/<model>/...01.jpg`
- Hero đầu trang sản phẩm: `images/products12thv2/<model>/...01.jpg`
- Gallery sản phẩm: hiện vẫn dùng `images/products12th/` cho một số model

Nếu sau này muốn đồng bộ toàn bộ sang một bộ ảnh duy nhất, nên chuyển hết product gallery sang `images/products12thv2/` theo quy ước `01` -> `07`.
