import * as XLSX from "xlsx";
import { writeFileSync } from "fs";
import { products, categoriesSeed } from "../src/data/products";

const wb = XLSX.utils.book_new();

const wsCat = XLSX.utils.json_to_sheet(
  categoriesSeed.map((c) => ({
    Category: c.name,
    Subcategories: c.subcategories.join(", "),
  })),
  { header: ["Category", "Subcategories"] },
);
wsCat["!cols"] = [{ wch: 22 }, { wch: 60 }];
XLSX.utils.book_append_sheet(wb, wsCat, "Categories");

const wsProd = XLSX.utils.json_to_sheet(
  products.map((p) => ({
    ID: p.id,
    Slug: p.slug,
    Name: p.name,
    Category: p.category,
    Subcategory: p.subcategory ?? "",
    Featured: p.featured ? "Yes" : "No",
    "Price (INR)": p.price ?? "",
    Description: p.description,
    Dimensions: p.dimensions,
    Material: p.material,
    Technique: p.technique,
    "In Stock": p.inStock ? "Yes" : "No",
    Images: p.images.join("\n"),
  })),
  {
    header: [
      "ID","Slug","Name","Category","Subcategory","Featured","Price (INR)",
      "Description","Dimensions","Material","Technique","In Stock","Images",
    ],
  },
);
wsProd["!cols"] = [
  { wch: 6 }, { wch: 32 }, { wch: 36 }, { wch: 14 }, { wch: 18 }, { wch: 8 },
  { wch: 12 }, { wch: 50 }, { wch: 22 }, { wch: 26 }, { wch: 24 }, { wch: 8 }, { wch: 50 },
];
XLSX.utils.book_append_sheet(wb, wsProd, "Products");

const out = XLSX.write(wb, { bookType: "xlsx", type: "buffer" }) as Buffer;
writeFileSync(process.argv[2], out);
console.log("ok", out.length);
