// 更新用户会话信息
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const session = await getServerSession(authOptions);
  const data = await req.json();

  if (session) {
    // Perform some server-side logic
    const updatedUser = {
      ...session.user,
      ...data
    };

    // Update the session object
    session.user = updatedUser;

    return NextResponse.json({ message: 'success', session }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
