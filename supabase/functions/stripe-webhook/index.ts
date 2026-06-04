import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return new Response('Webhook error', { status: 400 })
  }

  console.log('Stripe event:', event.type)

  switch (event.type) {
    // Payment succeeded — upgrade to Pro
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession
      const userId = session.metadata?.user_id ?? session.client_reference_id

      if (userId) {
        await supabaseAdmin
          .from('profiles')
          .update({ tier: 'pro' })
          .eq('id', userId)

        console.log(`Upgraded user ${userId} to Pro`)
      }
      break
    }

    // Subscription renewed
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      const sub = await stripe.subscriptions.retrieve(invoice.subscription as string)
      const userId = sub.metadata?.user_id

      if (userId) {
        await supabaseAdmin.from('profiles').update({ tier: 'pro' }).eq('id', userId)
      }
      break
    }

    // Subscription cancelled or payment failed — downgrade to Free
    case 'customer.subscription.deleted':
    case 'invoice.payment_failed': {
      const obj = event.data.object as Stripe.Subscription | Stripe.Invoice
      const subId = 'subscription' in obj ? obj.subscription as string : (obj as Stripe.Subscription).id

      if (subId) {
        const sub = await stripe.subscriptions.retrieve(subId)
        const userId = sub.metadata?.user_id

        if (userId) {
          await supabaseAdmin.from('profiles').update({ tier: 'free' }).eq('id', userId)
          console.log(`Downgraded user ${userId} to Free`)
        }
      }
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
