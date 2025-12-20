import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Email Settings securely from DB
    const { data: settings } = await supabaseClient
        .from('admin_settings')
        .select('*')
        .eq('category', 'email');
        
    const config = settings?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) || {};
    
    if (!config.email_api_key) {
        throw new Error('Email API Key not configured in Admin Settings.');
    }

    const { to, subject, html, from } = await req.json()

    // Send via Resend
    // Note: If user configures another provider, logic can be extended here.
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.email_api_key}`
      },
      body: JSON.stringify({
        from: from || config.email_sender_address || 'Charizomai <onboarding@resend.dev>',
        to: to,
        subject: subject,
        html: html
      })
    })

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Resend API Error: ${errText}`);
    }

    const data = await res.json()

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
