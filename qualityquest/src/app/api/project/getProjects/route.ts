import { NextRequest, NextResponse } from 'next/server';
import Project from '@/models/project';
import { verifyAuth } from '@/lib/auth';// parses user info from token
import connectDB from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  await connectDB();
  const authResult = await verifyAuth(req);

  if (!authResult.isAuthenticated || authResult.user?.role !== 'product manager') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  const projects = await Project.find().populate('organizationId users tasks');
  return NextResponse.json(projects);
}