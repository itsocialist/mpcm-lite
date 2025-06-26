import { RoleExecution, WorkflowContext } from '../types';

export class StripeExpertRole implements RoleExecution {
  async execute(_input: any, _context: WorkflowContext): Promise<string> {
    // Premium role that adds Stripe payment integration
    
    return `
// stripe-integration.ts
import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Backend API route for Stripe
export const stripeApi = \`
// api/create-checkout-session.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req, res) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Todo Pro Subscription' },
        unit_amount: 999,
      },
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: \\\`\\\${req.headers.origin}/success\\\`,
    cancel_url: \\\`\\\${req.headers.origin}/cancel\\\`,
  });
  
  res.status(200).json({ sessionId: session.id });
}
\`;

// Frontend Stripe component
export const CheckoutButton = () => {
  const handleCheckout = async () => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
    });
    const session = await response.json();
    await stripe?.redirectToCheckout({ sessionId: session.sessionId });
  };
  
  return (
    <button 
      onClick={handleCheckout}
      className="bg-purple-600 text-white px-4 py-2 rounded"
    >
      Upgrade to Pro - $9.99/mo
    </button>
  );
};
    `.trim();
  }
}
