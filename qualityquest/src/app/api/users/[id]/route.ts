// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user';
import connectDB from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import { hash } from 'bcryptjs';

// Helper function to get userId from the URL
function getUserIdFromUrl(request: NextRequest): string {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

// GET - Fetch a single user by ID
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromUrl(request);
    
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Users can view their own profile, admins and product managers can view any profile
    if (
      authResult.user.userId !== userId && 
      !['admin', 'product manager'].includes(authResult.user.role)
    ) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const user = await User.findOne({ userId }).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT - Update a user by ID
export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromUrl(request);
    
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Users can update their own profile, admins can update any profile
    if (authResult.user.userId !== userId && authResult.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Find user first
    const user = await User.findOne({ userId });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get request body
    const { name, email, password, role, organizationId } = await request.json();
    
    // Prepare update data
    const updateData: Record<string, any> = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    // Only admins can change roles
    if (role && authResult.user.role === 'admin') {
      updateData.role = role;
    }
    
    // Only admins can change organization
    if (organizationId && authResult.user.role === 'admin') {
      updateData.organizationId = organizationId;
    }
    
    // Update password if provided
    if (password) {
      updateData.password = await hash(password, 12);
    }
    
    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a user by ID (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromUrl(request);
    
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated|| !authResult.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can delete users
    if (authResult.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Find and delete user
    const deletedUser = await User.findOneAndDelete({ userId });
    
    if (!deletedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}