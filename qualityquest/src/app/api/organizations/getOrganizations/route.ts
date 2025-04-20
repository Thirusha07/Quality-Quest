import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Organization from '@/models/organization';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const organizations = await Organization.find({}, { _id: 0, organizationId: 1, name: 1 });
    return NextResponse.json(organizations, { status: 200 });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ message: 'Failed to fetch organizations' }, { status: 500 });
  }
}