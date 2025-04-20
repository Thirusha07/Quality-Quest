import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import connectDB from '@/lib/mongodb';
import Organization from '@/models/organization';

export async function POST(request: NextRequest) {
  try {
    const { name, createdByUserId } = await request.json();

    if (!name || !createdByUserId) {
      return NextResponse.json({ message: 'Organization name and creator user ID are required' }, { status: 400 });
    }

    await connectDB();

    const organizationId = nanoid(8);

    const newOrganization = await Organization.create({
      organizationId,
      name,
      users: [createdByUserId],
      projects: [],
    });

    return NextResponse.json({
      message: 'Organization created successfully',
      organization: {
        organizationId: newOrganization.organizationId,
        name: newOrganization.name,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Organization creation error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}