import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/client";

export async function DELETE(
  _req: Request,
  { params } : { params: { eventId: string }}
) {
  try {
    const supabase = createClient();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }


    const {data: event, error} = await supabase.from('Event')
    .delete()
    .eq("uuid", params.eventId);

    if (error) {
      console.log('[EVENT_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 })
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.log('[EVENT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 })
  }
}