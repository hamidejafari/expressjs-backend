const Brand = require("../../models/brand.model");
const fs = require("fs");

const brandSitemap = () => {
  return new Promise((resolve) => {
    Brand.find({
      active: true,
      published: true,
      noIndex: false,
    }).then((brand) => {
      try {
        fs.unlinkSync("files/sitemap/brands.xml");
      } catch (err) {
        console.error(err);
      }

      fs.appendFileSync(
        "files/sitemap/brands.xml",
        `<?xml version="1.0" encoding="UTF-8"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
      );

      brand.forEach((item) => {
        if (item?.slug) {
          fs.appendFileSync(
            "files/sitemap/brands.xml",
            `<url>
              <loc>${process.env.MAIN_URL}/brand/${item.slug
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&apos;")}</loc>
              <lastmod>${item.updatedAt.toISOString().split("T")[0]}</lastmod>
              <changefreq>daily</changefreq>
            </url>`
          );
        }
      });

      fs.appendFileSync("files/sitemap/brands.xml", "</urlset>");

      resolve("ok");
    });
  });
};

module.exports = brandSitemap;
