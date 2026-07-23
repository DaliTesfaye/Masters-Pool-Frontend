'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface AddToCartPayload {
  id: string | number
  name: string
  price: number
  image?: string
}

// 1. RÉCUPÉRER LE PANIER DE L'UTILISATEUR
export async function getCart() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { items: [], error: 'Non authentifié' }
    }

    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[getCart] Database fetch error:', error.message)
      return { items: [], error: error.message }
    }

    return { items: cartItems || [], error: null }
  } catch (err: any) {
    console.error('[getCart] Unexpected error:', err)
    return { items: [], error: err?.message || 'Error fetching cart' }
  }
}

// 2. AJOUTER UN PRODUIT AU PANIER
export async function addToCart(product: AddToCartPayload) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { 
        success: false, 
        error: 'Vous devez être connecté pour sauvegarder dans la base de données.', 
        unauthenticated: true 
      }
    }

    const productIdStr = String(product.id)

    // Vérifier si le produit est déjà dans le panier
    const { data: existingItem, error: fetchError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', productIdStr)
      .maybeSingle()

    if (fetchError) {
      console.error('[addToCart] Error checking existing item:', fetchError.message)
    }

    if (existingItem) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id)
        .eq('user_id', user.id)

      if (updateError) {
        console.error('[addToCart] Update error:', updateError.message)
        return { success: false, error: updateError.message }
      }
    } else {
      const { data: insertedData, error: insertError } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productIdStr,
          product_name: product.name,
          product_price: product.price,
          product_image: product.image || '',
          quantity: 1
        })
        .select('id')
        .single()

      if (insertError) {
        console.error('[addToCart] Insert error:', insertError.message)
        return { success: false, error: insertError.message }
      }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err: any) {
    console.error('[addToCart] Server action exception:', err)
    return { success: false, error: err?.message || 'Failed to add item to DB' }
  }
}

// 3. METTRE À JOUR LA QUANTITÉ
export async function updateCartQuantity(cartItemId: string, newQuantity: number) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) return { success: false, error: 'Non authentifié' }

    if (newQuantity <= 0) {
      return removeFromCart(cartItemId)
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', cartItemId)
      .eq('user_id', user.id)

    if (error) {
      console.error('[updateCartQuantity] Error:', error.message)
      return { success: false, error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message }
  }
}

// 4. SUPPRIMER UN ARTICLE DU PANIER
export async function removeFromCart(cartItemId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) return { success: false, error: 'Non authentifié' }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', user.id)

    if (error) {
      console.error('[removeFromCart] Error:', error.message)
      return { success: false, error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message }
  }
}