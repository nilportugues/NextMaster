import { db } from "@/db";
import { collections } from "@/db/schema";
import { getCollectionDetails } from "@/lib/queries";
import CategoryItem from "@/components/category/CategoryItem";

export async function generateStaticParams() {
  return await db.select({ collection: collections.slug }).from(collections);
}

export default async function Home(props: {
  params: Promise<{
    collection: string;
  }>;
}) {
  const collectionName = decodeURIComponent((await props.params).collection);

  const collections = await getCollectionDetails(collectionName);
  let imageCount = 0;

  return (
    <div className="w-full p-4">
      {collections.map((collection) => (
        <div key={collection.name}>
          <h2 className="text-xl font-semibold">{collection.name}</h2>
          <div className="flex flex-row flex-wrap justify-center gap-2 border-b-2 py-4 sm:justify-start">
            {collection.categories.map((category) => (
              <CategoryItem
                key={category.slug} // Or category.name if slug is not unique or available
                category={category}
                imageLoading={imageCount++ < 15 ? "eager" : "lazy"}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
