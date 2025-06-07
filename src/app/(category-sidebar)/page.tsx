import { Link } from "@/components/ui/link";
import { getCollections, getProductCount } from "@/lib/queries";
import { isFeatureEnabled } from '../../lib/feature-flags'; // Import the new feature flag function

import Image from "next/image";

export default async function Home() {
  const [collections, productCount, showNewUiFeature] = await Promise.all([
    getCollections(),
    getProductCount(),
    isFeatureEnabled('testFeature'), // Check the feature flag status
  ]);
  let imageCount = 0;

  return (
    <div className="w-full p-4">
      <div className="mb-2 w-full flex-grow border-b-[1px] border-accent1 text-sm font-semibold text-black">
        Explore {productCount.at(0)?.count.toLocaleString()} products
      </div>
      {showNewUiFeature && (
        <div className="my-2 rounded bg-blue-100 p-3 text-center text-blue-700">
          <p>🎉 Redis Feature Flag 'testFeature' is ENABLED! New UI Active! 🎉</p>
        </div>
      )}
      {/* You could also add an else block or alternative message if needed:
      {!showNewUiFeature && (
        <div className="my-2 rounded bg-gray-100 p-3 text-center text-gray-700">
          <p>Redis Feature Flag 'testFeature' is disabled. Showing default UI.</p>
        </div>
      )}
      */}
      {collections.map((collection) => (
        <div key={collection.name}>
          <h2 className="text-xl font-semibold">{collection.name}</h2>
          <div className="flex flex-row flex-wrap justify-center gap-2 border-b-2 py-4 sm:justify-start">
            {collection.categories.map((category) => (
              <Link
                prefetch={true}
                key={category.name}
                className="flex w-[125px] flex-col items-center text-center"
                href={`/products/${category.slug}`}
              >
                <Image
                  loading={imageCount++ < 15 ? "eager" : "lazy"}
                  decoding="sync"
                  src={category.image_url ?? "/placeholder.svg"}
                  alt={`A small picture of ${category.name}`}
                  className="mb-2 h-14 w-14 border hover:bg-accent2"
                  width={48}
                  height={48}
                  quality={65}
                />
                <span className="text-xs">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
