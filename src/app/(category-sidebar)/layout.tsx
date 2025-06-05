import CollectionSidebar from "@/components/sidebar/CollectionSidebar";
// Ensure Link and getCollections imports are removed if no longer directly used here

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-grow font-mono">
      <CollectionSidebar />
      <main
        className="min-h-[calc(100vh-113px)] flex-1 overflow-y-auto p-4 pt-0 md:pl-64"
        id="main-content"
      >
        {children}
      </main>
    </div>
  );
}
