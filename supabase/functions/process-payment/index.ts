import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

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

    // 1. Get Secret Key from DB
    const { data: settings, error: settingsError } = await supabaseClient
        .from('admin_settings')
        .select('value')
        .eq('key', 'stripe_secret_key')
        .single();
    
    if (settingsError || !settings?.value || settings.value.length < 10) {
        throw new Error('Stripe Secret Key not found or invalid in Admin Settings.');
    }

    const stripe = new Stripe(settings.value, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const { amount, currency, token, email, description } = await req.json()

    console.log('Processing payment:', { amount, currency, email });

    // 2. Create PaymentIntent with Confirm=true
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency,
      payment_method: token, 
      confirm: true,
      receipt_email: email,
      description: description || 'Donation',
      automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never'
      }
    })

    return new Response(
      JSON.stringify({ success: true, paymentIntent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Payment Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
