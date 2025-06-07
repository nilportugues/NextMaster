import { getSearchResults } from "@/features/search/lib/queries"; // Updated path
import { NextRequest } from "next/server";

export type ProductSearchResult = {
  href: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string;
  price: string;
  subcategory_slug: string;
}[];

export async function handleSearchRequest(request: NextRequest) {
  // format is /api/search?q=term
  const searchTerm = request.nextUrl.searchParams.get("q");
  if (!searchTerm || !searchTerm.length) {
    return Response.json([]);
  }

  // Assuming getSearchResults now correctly returns items that include categories and subcategories
  // The original getSearchResults joins these tables.
  const results = await getSearchResults(searchTerm);

  const searchResults: ProductSearchResult = results.map((item: any) => { // Added any type for item temporarily
    const href = `/products/${item.categories.slug}/${item.subcategories.slug}/${item.products.slug}`;
    return {
      ...item.products,
      href,
    };
  });
  const response = Response.json(searchResults);
  // cache for 10 minutes
  response.headers.set("Cache-Control", "public, max-age=600");
  return response;
}
