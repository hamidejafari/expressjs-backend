const Comparison = require("../../models/comparison.model");
const fs = require("fs");
const Brand = require("../../models/brand.model");

const comparisonSitemap = () => {
  return new Promise((resolve) => {
    Comparison.find({})
      .populate({
        path: "compare1Id",
        match: {
          "attributes.1": { $exists: true },
          active: true,
          published: true,
        },
      })
      .populate({
        path: "compare2Id",
        match: {
          "attributes.1": { $exists: true },
          active: true,
          published: true,
        },
      })
      .then((comparisons) => {
        try {
          fs.unlinkSync("files/sitemap/comparisons.xml");
        } catch (err) {
          console.error(err);
        }
        fs.appendFileSync(
          "files/sitemap/comparisons.xml",
          `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
        );
        for (const comparison of comparisons) {
          if (
            comparison?.compare1Id?._id &&
            comparison?.compare2Id?._id &&
            comparison.slug
          ) {
            fs.appendFileSync(
              "files/sitemap/comparisons.xml",
              `<url>
                <loc>${process.env.MAIN_URL}/${comparison.slug
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&apos;")}</loc>
                <lastmod>${
                  comparison.updatedAt.toISOString().split("T")[0]
                }</lastmod>
                <changefreq>daily</changefreq>
              </url>`
            );
          }
        }

        Comparison.find({ onModel: "brand" })
          .select("compare1Id compare2Id")
          .then((brandComaprisons) => {
            const brandIds = [];
            brandComaprisons.forEach((element) => {
              brandIds.push(element.compare1Id.toString());
              brandIds.push(element.compare2Id.toString());
            });
            const unique = [...new Set(brandIds)];
            Brand.find({
              _id: { $in: unique },
              "attributes.1": { $exists: true },
              special: { $ne: "ourBrand" },
            })
              .select("updatedAt slug")
              .limit(50)
              .then((brands) => {
                for (const brand of brands) {
                  fs.appendFileSync(
                    "files/sitemap/comparisons.xml",
                    `<url>
                      <loc>${process.env.MAIN_URL}/comparison/${brand.slug
                      .replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                      .replace(/"/g, "&quot;")
                      .replace(/'/g, "&apos;")}</loc>
                    <lastmod>${
                      brand.updatedAt.toISOString().split("T")[0]
                    }</lastmod>
                <changefreq>daily</changefreq>
              </url>`
                  );
                }


            fs.appendFileSync("files/sitemap/comparisons.xml", "</urlset>");

            resolve("ok");
            
              });

          });
      });
  });
};

module.exports = comparisonSitemap;
