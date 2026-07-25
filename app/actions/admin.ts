"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { createClient as createAdminSupabase } from "@supabase/supabase-js";

export async function getAllOrders() {
  const supabase = await createClient();
  
  // Create an admin client to bypass RLS for order_items
  const adminClient = process.env.SUPABASE_SERVICE_ROLE_KEY 
    ? createAdminSupabase(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    : supabase; // Fallback to normal client if no service key

  const { data, error } = await adminClient
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_purchase,
        products (
          name
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", JSON.stringify(error, null, 2));
    return [];
  }

  // 👉 Check your server terminal/console for this output!
  console.log("RAW ORDERS DATA:", JSON.stringify(data, null, 2));

  return data;
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}