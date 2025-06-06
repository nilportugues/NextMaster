import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";

export const getProductDetails = unstable_cache(
  (productSlug: string) =>
    db.query.products.findFirst({
      where: (products, { eq }) => eq(products.slug, productSlug),
    }),
  ["product"],
  {
    revalidate: 60 * 60 * 2, // two hours,
  },
);
