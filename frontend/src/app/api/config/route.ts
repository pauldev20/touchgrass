import { NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import prisma from '@/lib/db';

interface ConfigRequest {
  wallet: string;
  name: string;
  amount: number;
  description: string;
  emoji: string;
  requirements: Array<{
    type: "wld" | "uber" | "nft" | "self";
    id: string;
    address?: string;
    dateRange?: { start: string; end: string };
    coordinates?: { lat: number; lng: number };
    country?: string;
  }>;
  signature: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as ConfigRequest;
    
    // Basic validation
    if (!body.wallet || !body.name || body.amount <= 0 || !body.signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Reconstruct the message that was signed
    const configData = {
      wallet: body.wallet,
      name: body.name,
      amount: body.amount,
      requirements: body.requirements,
	  description: body.description,
	  emoji: body.emoji
    };

    // Verify the signature using viem
    const messageToVerify = JSON.stringify(configData);
    const isValid = await verifyMessage({
      address: body.wallet as `0x${string}`,
      message: messageToVerify,
      signature: body.signature as `0x${string}`,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Rest of your validation logic...
    for (const req of body.requirements) {
      switch (req.type) {
        case 'nft':
          if (!req.address || !req.address.startsWith('0x')) {
            return NextResponse.json(
              { error: 'Invalid NFT address format' },
              { status: 400 }
            );
          }
          break;
        // case 'uber':
        //   if (!req.dateRange?.start || !req.dateRange?.end) {
        //     return NextResponse.json(
        //       { error: 'Missing date range for Uber verification' },
        //       { status: 400 }
        //     );
        //   }
        //   break;
      }
    }

	await prisma.reward.create({
		data: {
			name: configData.name,
			description: configData.description,
			emoji: configData.emoji,
			requirements: JSON.stringify(configData.requirements),
			wallet: configData.wallet,
			amount: configData.amount
		}
	});

    return NextResponse.json({
      message: 'Configuration verified and saved successfully',
      config: configData
    });

  } catch (error) {
    console.error('Error processing config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const rewards = await prisma.reward.findMany();

    const formattedRewards = rewards.map((reward: any) => ({
      ...reward,
      requirements: JSON.parse(reward.requirements)
    }));

    return NextResponse.json({
      rewards: formattedRewards
    });
    
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}