// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const body = await request.json();
    const {
      fullName,
      phone,
      email,
      address,
      shippingType,
      paymentMethod,
      totalAmount,
      userId,
    } = body;

    if (!email) {
      return NextResponse.json(
        { error: "L'adresse e-mail est requise." },
        { status: 400 }
      );
    }

    // 1. Insert order into Supabase
    const { data: order, error: dbError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId || null,
        full_name: fullName,
        email: email,
        phone_number: phone,
        address: address,
        delivery_method: shippingType,
        payment_method: paymentMethod,
        total_amount: Number(totalAmount) || 0,
        status: "pending",
      })
      .select("id")
      .single();

    if (dbError || !order) {
      console.error("[Checkout DB Error]:", dbError);
      return NextResponse.json(
        { error: "Erreur lors de la création de la commande." },
        { status: 500 }
      );
    }

    // 2. Generate confirmation link
    const orderId = order.id;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const confirmUrl = `${siteUrl}/api/orders/verify?orderId=${orderId}`;

    // 3. Send confirmation email
    await resend.emails.send({
      from: "Masters Pool <onboarding@resend.dev>",
      to: [email],
      subject: "Confirmez votre commande - Masters Pool",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #000000; color: #ffffff; padding: 40px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; text-align: center;">
          <h2 style="color: #10b981; font-size: 24px; font-weight: 800; text-transform: uppercase; margin-bottom: 8px;">
            Merci pour votre commande !
          </h2>
          <p style="color: #94a3b8; font-size: 14px; margin-bottom: 24px;">
            Bonjour <strong>${fullName || "Cher client"}</strong>, veuillez confirmer votre commande pour lancer la préparation.
          </p>

          <div style="margin: 32px 0;">
            <a href="${confirmUrl}" 
               style="background-color: #10b981; color: #000000; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 14px 28px; border-radius: 12px; text-decoration: none; display: inline-block;">
              Confirmer Ma Commande
            </a>
          </div>

          <p style="color: #64748b; font-size: 11px; margin-top: 24px;">
            Si vous n'avez pas passé cette commande, vous pouvez ignorer cet email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error("[Checkout Route Error]:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors du traitement de la commande." },
      { status: 500 }
    );
  }
}