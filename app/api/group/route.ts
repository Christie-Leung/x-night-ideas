import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/client";

export async function POST(
  req: Request,
) {
  try {
    const supabase = createClient();
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    const {data: group, error} = await supabase.from('Group').insert({
        name: name,
        adminId: userId,
    }).select("uuid");

    if (error) {
      console.log('[GROUPS_POST]', error);
      return new NextResponse("Internal error", { status: 500 })
    }
    
    return NextResponse.json(group[0]?.uuid);
  } catch (error) {
    console.log('[GROUPS_POST]', error);
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(
  req: Request,
) {
  try {
    const supabase = createClient();


    const {data: group, error} = await supabase.from('Group')
      .select("*");
    if (error) {
      console.log('[GROUPS_POST]', error);
      return new NextResponse("Internal error", { status: 500 })
    }
    
    return NextResponse.json(group);
  } catch (error) {
    console.log('[GROUPS_POST]', error);
    return new NextResponse("Internal error", { status: 500 })
  }
}
