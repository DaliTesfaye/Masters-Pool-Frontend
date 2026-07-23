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
      .select("id, status")
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
    });
  } catch (error) {
    console.error("Supabase route error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}