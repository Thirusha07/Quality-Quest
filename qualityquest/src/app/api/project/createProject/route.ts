import { NextRequest, NextResponse } from 'next/server';
import Project from '@/models/project';
import { verifyAuth } from '@/lib/auth';// parses user info from token
import connectDB from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    await connectDB();
    const authResult = await verifyAuth(req);

    if (!authResult.isAuthenticated || authResult.user?.role !== 'product manager') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    try {
      const newProject = await Project.create(body);
      return NextResponse.json(newProject, { status: 201 });
    } catch (err) {
      return NextResponse.json({ message:"Error while creating project" }, { status: 400 });
    }
  }