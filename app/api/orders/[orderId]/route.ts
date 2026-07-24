import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> } // Type Promise
) {
  // Await params pour Next.js 15+
  const { orderId } = await params;

  if (!orderId) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select("id, status, total_amount, created_at, full_name, email, phone_number, address, delivery_method, payment_method")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      console.error("Supabase Error or Order Not Found:", error);
      return NextResponse.json(
        { error: "Commande non trouvée dans la base de données" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      total_amount: order.total_amount,
      created_at: order.created_at,
      full_name: order.full_name,
      email: order.email,
      phone_number: order.phone_number,
      address: order.address,
      delivery_method: order.delivery_method,
      payment_method: order.payment_method,
    });
  } catch (error) {
    console.error("Supabase route error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}