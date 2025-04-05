import { RewardConfig } from "@/types/config";
import { NextResponse } from "next/server";

// In a real application, you'd want to use a database
// This is just for demonstration purposes
let configStore: RewardConfig[] = [];

export async function POST(request: Request) {
  try {
    const config: RewardConfig = await request.json();
    
    // Validate the required fields
    if (!config.wallet || !config.name || config.amount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real app, you'd save to a database here
    configStore.push(config);

    return NextResponse.json({ success: true, config }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // In a real app, you'd query your database here
    const configs = configStore.filter(config => config.wallet === wallet);

    return NextResponse.json({ configs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch configurations" },
      { status: 500 }
    );
  }
} 