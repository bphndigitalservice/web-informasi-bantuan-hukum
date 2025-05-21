
import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase.ts";

export const prerender = false
export const GET: APIRoute = async ({ url, params,request,cookies, redirect }) => {
  try {
    const lat = parseFloat(url.searchParams.get("lat") || "");
    const lon = parseFloat(url.searchParams.get("lon") || "");
    const radius = parseInt(url.searchParams.get("radius") || "10000");

    console.log(request)

    if (isNaN(lat) || isNaN(lon) || isNaN(radius)) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const { data, error } = await supabase
      .rpc('get_nearby_obhs', {
        center_lon: lon,
        center_lat: lat,
        radius_m: radius
      });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
