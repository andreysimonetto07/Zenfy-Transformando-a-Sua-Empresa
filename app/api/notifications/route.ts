import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

async function authUser(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  return {supabase,user};
}

export async function GET() {
  const {supabase,user}=await authUser();
  if(!user) return NextResponse.json({notifications:[],unread:0},{status:401});

  const cutoff=new Date(Date.now()-24*60*60*1000).toISOString();
  const service=createServiceClient();
  await service.from("notifications").delete().eq("user_id",user.id).lt("created_at",cutoff);

  const {data,error}=await supabase
    .from("notifications")
    .select("id,type,title,body,link,read,created_at")
    .eq("user_id",user.id)
    .gte("created_at",cutoff)
    .order("created_at",{ascending:false})
    .limit(50);

  if(error) return NextResponse.json({notifications:[],unread:0});

  const notifications=data??[];
  return NextResponse.json({
    notifications,
    unread:notifications.filter(item=>!item.read).length,
  },{headers:{"Cache-Control":"no-store"}});
}

export async function POST(request:Request){
  const {supabase,user}=await authUser();
  if(!user) return NextResponse.json({ok:false},{status:401});

  const payload=await request.json().catch(()=>({}));

  if(payload?.all===true){
    const {error}=await supabase.from("notifications").update({read:true}).eq("user_id",user.id).eq("read",false);
    return NextResponse.json({ok:!error});
  }

  const id=typeof payload?.id==="string"?payload.id:"";
  if(!id) return NextResponse.json({ok:false},{status:400});

  const {error}=await supabase.from("notifications").update({read:true}).eq("id",id).eq("user_id",user.id);
  return NextResponse.json({ok:!error});
}

export async function DELETE(request:Request){
  const {user}=await authUser();
  if(!user) return NextResponse.json({ok:false},{status:401});

  const payload=await request.json().catch(()=>({}));
  const service=createServiceClient();

  if(payload?.all===true){
    const {error}=await service.from("notifications").delete().eq("user_id",user.id);
    return NextResponse.json({ok:!error});
  }

  const id=typeof payload?.id==="string"?payload.id:"";
  if(!id) return NextResponse.json({ok:false},{status:400});

  const {error}=await service.from("notifications").delete().eq("id",id).eq("user_id",user.id);
  return NextResponse.json({ok:!error});
}
