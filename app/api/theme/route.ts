import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const themes=["light","system","dark"] as const;
type ThemeMode=(typeof themes)[number];
const valid=(value:unknown):value is ThemeMode=>typeof value==="string"&&themes.includes(value as ThemeMode);

export async function GET(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({theme:null},{status:401});

  const theme=valid(user.user_metadata?.theme)?user.user_metadata.theme:"system";
  return NextResponse.json({theme},{headers:{"Cache-Control":"no-store"}});
}

export async function POST(request:Request){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({ok:false},{status:401});

  const body=await request.json().catch(()=>({}));
  if(!valid(body?.theme))return NextResponse.json({ok:false,error:"Tema inválido."},{status:400});

  const {error}=await supabase.auth.updateUser({data:{theme:body.theme}});
  const response=NextResponse.json({ok:!error,theme:body.theme,error:error?.message||null},{status:error?400:200});

  if(!error){
    response.cookies.set("zenfy-theme",body.theme,{
      path:"/",
      maxAge:60*60*24*365,
      sameSite:"lax",
      secure:process.env.NODE_ENV==="production",
    });
  }

  return response;
}
