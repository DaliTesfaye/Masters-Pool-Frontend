// app/auth/actions.ts
'use server' // Ensure this runs exclusively on the server side
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // If password or email is incorrect, send them back with the error message
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Redirect cleanly to the profile workspace upon success
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Extract custom client attributes
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Passes custom data securely to auth.users raw_user_meta_data column
      data: {
        full_name: fullName,
        phone_number: phone
      }
    }
  })

  if (error) {
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  
  // Clear cookies and end the session on Supabase servers
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  
  redirect('/login')
}