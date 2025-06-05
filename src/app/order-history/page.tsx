import { Metadata } from "next";
import { Suspense } from "react";
import { OrderHistoryDynamic } from "./dynamic";
import PageTitle from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "Order History",
};

export default async function Page() {
  return (
    <main className="min-h-screen p-4">
      <PageTitle title="Order History" className="w-full border-b-2 border-accent1 text-left" />
      <div className="mx-auto flex max-w-md flex-col gap-4 text-black">
        <Suspense>
          <OrderHistoryDynamic />
        </Suspense>
      </div>
    </main>
  );
}
