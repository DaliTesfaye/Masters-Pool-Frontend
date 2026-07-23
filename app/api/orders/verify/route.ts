// app/api/orders/verify/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  console.log("=== [VERIFY START] ===");
  console.log("Received orderId from email link:", orderId);

  if (!orderId) {
    return NextResponse.json({ error: "Order ID is missing" }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    // 1. Fetch current status
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .maybeSingle(); // maybeSingle returns null instead of throwing on 0 rows

    console.log("Fetched order from DB:", order);
    console.log("Fetch error (if any):", fetchError);

    if (fetchError || !order) {
      console.error("[VERIFY FAIL] Order not found in DB with ID:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Perform Update
    console.log(`Current DB status is: "${order.status}". Updating to "processing"...`);

    const { data: updatedData, error: updateError, count } = await supabase
      .from("orders")
      .update({ status: "processing" })
      .eq("id", orderId)
      .select(); // .select() forces Supabase to return the modified row

    console.log("Update Result Data:", updatedData);
    console.log("Update Error:", updateError);

    if (updateError) {
      console.error("[VERIFY FAIL] Supabase update failed:", updateError.message);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (!updatedData || updatedData.length === 0) {
      console.warn("[VERIFY WARN] Update executed but 0 rows were affected! Check RLS policies or column naming.");
    }

    // 3. Redirect back to tracking page
    const requestUrl = new URL(request.url);
    const redirectUrl = new URL("/checkout/confirmed", requestUrl.origin);
    redirectUrl.searchParams.set("orderId", orderId);
    redirectUrl.searchParams.set("verified", "true");

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("[VERIFY ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}