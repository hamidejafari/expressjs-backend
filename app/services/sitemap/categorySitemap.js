const Category = require("../../models/category.model");
const fs = require("fs");

const categorySitemap = () => {
  return new Promise((resolve) => {
    Category.find({
      type: "category",
      active: true,
      published: true,
      noIndex: false,
    }).then((categories) => {
      try {
        fs.unlinkSync("files/sitemap/categories.xml");
      } catch (err) {
        console.error(err);
      }

      fs.appendFileSync(
        "files/sitemap/categories.xml",
        `<?xml version="1.0" encoding="UTF-8"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
      );

      categories.forEach(function (item) {
        if (item.slug) {
          fs.appendFileSync(
            "files/sitemap/categories.xml",
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

      fs.appendFileSync("files/sitemap/categories.xml", "</urlset>");

      resolve("ok");
    });
  });
};

module.exports = categorySitemap;
