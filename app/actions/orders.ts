"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface CheckoutInput {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  deliveryMethod: "club" | "delivery";
  paymentType: string;
}

export async function checkoutOrder(input: CheckoutInput) {
  const supabase = await createClient();

  // 1. Verify user session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !user.email) {
    return {
      success: false,
      error: "Vous devez être connecté pour passer une commande.",
    };
  }

  if (!input || !input.fullName || !input.email || !input.phone) {
    return {
      success: false,
      error: "Veuillez remplir toutes les informations client requises.",
    };
  }

  try {
    // 2. Fetch the user's active cart items.
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("quantity, product_id, product_price")
      .eq("user_id", user.id);

    if (cartError) {
      console.error("[checkoutOrder] Could not fetch cart items:", cartError.message);
      return {
        success: false,
        error: `Impossible de récupérer votre panier : ${cartError.message}`,
      };
    }

    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: "Votre panier est vide." };
    }

    // 3. Calculate the overall total amount spent
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product_price || 0) * item.quantity,
      0
    );
    const deliveryFee = input.deliveryMethod === "delivery" ? 8 : 0;
    const totalAmount = subtotal + deliveryFee;

    // 4. Create the main record inside the 'orders' table (status: 'pending')
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        full_name: input.fullName,
        email: input.email,
        phone_number: input.phone,
        address: input.address || "",
        delivery_method: input.deliveryMethod,
        payment_method: input.paymentType,
        total_amount: totalAmount,
        status: "pending", // Initial state awaiting email verification
      })
      .select("id")
      .single();

    if (orderError || !orderData) {
      throw new Error(
        `Failed to create order master record: ${orderError?.message}`
      );
    }

    const newOrderId = orderData.id;

    // 5. Map our cart items into the shape the 'order_items' table requires
    const orderItemsToInsert = cartItems.map((item) => ({
      order_id: newOrderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: Number(item.product_price || 0),
    }));

    // 6. Insert all row items into 'order_items'
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (itemsError) {
      throw new Error(
        `Failed to insert order items details: ${itemsError.message}`
      );
    }

    // 7. Clear the user's 'cart_items' table records since checkout succeeded
    const { error: clearCartError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (clearCartError) {
      throw new Error(
        `Order created but failed to clean cart table: ${clearCartError.message}`
      );
    }

    // 8. Send Confirmation Email via Resend
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const confirmUrl = `${appUrl}/api/orders/verify?orderId=${newOrderId}`;
    const targetEmail = input.email || user.email;

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev", // Free Resend testing domain
        to: targetEmail,
        subject: "Confirmation de votre commande - Masters Pool",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 500px; margin: auto; border: 1px solid #1e293b;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #10b981; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; text-transform: uppercase;">Masters Pool</h1>
              <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Validation de commande</p>
            </div>

            <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">Bonjour <strong>${input.fullName}</strong>,</p>
            <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
              Merci pour votre commande ! Pour confirmer votre e-mail et démarrer la préparation de votre matériel pour la commande <strong style="color: #ffffff;">#${newOrderId.slice(-6)}</strong>, veuillez cliquer sur le bouton ci-dessous :
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${confirmUrl}" style="background-color: #10b981; color: #000000; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">
                Confirmer ma commande
              </a>
            </div>

            <p style="font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
              Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br/>
              <span style="color: #10b981; word-break: break-all;">${confirmUrl}</span>
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("[checkoutOrder] Resend email dispatch failed:", emailErr);
    }

    // 9. Revalidate paths
    revalidatePath("/dashboard");
    revalidatePath("/produits");

    return { success: true, orderId: newOrderId };
  } catch (error: unknown) {
    console.error("Checkout process crash details:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la validation.",
    };
  }
}