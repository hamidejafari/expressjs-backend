const Product = require("../../models/product.model");
const fs = require("fs");

const productSitemap = () => {
  return new Promise((resolve) => {
    Product.find({
      active: true,
      published: true,
      noIndex: false,
    }).then((product) => {
      try {
        fs.unlinkSync("files/sitemap/products.xml");
      } catch (err) {
        console.error(err);
      }
      fs.appendFileSync(
        "files/sitemap/products.xml",
        `<?xml version="1.0" encoding="UTF-8"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
      );

      product.forEach(function (item) {
        if (item.slug) {
          fs.appendFileSync(
            "files/sitemap/products.xml",
            `<url>
              <loc>${process.env.MAIN_URL}/${item.slug
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

      fs.appendFileSync("files/sitemap/products.xml", "</urlset>");

      resolve("ok");
    });
  });
};

module.exports = productSitemap;
