import { Metadata } from "next";
import { Suspense } from "react";
import { CartItemsList } from "@/features/cart/components/CartItemsList"; // Updated import
import { TotalCost } from "@/features/orders/components/TotalCost"; // Added
import { PlaceOrderAuth } from "@/features/auth/auth.server";
import PageTitle from "@/components/ui/PageTitle";
import InfoBox from "@/components/ui/InfoBox";

export const metadata: Metadata = {
  title: "Order",
};

export default async function Page() {
  return (
    <main className="min-h-screen sm:p-4">
      <div className="container mx-auto p-1 sm:p-3">
        <div className="flex items-center justify-between border-b border-gray-200">
          <PageTitle title="Order" />
        </div>

        <div className="flex grid-cols-3 flex-col gap-8 pt-4 lg:grid">
          <div className="col-span-2">
            <Suspense>
              <CartItemsList /> {/* Updated usage */}
            </Suspense>
          </div>

          <div className="space-y-4">
            <InfoBox>
              <p className="font-semibold">
                Merchandise{" "}
                <Suspense>
                  <TotalCost />
                </Suspense>
              </p>
              <p className="text-sm text-gray-500">
                Applicable shipping and tax will be added.
              </p>
            </InfoBox>
            <Suspense>
              <PlaceOrderAuth />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
