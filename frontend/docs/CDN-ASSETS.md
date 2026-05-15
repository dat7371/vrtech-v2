# CDN Asset Setup

Project nay da duoc tach logic asset ra mot cho duy nhat:

- File cau hinh: `js/data/site-config.js`
- Bien can sua: `window.VRTECH_CONFIG.assetBaseUrl`

## Cach dung

Mac dinh:

- `assetBaseUrl: ""`
- Site se doc anh tu thu muc local `images/...`

Khi chuyen sang CDN/storage:

1. Upload dung cau truc thu muc anh len CDN/storage.
2. Sua `assetBaseUrl`, vi du:

```js
window.VRTECH_CONFIG = window.VRTECH_CONFIG || {
  assetBaseUrl: "https://cdn.example.com/vrtech-v2",
};
```

3. Giu nguyen cac duong dan logic trong code nhu `images/products12thv2/...`.

## Quy tac quan trong

- CDN phai giu dung duong dan va ten file nhu trong project.
- Neu doi ten file tren CDN, phai doi lai du lieu trong `js/data/products-data.js`.
- Header, landing, product page va gallery deu da doc qua asset resolver trung tam.
