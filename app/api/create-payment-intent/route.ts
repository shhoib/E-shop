import Stripe from 'stripe';
// import {NextResponse} from 'next'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,
 {
    apiVersion : '2022-11-15'
});

const calculateOrderAmount = (items:CartProductType[])=>{
    const totalPrice = item.reduce((acc,item)=>{
        const itemTotal = item.price * item.quantity;
        return acc + itemTotal
    },0);
    return totalPrice
}

export async function POST(request:Request){
    const body = await request.json()
    const {items, payment_intent_id}= body;
    const total = calculateOrderAmount(items)*100
    // const orderData ={
        // user: {connect: {id:}}
    //     amount:  total,
    //     currency: 'usd',
    //     status: 'pending'
    // }

    if(payment_intent_id){

    }else{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: 'usd',
            automatic_payment_methods: {enabled:true}
        })
    }
}