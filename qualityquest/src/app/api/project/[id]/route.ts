import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/project';
import { verifyAuth } from '@/lib/auth';

// GET /api/projects/user/[userId]
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Optional: Restrict users from accessing others' projects unless admin
    if (
      authResult.user.userId !== userId &&
      authResult.user.role !== 'admin'
    ) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    // Fetch projects where the user is in the users array
    const projects = await Project.find({ users: userId }).populate('organizationId');

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json(
      { message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
