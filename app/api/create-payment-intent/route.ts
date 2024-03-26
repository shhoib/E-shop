import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, {
  typescript: true,
  apiVersion: "2022-11-15",
});

export async function POST(request: Request,res) {
  const { data } = await request.json();
  const { amount } = data;
  console.log('data',data);
  console.log('amount,amount');
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "USD",
      automatic_payment_methods:{enabled: true }
    });

    console.log('intent responded');
    res.send({
        clientSecret: paymentIntent.client_secret
    })    
  } catch (error: any) {
    console.log('error returned');
    
    return new NextResponse(error, {
      status: 400,
    });
  }
}