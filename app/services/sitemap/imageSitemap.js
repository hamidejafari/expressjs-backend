const Brand = require("../../models/brand.model");
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const fs = require("fs");

const imageSitemap = () => {
  return new Promise((resolve) => {
    Brand.find({
      active: true,
      published: true,
    }).then((brands) => {
      try {
        fs.unlinkSync("files/sitemap/images.xml");
      } catch (err) {
        console.error(err);
      }

      fs.appendFileSync(
        "files/sitemap/images.xml",
        `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`
      );

      for (const brand of brands) {
        if (
          brand.headerImage?.fileName ||
          brand.image?.fileName ||
          brand.imageProduct?.fileName
        ) {
          let str = `<url>
          <loc>${process.env.MAIN_URL}/brand/${brand.slug}</loc>`;

          if (brand.headerImage?.fileName) {
            str =
              str +
              `<image:image>
                <image:loc>${process.env.MAIN_URL}/files/images/main/${brand.headerImage.fileName}</image:loc>
                <image:caption>${brand.headerImage.alt}</image:caption>
              </image:image>`;
          }

          if (brand.image?.fileName) {
            str =
              str +
              `<image:image>
                <image:loc>${process.env.MAIN_URL}/files/images/main/${brand.image.fileName}</image:loc>
                <image:caption>${brand.image.alt}</image:caption>
              </image:image>`;
          }

          if (brand.imageProduct?.fileName) {
            str =
              str +
              `<image:image>
                <image:loc>${process.env.MAIN_URL}/files/images/main/${brand.imageProduct.fileName}</image:loc>
                <image:caption>${brand.imageProduct.alt}</image:caption>
              </image:image>`;
          }

          str = str + `</url>`;

          fs.appendFileSync(
            "files/sitemap/images.xml",
            str.replace(/&/g, "&amp;")
          );
        }
      }

      Product.find({
        active: true,
        published: true,
      }).then((products) => {
        for (const product of products) {
          if (product.headerImage?.fileName || product.image?.fileName) {
            let str = `<url>
            <loc>${process.env.MAIN_URL}/${product.slug}</loc>`;

            if (product.headerImage?.fileName) {
              str =
                str +
                `<image:image>
                  <image:loc>${process.env.MAIN_URL}/files/images/main/${product.headerImage.fileName}</image:loc>
                  <image:caption>${product.headerImage.alt}</image:caption>
                </image:image>`;
            }

            if (product.image?.fileName) {
              str =
                str +
                `<image:image>
                  <image:loc>${process.env.MAIN_URL}/files/images/main/${product.image.fileName}</image:loc>
                  <image:caption>${product.image.alt}</image:caption>
                </image:image>`;
            }

            str = str + `</url>`;

            fs.appendFileSync(
              "files/sitemap/images.xml",
              str.replace(/&/g, "&amp;")
            );
          }
        }

        Category.aggregate([
          {
            $match: {
              active: true,
              published: true,
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "parentId",
              as: "childs",
            },
          },
        ]).then((categories) => {
          for (const category of categories) {
            let childsHasImage = false;

            for (const child of category.childs) {
              if (child.icon?.fileName) {
                childsHasImage = true;
              }
            }
            if (category.headerImage?.fileName || childsHasImage) {
              let str = `<url>
              <loc>${process.env.MAIN_URL}/${category.slug}</loc>`;

              if (category.headerImage?.fileName) {
                str =
                  str +
                  `<image:image>
                    <image:loc>${process.env.MAIN_URL}/files/images/main/${category.headerImage.fileName}</image:loc>
                    <image:caption>${category.headerImage.alt}</image:caption>
                  </image:image>`;
              }

              for (const child of category.childs) {
                if (child.icon?.fileName) {
                  str =
                    str +
                    `<image:image>
                      <image:loc>${process.env.MAIN_URL}/files/images/big/${child.icon?.fileName}</image:loc>
                      <image:caption>${child.icon?.alt}</image:caption>
                    </image:image>`;
                }
              }

              str = str + `</url>`;

              fs.appendFileSync(
                "files/sitemap/images.xml",
                str.replace(/&/g, "&amp;")
              );
            }
          }

          fs.appendFileSync("files/sitemap/images.xml", "</urlset>");

          resolve("ok");
        });
      });
    });
  });
};

module.exports = imageSitemap;
