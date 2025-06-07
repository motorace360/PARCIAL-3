import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await connectToDatabase();
    const db = client.db('tech-services');
    
    const result = await db.collection('appointments').insertOne({
      ...body,
      createdAt: new Date(),
      status: 'pending'
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Appointment error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al agendar cita' },
      { status: 500 }
    );
  }
}
