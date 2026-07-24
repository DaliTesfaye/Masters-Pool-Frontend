"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface ProfileUpdateInput {
  fullName: string;
  phone: string;
  address: string;
}

export async function updateProfile(input: ProfileUpdateInput) {
  const supabase = await createClient();

  // 1. Verify user session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "Vous devez être connecté pour modifier votre profil.",
    };
  }

  try {
    // 2. Upsert profile record in Supabase
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: input.fullName,
        phone_number: input.phone,
        address: input.address,
        updated_at: new Date().toISOString(),
      });

    if (upsertError) {
      console.error("[updateProfile] Supabase error:", upsertError.message);
      return {
        success: false,
        error: `Erreur lors de la mise à jour : ${upsertError.message}`,
      };
    }

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profil mis à jour avec succès.",
    };
  } catch (error: any) {
    console.error("[updateProfile] Catch error:", error);
    return {
      success: false,
      error: "Une erreur inattendue est survenue.",
    };
  }
}
