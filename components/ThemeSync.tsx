"use client";

import { useEffect } from "react";

export type ThemeMode="light"|"system"|"dark";

export function applyTheme(mode:ThemeMode){
  document.documentElement.dataset.theme=mode;
  try{localStorage.setItem("zenfy-theme",mode);}catch{}
}

export default function ThemeSync(){
  useEffect(()=>{
    const valid=(value:string|null):value is ThemeMode=>value==="light"||value==="system"||value==="dark";
    try{
      const local=localStorage.getItem("zenfy-theme");
      if(valid(local))applyTheme(local);
    }catch{}

    fetch("/api/theme",{cache:"no-store",credentials:"include"})
      .then(async response=>{
        if(!response.ok)return null;
        return response.json();
      })
      .then(data=>{
        const theme=data?.theme;
        if(valid(theme))applyTheme(theme);
      })
      .catch(()=>null);
  },[]);

  return null;
}
