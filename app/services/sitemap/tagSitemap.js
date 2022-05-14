const Tag = require("../../models/tag.model");
const fs = require("fs");

const tagSitemap = () => {
  return new Promise((resolve) => {
    Tag.find({
      active: true,
      published: true,
    }).then((tags) => {
      try {
        fs.unlinkSync("files/sitemap/tags.xml");
      } catch (err) {
        console.error(err);
      }

      fs.appendFileSync(
        "files/sitemap/tags.xml",
        `<?xml version="1.0" encoding="UTF-8"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
      );

      tags.forEach(function (item) {
        if (item?.slug) {
          fs.appendFileSync(
            "files/sitemap/tags.xml",
            `<url>
              <loc>${process.env.MAIN_URL}/tag/${item.slug
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

      fs.appendFileSync("files/sitemap/tags.xml", "</urlset>");

      resolve("ok");
    });
  });
};

module.exports = tagSitemap;
