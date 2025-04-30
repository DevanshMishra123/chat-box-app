// app/api/products/route.js (App Router)

import connectMongo from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req) {
  await connectMongo();
  const products = await Product.find({});
  return new Response(JSON.stringify(products), { status: 200 });
}

export async function POST(req) {
  const body = await req.json();
  await connectMongo();
  const newProduct = await Product.create({ name: body.name, price: body.price });
  return new Response(JSON.stringify(newProduct), { status: 201 });
}
