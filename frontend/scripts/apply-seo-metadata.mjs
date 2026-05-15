import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const defaultSiteUrl = "https://carlinkitv2.vn/";
const siteUrl = String(process.env.SITE_URL || defaultSiteUrl).trim().replace(/\/+$/, "/");
const siteName = "Carlinkit V2 by VRTECH";
const organizationName = "CARLINKIT VN STORE x VRTECH";
const defaultImage = "images/products12thv2/all/TBOX V2 SERIES.webp";
const homepageFaq = [
  [
    "Carlinkit TBOX V2 by VRTECH là gì?",
    "Đây là Android Box dành cho ô tô, cắm vào màn hình zin để dùng thêm YouTube, bản đồ, nghe nhạc và các ứng dụng giải trí. Bản VRTECH được phân phối chính ngạch, có bảo hành điện tử và hỗ trợ xuất hóa đơn VAT khi khách cần.",
  ],
  [
    "Xe nào dùng được Carlinkit TBOX V2?",
    "Thông thường xe có Apple CarPlay có dây hoặc Android Auto tương thích là có thể dùng. Để chắc hơn, bạn chỉ cần gửi đời xe, dòng xe và hình màn hình hiện tại, bên mình sẽ kiểm tra trước khi chốt bản phù hợp.",
  ],
  [
    "Carlinkit V2 by VRTECH khác hàng trôi nổi thế nào?",
    "Điểm khác biệt nằm ở phần sau bán hàng: có pháp nhân Việt Tín, mã số thuế rõ ràng, chính sách bảo hành điện tử, hỗ trợ kỹ thuật và hóa đơn VAT. Khách dễ kiểm tra nguồn gốc hơn, không phải tự xử lý khi thiết bị phát sinh lỗi.",
  ],
  [
    "Nên chọn S2A, S2P, PLUS, AMBIENT hay ULTRA MAX?",
    "Nếu dùng cơ bản thì chọn S2A. Nếu muốn dễ chọn và ổn cho đa số xe, S2P là bản hợp lý nhất. PLUS phù hợp khách muốn dư hiệu năng hơn, AMBIENT dành cho người thích thiết kế nổi bật, còn ULTRA MAX là bản mạnh nhất.",
  ],
  [
    "Carlinkit TBOX V2 có cần SIM không?",
    "Không bắt buộc trong mọi trường hợp. Bạn có thể dùng SIM 4G hoặc phát Wi-Fi từ điện thoại, tùy phiên bản và thói quen sử dụng. Nếu thường xuyên xem video, dùng bản đồ online hoặc tải ứng dụng, nên có kết nối internet ổn định.",
  ],
  [
    "Bảo hành điện tử hoạt động như thế nào?",
    "Sau khi kích hoạt, thông tin bảo hành được lưu theo số điện thoại mua hàng và serial thiết bị. Khi cần kiểm tra, bạn nhập lại thông tin trên trang bảo hành để xem ngày kích hoạt, thời hạn còn lại và trạng thái thiết bị.",
  ],
  [
    "Có xuất hóa đơn VAT không?",
    "Có. Nếu cần VAT, bạn cung cấp thông tin công ty hoặc thông tin xuất hóa đơn ngay khi đặt hàng để bên mình xử lý đúng theo quy định.",
  ],
];

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
        legalName: "CÔNG TY TNHH KINH DOANH CÔNG NGHỆ VIỆT TÍN",
        taxID: "0318134894",
        url: absoluteUrl(""),
        logo: absoluteUrl("images/logo/LOGO VRTECH-02.png"),
        email: "support@vrtech.vn",
        telephone: "033 453 2635",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Số 13 Phạm Huy Thông, Phường Gò Vấp",
          addressLocality: "TP Hồ Chí Minh",
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
        ].map(([name, url], index) => ({
          "@type": "ListItem",
          position: index + 1,
          name,
          url: absoluteUrl(url),
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: homepageFaq.map(([name, text]) => ({
          "@type": "Question",
          name,
          acceptedAnswer: {
            "@type": "Answer",
            text,
          },
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
    file: "pages/huong-dan-mua-hang.html",
    url: "pages/huong-dan-mua-hang.html",
    title: "Hướng dẫn mua hàng | Carlinkit V2 by VRTECH",
    description: "Hướng dẫn mua hàng Carlinkit V2 by VRTECH: chọn sản phẩm, gửi thông tin tư vấn, xác nhận đơn hàng, thanh toán, giao nhận và kích hoạt bảo hành điện tử.",
    image: defaultImage,
    type: "article",
    priority: "0.6",
    changefreq: "yearly",
  },
  {
    file: "pages/kien-thuc.html",
    url: "pages/kien-thuc.html",
    canonicalUrl: "kien-thuc",
    title: "Kiến thức Android Box ô tô & Carlinkit V2 | VRTECH",
    description: "Chuyên mục kiến thức về Android Box ô tô, Carlinkit V2, cách chọn phiên bản TBOX V2 và kinh nghiệm phân biệt hàng chính hãng VRTECH.",
    image: defaultImage,
    type: "website",
    sitemap: false,
    priority: "0.8",
    changefreq: "weekly",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Kiến thức Android Box ô tô & Carlinkit V2",
        description: "Tổng hợp các bài hướng dẫn về Android Box ô tô, Carlinkit V2 và kinh nghiệm chọn mua sản phẩm chính hãng VRTECH.",
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
    file: "pages/android-box-o-to-la-gi.html",
    url: "pages/android-box-o-to-la-gi.html",
    title: "Android Box là gì? Ưu nhược điểm & có nên lắp cho ô tô không?",
    description: "Android Box là gì, ưu nhược điểm ra sao, xe nào dùng được và có nên lắp Android Box ô tô không? Hướng dẫn dễ hiểu từ Carlinkit V2 by VRTECH.",
    image: defaultImage,
    type: "article",
    priority: "0.8",
    changefreq: "monthly",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Android Box là gì? Ưu nhược điểm & có nên lắp cho ô tô không?",
        description: "Hướng dẫn cơ bản về Android Box ô tô, xe tương thích, ưu nhược điểm và cách chọn Carlinkit TBOX V2 by VRTECH.",
        author: {
          "@type": "Organization",
          name: organizationName,
        },
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
    file: "pages/carlinkit-v2-la-gi.html",
    url: "pages/carlinkit-v2-la-gi.html",
    title: "Carlinkit V2 là gì? | Carlinkit TBOX V2 by VRTECH",
    description: "Carlinkit V2 là gì, khác gì so với Android Box thông thường, gồm những phiên bản nào và nên chọn bản nào trong hệ Carlinkit TBOX V2 by VRTECH.",
    image: defaultImage,
    type: "article",
    priority: "0.8",
    changefreq: "monthly",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Carlinkit V2 là gì?",
        description: "Tổng quan về Carlinkit TBOX V2 by VRTECH và các phiên bản S2A, S2P, PLUS, AMBIENT, ULTRA MAX.",
        author: {
          "@type": "Organization",
          name: organizationName,
        },
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
    file: "pages/carlinkit-vrtech-chinh-hang.html",
    url: "pages/carlinkit-vrtech-chinh-hang.html",
    title: "Carlinkit VRTECH chính hãng | Carlinkit V2 by VRTECH",
    description: "Carlinkit VRTECH chính hãng khác gì hàng trôi nổi: pháp nhân rõ ràng, bảo hành điện tử, hỗ trợ kỹ thuật, xuất VAT và tư vấn theo dòng xe.",
    image: defaultImage,
    type: "article",
    priority: "0.8",
    changefreq: "monthly",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Carlinkit VRTECH chính hãng khác gì hàng trôi nổi?",
        description: "Thông tin về nguồn hàng, bảo hành điện tử, hỗ trợ VAT và tư vấn kỹ thuật của Carlinkit V2 by VRTECH.",
        author: {
          "@type": "Organization",
          name: organizationName,
        },
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
    file: "pages/so-sanh-carlinkit-s2a-s2p-plus-ambient-ultra.html",
    url: "pages/so-sanh-carlinkit-s2a-s2p-plus-ambient-ultra.html",
    title: "So sánh Carlinkit S2A, S2P, PLUS, AMBIENT, ULTRA MAX | VRTECH",
    description: "So sánh nhanh các phiên bản Carlinkit TBOX V2 by VRTECH: S2A, S2P, PLUS, AMBIENT và ULTRA MAX để chọn Android Box ô tô phù hợp.",
    image: "images/products12thv2/all/Sosanh.webp",
    type: "article",
    priority: "0.8",
    changefreq: "monthly",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "So sánh Carlinkit S2A, S2P, PLUS, AMBIENT và ULTRA MAX",
        description: "Hướng dẫn chọn phiên bản Carlinkit TBOX V2 by VRTECH theo nhu cầu sử dụng Android Box ô tô.",
        author: {
          "@type": "Organization",
          name: organizationName,
        },
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
    file: "pages/chinh-sach-bao-mat.html",
    url: "pages/chinh-sach-bao-mat.html",
    title: "Chính sách bảo mật thông tin | Carlinkit V2 by VRTECH",
    description: "Chính sách bảo mật thông tin và thông báo xử lý dữ liệu cá nhân khi khách hàng sử dụng website Carlinkit V2 by VRTECH.",
    image: defaultImage,
    type: "article",
    priority: "0.5",
    changefreq: "yearly",
  },
  {
    file: "pages/dieu-khoan-su-dung.html",
    url: "pages/dieu-khoan-su-dung.html",
    title: "Điều khoản sử dụng | Carlinkit V2 by VRTECH",
    description: "Điều khoản sử dụng website Carlinkit V2 by VRTECH, phạm vi thông tin sản phẩm, trách nhiệm người dùng và giới hạn trách nhiệm.",
    image: defaultImage,
    type: "article",
    priority: "0.5",
    changefreq: "yearly",
  },
  {
    file: "pages/chinh-sach-doi-tra.html",
    url: "pages/chinh-sach-doi-tra.html",
    title: "Chính sách đổi trả và hoàn tiền | Carlinkit V2 by VRTECH",
    description: "Chính sách đổi trả, hoàn tiền và tiếp nhận lỗi sản phẩm Carlinkit V2 by VRTECH.",
    image: defaultImage,
    type: "article",
    priority: "0.5",
    changefreq: "yearly",
  },
  {
    file: "pages/chinh-sach-van-chuyen.html",
    url: "pages/chinh-sach-van-chuyen.html",
    title: "Chính sách vận chuyển và giao nhận | Carlinkit V2 by VRTECH",
    description: "Chính sách vận chuyển, giao nhận, kiểm hàng và xử lý phát sinh khi mua sản phẩm Carlinkit V2 by VRTECH.",
    image: defaultImage,
    type: "article",
    priority: "0.5",
    changefreq: "yearly",
  },
  {
    file: "pages/chinh-sach-thanh-toan.html",
    url: "pages/chinh-sach-thanh-toan.html",
    title: "Chính sách thanh toán và hóa đơn VAT | Carlinkit V2 by VRTECH",
    description: "Chính sách thanh toán, xác nhận đơn hàng, xuất hóa đơn VAT và bảo mật thông tin thanh toán tại Carlinkit V2 by VRTECH.",
    image: defaultImage,
    type: "article",
    priority: "0.5",
    changefreq: "yearly",
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
  const dynamicEntries = [
    {
      url: "kien-thuc",
      changefreq: "weekly",
      priority: "0.8",
    },
  ];
  const entries = [
    ...pages.filter((page) => page.sitemap !== false),
    ...dynamicEntries,
  ]
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
Sitemap: ${absoluteUrl("sitemap-posts.xml")}
`;
}

await Promise.all(pages.map(updateHtmlPage));
await writeFile(path.join(projectRoot, "sitemap.xml"), buildSitemap(), "utf8");
await writeFile(path.join(projectRoot, "robots.txt"), buildRobots(), "utf8");

console.log(`SEO metadata applied for ${pages.length} pages`);
