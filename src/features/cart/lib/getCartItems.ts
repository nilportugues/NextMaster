import { cache } from "react";
import { detailedCart } from "@/features/cart/lib/core"; // Updated path

const getCartItems = cache(() => detailedCart());
export type CartItem = Awaited<ReturnType<typeof getCartItems>>[number];

export { getCartItems };
