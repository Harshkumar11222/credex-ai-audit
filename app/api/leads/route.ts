import { NextResponse } from "next/server";
import { supabase } from "@/services/db/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY:", body);
    console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(
      "SERVICE KEY EXISTS:",
      !!process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("leads")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.log("SUPABASE ERROR:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
    });
  } catch (err) {
    console.log("API ERROR:", err);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}