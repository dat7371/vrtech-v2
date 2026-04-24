# Project Structure

## Root

- `index.html`: landing page shell, chỉ chứa placeholder để inject component
- `pages/app-vrtech.html`: page giới thiệu VRTECH Nexus
- `pages/app-carlinkit.html`: redirect cũ sang `pages/app-vrtech.html`
- `pages/products/*.html`: các trang sản phẩm riêng
- `scripts/build-component-registry.mjs`: build registry từ các file trong `components/`
- `scripts/build-static-site.mjs`: đóng gói file runtime vào `dist/` để upload host

## Components

`components/` là nguồn chính cho HTML component. Không sửa trực tiếp `js/data/component-registry.js`.

- `components/shared/`
  - `header.html`
  - `footer.html`

- `components/landing/`
  - toàn bộ section dùng cho landing page:
  - `hero.html`, `problem.html`, `solution.html`, `nexus.html`, `products.html`, `compare.html`, `experience.html`, `official.html`, `vietmap.html`, `warranty.html`, `cta.html`

- `components/product/`
  - section đang inject trên product page:
  - `hero.html`, `specs.html`, `cta.html`

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
  - `site-config.js`: cấu hình asset/CDN và helper inject component
  - `component-registry.js`: file generated từ `components/`
  - `products-data.js`

## Page Flow

- Landing: `index.html` khai báo placeholder, `js/pages/landing-loader.js` inject theo thứ tự trong `LANDING_COMPONENTS`.
- Product: `pages/products/*.html` khai báo placeholder, `js/pages/product-page.js` inject theo thứ tự trong `PRODUCT_PAGE_COMPONENTS`, sau đó render data theo `body[data-product]`.
- App page: `pages/app-vrtech.html` tự chứa nội dung riêng, chỉ inject shared header.

## Build Rule

Sau khi sửa file trong `components/`, chạy:

```bash
npm run build
```

Lệnh này sinh lại `js/data/component-registry.js`. Trước khi bàn giao hoặc deploy, chạy:

```bash
npm run check
```

Khi cần tạo bản upload host/shared hosting, chạy:

```bash
npm run dist
```

Thư mục `dist/` chỉ chứa file runtime cần deploy: `index.html`, `pages/`, `css/`, `js/`, `images/` và `.nojekyll`.

## Images

- `images/logo/`: logo và biến thể logo
- `images/products12th/`: bộ ảnh cũ, giữ lại để tham chiếu hoặc rollback khi cần
- `images/products12thv2/`: bộ ảnh đang dùng chính cho landing, product hero, product gallery và ảnh minh họa chi tiết

## Current Asset Rule

- Cover landing hero: `images/products12thv2/all/`
- Card 5 sản phẩm ngoài landing: `images/products12thv2/<model>/...01.jpg`
- Hero đầu trang sản phẩm: `images/products12thv2/<model>/...01.jpg`
- Gallery và ảnh chi tiết sản phẩm: `images/products12thv2/<model>/...02` trở đi, cộng thêm ảnh app/permit khi có
- Không tham chiếu trực tiếp ảnh bằng `../images/...` trong component; giữ path logic dạng `images/...` để `window.VRTECH_ASSETS.asset()` xử lý theo page depth hoặc CDN.
