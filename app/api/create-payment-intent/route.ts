import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

 const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, {
    apiVersion: "2023-10-16",
   });


const calculateOrderAmount = (items:CartProductType[]) => {
  const totalPrice = items.reduce((acc,item)=>{
    const itemTotal = item.price * item.quantity;
    return acc + itemTotal
  },0)
  const price: any = Math.floor(totalPrice);
  return price
};

export async function POST(request:Request) {

  const body = await request.json();
   const { items,payment_intent_id } = body;
   const total = calculateOrderAmount(items)*100;

   const orderData = {
    // user: { connect :{ id: currentUser.id}},
    amount: total,
    currency: 'usd',
    status: 'pending',
    deliveryStatus: 'pending',
    paymentIntentId: payment_intent_id,
    products: items
   }

   if(payment_intent_id){
    const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if(current_intent){
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        {amount: total}
      )
      return NextResponse.json({ paymentIntent: updated_intent });
    };
    
   }else{
     const paymentIntent = await stripe.paymentIntents.create({
      description: 'Software development services',
       amount: total,
       currency: "usd",
       automatic_payment_methods: {
         enabled: true,
       },
     });

     return NextResponse.json({ paymentIntent });
   }
};