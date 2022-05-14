const Blog = require("../../models/blog.model");
const fs = require("fs");

const blogSitemap = () => {
  return new Promise((resolve) => {
    Blog.find({
      active: true,
      published: true,
    })
      .then((blogs) => {
        try {
          fs.unlinkSync("files/sitemap/blogs.xml");
        } catch (err) {
          console.error(err);
        }

        fs.appendFileSync(
          "files/sitemap/blogs.xml",
          `<?xml version="1.0" encoding="UTF-8"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
        );

        blogs.forEach(function (item) {
          if (item?.slug) {
            fs.appendFileSync(
              "files/sitemap/blogs.xml",
              `<url>
              <loc>${process.env.MAIN_URL}/blog/${item.slug
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

        fs.appendFileSync("files/sitemap/blogs.xml", "</urlset>");

        resolve("ok");
      });
  });
};

module.exports = blogSitemap;
