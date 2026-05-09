import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const defaultSiteUrl = "https://dat7371.github.io/vrtech-v2/";
const siteUrl = String(process.env.SITE_URL || defaultSiteUrl).trim().replace(/\/+$/, "/");
const siteName = "Carlinkit V2 by VRTECH";
const organizationName = "CARLINKIT VN STORE x VRTECH";
const defaultImage = "images/products12thv2/all/TBOX V2 SERIES.webp";

const pages = [
  {
    file: "index.html",
    url: "",
    title: "Carlinkit TBOX V2 by VRTECH | Android Box ô tô chính ngạch",
    description: "Carlinkit TBOX V2 phiên bản độc quyền bởi VRTECH: Android Box ô tô chính ngạch, tích hợp VRTECH Connect, bảo hành điện tử và xuất VAT đầy đủ.",
    image: defaultImage,
    type: "website",
    priority: "1.0",
    changefreq: "weekly",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: organizationName,
        url: absoluteUrl(""),
        logo: absoluteUrl("images/logo/LOGO VRTECH-02.png"),
        email: "support@vrtech.vn",
        telephone: "033 453 2635",
        address: {
          "@type": "PostalAddress",
          streetAddress: "13 Phạm Huy Thông, Phường 1, Gò Vấp",
          addressLocality: "TP.HCM",
          addressCountry: "VN",
        },
        sameAs: [
          "https://www.facebook.com/p/VR-TECH-61581241367632/",
          "https://www.tiktok.com/@vrtechofficial",
          "https://www.youtube.com/@VRTECHOFFICIAL-bl4zj",
          "https://shopee.vn/vrtech_offical_carplaybox",
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteName,
        url: absoluteUrl(""),
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Danh sách sản phẩm Carlinkit V2 by VRTECH",
        itemListElement: [
          ["Carlinkit TBOX S2A V2", "pages/products/s2a.html"],
          ["Carlinkit TBOX S2P V2", "pages/products/s2p.html"],
          ["Carlinkit TBOX PLUS V2", "pages/products/plus.html"],
          ["Carlinkit TBOX AMBIENT V2", "pages/products/ambient.html"],
          ["Carlinkit ULTRA MAX V2", "pages/products/ultra.html"],
          ["Vietmap Live Pro 2026", "pages/products/vietmap.html"],
        ].map(([name, url], index) => ({
          "@type": "ListItem",
          position: index + 1,
          name,
          url: absoluteUrl(url),
        })),
      },
    ],
  },
  {
    file: "pages/app-vrtech.html",
    url: "pages/app-vrtech.html",
    title: "VRTECH Connect | Ứng dụng quản lý Android Box VRTECH",
    description: "Tải VRTECH Connect để quản lý Android Box VRTECH chính hãng, kích hoạt bảo hành điện tử, theo dõi thiết bị và truy cập hệ sinh thái VRTECH Nexus.",
    image: "images/products12thv2/app/appvrtechnexus.webp",
    type: "website",
    priority: "0.8",
    changefreq: "monthly",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "VRTECH Connect",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "iOS, Android",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "VND",
        },
      },
    ],
  },
  {
    file: "pages/bao-hanh.html",
    url: "pages/bao-hanh.html",
    title: "Chính sách bảo hành Carlinkit TBOX V2 VRTECH",
    description: "Chính sách bảo hành điện tử 12 tháng cho TBOX V2 VRTECH / Carlinkit V2 2026 do CARLINKIT VN STORE x VRTECH phân phối.",
    image: "images/products12thv2/all/baohanh.webp",
    type: "article",
    priority: "0.7",
    changefreq: "monthly",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Chính sách bảo hành Carlinkit TBOX V2 VRTECH",
        description: "Chính sách bảo hành điện tử 12 tháng cho TBOX V2 VRTECH / Carlinkit V2 2026.",
        publisher: {
          "@type": "Organization",
          name: organizationName,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("images/logo/LOGO VRTECH-02.png"),
          },
        },
      },
    ],
  },
  {
    file: "pages/app-carlinkit.html",
    url: "pages/app-carlinkit.html",
    canonicalUrl: "pages/app-vrtech.html",
    title: "Đang chuyển hướng | VRTECH Connect",
    description: "Trang App Carlinkit đã được hợp nhất vào trang VRTECH Connect.",
    image: "images/products12thv2/app/appvrtechnexus.webp",
    type: "website",
    noindex: true,
    sitemap: false,
  },
  ...[
    ["pages/products/s2a.html", "Carlinkit TBOX S2A V2 2026 | VRTECH", "TBOX S2A V2 by VRTECH: Android Box ô tô bản tiêu chuẩn, chip Qualcomm 6115, tích hợp VRTECH Nexus, bảo hành điện tử và xuất VAT đầy đủ.", "images/products12thv2/s2av2/TBOX S2A 01.webp", "Carlinkit", "Android Box Ô Tô", "3849000"],
    ["pages/products/s2p.html", "Carlinkit TBOX S2P V2 2026 | VRTECH", "TBOX S2P V2 by VRTECH: Android Box ô tô cân bằng giá và hiệu năng, chip Qualcomm 6225, VRTECH Nexus, bảo hành điện tử và xuất VAT đầy đủ.", "images/products12thv2/s2pv2/TBOX S2P 01.webp", "Carlinkit", "Android Box Ô Tô", "4349000"],
    ["pages/products/plus.html", "Carlinkit TBOX PLUS V2 2026 | VRTECH", "TBOX PLUS V2 by VRTECH: Android Box ô tô nâng cấp hợp lý cho nhu cầu hằng ngày, tích hợp VRTECH Nexus, bảo hành điện tử và VAT đầy đủ.", "images/products12thv2/plusv2/TBOX PLUS 01.webp", "Carlinkit", "Android Box Ô Tô", "4299000"],
    ["pages/products/ambient.html", "Carlinkit TBOX AMBIENT V2 2026 | VRTECH", "TBOX AMBIENT V2 by VRTECH: Android Box ô tô thẩm mỹ cao cấp, LED ambient nổi bật, VRTECH Nexus, bảo hành điện tử và VAT đầy đủ.", "images/products12thv2/ambientv2/TBOX AMBIENT 01.webp", "Carlinkit", "Android Box Ô Tô", "4349000"],
    ["pages/products/ultra.html", "Carlinkit TBOX ULTRA MAX V2 2026 | VRTECH", "TBOX ULTRA MAX V2 by VRTECH: Android Box ô tô flagship hiệu năng mạnh, tối ưu đa nhiệm, VRTECH Nexus và bảo hành điện tử 12 tháng.", "images/products12thv2/ultrav2/TBOX ULTRA MAX 01.webp", "Carlinkit", "Android Box Ô Tô", "6199000"],
    ["pages/products/vietmap.html", "Vietmap Live Pro 2026 chính hãng | VRTECH", "Vietmap Live Pro chính hãng 2026: dẫn đường, cảnh báo tốc độ, camera phạt nguội và dữ liệu giao thông cho điện thoại, Android Box và màn hình ô tô.", "images/vietmap/vietmap 01.webp", "Vietmap", "Ứng dụng dẫn đường", "480000"],
  ].map(([file, title, description, image, brand, category, price]) => ({
    file,
    url: file,
    title,
    description,
    image,
    type: "product",
    priority: "0.8",
    changefreq: "monthly",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: title.replace(" | VRTECH", ""),
        description,
        image: [absoluteUrl(image)],
        brand: {
          "@type": "Brand",
          name: brand,
        },
        category,
        offers: {
          "@type": "Offer",
          url: absoluteUrl(file),
          priceCurrency: "VND",
          price,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      },
    ],
  })),
];

function absoluteUrl(target = "") {
  return new URL(String(target).replace(/^\.?\//, ""), siteUrl).toString();
}

function normalizeJsonLd(data, page) {
  return {
    ...data,
    url: data.url || absoluteUrl(page.canonicalUrl || page.url),
  };
}

function buildSeoBlock(page) {
  const canonicalUrl = absoluteUrl(page.canonicalUrl || page.url);
  const imageUrl = absoluteUrl(page.image || defaultImage);
  const robots = page.noindex ? "noindex,follow" : "index,follow,max-image-preview:large";
  const jsonLd = [
    ...(page.jsonLd || []),
    ...buildBreadcrumbJsonLd(page),
  ].map((item) => normalizeJsonLd(item, page));
  const jsonLdTags = jsonLd.map((item, index) => `  <script type="application/ld+json" id="seo-jsonld-${index + 1}">${JSON.stringify(item)}</script>`).join("\n");

  return [
    "  <!-- SEO metadata generated by scripts/apply-seo-metadata.mjs -->",
    `  <meta name="robots" content="${robots}" />`,
    `  <link rel="canonical" href="${canonicalUrl}" />`,
    `  <meta property="og:locale" content="vi_VN" />`,
    `  <meta property="og:type" content="${page.type || "website"}" />`,
    `  <meta property="og:site_name" content="${siteName}" />`,
    `  <meta property="og:title" content="${escapeAttribute(page.title)}" />`,
    `  <meta property="og:description" content="${escapeAttribute(page.description)}" />`,
    `  <meta property="og:url" content="${canonicalUrl}" />`,
    `  <meta property="og:image" content="${imageUrl}" />`,
    `  <meta name="twitter:card" content="summary_large_image" />`,
    `  <meta name="twitter:title" content="${escapeAttribute(page.title)}" />`,
    `  <meta name="twitter:description" content="${escapeAttribute(page.description)}" />`,
    `  <meta name="twitter:image" content="${imageUrl}" />`,
    jsonLdTags,
    "  <!-- /SEO metadata generated by scripts/apply-seo-metadata.mjs -->",
  ].filter(Boolean).join("\n");
}

function buildBreadcrumbJsonLd(page) {
  if (page.noindex || page.file === "index.html") {
    return [];
  }

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Trang chủ",
      item: absoluteUrl("index.html"),
    },
  ];

  if (page.url.startsWith("pages/products/")) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: "Sản phẩm",
      item: absoluteUrl("index.html#products"),
    });
  }

  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: page.title.replace(" | VRTECH", ""),
    item: absoluteUrl(page.canonicalUrl || page.url),
  });

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    },
  ];
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function replaceOrInsertSeoBlock(html, seoBlock) {
  const pattern = /\n\s*<!-- SEO metadata generated by scripts\/apply-seo-metadata\.mjs -->[\s\S]*?<!-- \/SEO metadata generated by scripts\/apply-seo-metadata\.mjs -->/;

  if (pattern.test(html)) {
    return html.replace(pattern, `\n${seoBlock}`);
  }

  return html.replace(/\s*<link rel="canonical"[^>]*>\s*/i, "\n").replace("</head>", `${seoBlock}\n</head>`);
}

async function updateHtmlPage(page) {
  const absolutePath = path.join(projectRoot, page.file);
  let html = await readFile(absolutePath, "utf8");

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(page.title)}</title>`);

  if (/<meta name="description"[^>]*>/i.test(html)) {
    html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeAttribute(page.description)}" />`);
  } else {
    html = html.replace("</title>", `</title>\n  <meta name="description" content="${escapeAttribute(page.description)}" />`);
  }

  html = replaceOrInsertSeoBlock(html, buildSeoBlock(page));
  await writeFile(absolutePath, html, "utf8");
}

function buildSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries = pages
    .filter((page) => page.sitemap !== false)
    .map((page) => `  <url>
    <loc>${absoluteUrl(page.url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq || "monthly"}</changefreq>
    <priority>${page.priority || "0.7"}</priority>
  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("sitemap.xml")}
`;
}

await Promise.all(pages.map(updateHtmlPage));
await writeFile(path.join(projectRoot, "sitemap.xml"), buildSitemap(), "utf8");
await writeFile(path.join(projectRoot, "robots.txt"), buildRobots(), "utf8");

console.log(`SEO metadata applied for ${pages.length} pages`);
