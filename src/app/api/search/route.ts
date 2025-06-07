import { handleSearchRequest } from '@/features/search/lib/search-api-handler';
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return handleSearchRequest(request);
}
