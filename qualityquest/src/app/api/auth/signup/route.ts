import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import User from '@/models/user';
import connectDB from '@/lib/mongodb';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    console.log("Post called");
    const { name, email, password, role, userType, organizationId } = await request.json();
    console.log(name, email, password, role, userType, organizationId);

    // Validate input
    if (!name || !email || !password || !role || !userType) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If user is organization type, organizationId must be present
    if (userType === 'organization' && !organizationId) {
      return NextResponse.json(
        { message: 'Organization ID is required for organization users' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Build user object
    const newUserData: any = {
      userId: nanoid(10),
      name,
      email,
      password: hashedPassword,
      role,
      userType,
    };

    if (userType === 'organization') {
      newUserData.organizationId = organizationId;
    }

    // Create user
    const user = await User.create(newUserData);

    // Return user without password
    const userWithoutPassword = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      userType: user.userType,
      ...(user.organizationId && { organizationId: user.organizationId })
    };

    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
