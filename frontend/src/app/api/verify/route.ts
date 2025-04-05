// import * as fs from 'fs';
import { simpleParser, ParsedMail } from 'mailparser';
// @ts-ignore
import { dkimVerify } from 'mailauth/lib/dkim/verify';
import { NextResponse } from 'next/server';
// import { useReadContract } from 'wagmi';
// import { useAccount } from 'wagmi';
import { createPublicClient, http, getContract, createWalletClient, erc20Abi } from 'viem'
import { baseSepolia, flowTestnet, optimism } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import prisma from '@/lib/db';

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationInfo {
  origin: Coordinates;
  destination: Coordinates;
}

interface PriceInfo {
  price: number;
}

interface TripInfo extends LocationInfo {
  price: number;
  date: Date;
}

async function verifyEmailDKIM(rawEmail: string): Promise<boolean> {
    try {
        const results = await dkimVerify(rawEmail);
        for (const result of results.results) {
            const status = result.status;
            if (status.result === 'pass' && 
                status.aligned.endsWith('uber.com')) {
                return true;
            }
            if (status.result === 'neutral' && 
                status.comment === 'expired' && 
                status.aligned.endsWith('uber.com')) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Error:', (error as Error).message);
        return false;
    }
}

const extractCoordinates = (url: string): LocationInfo => {
    const markerRegex = /markers=[^&]*?%7Cscale%3A2%7C([-.\d]+)%2C([-.\d]+)/g;
    const matches = [...url.matchAll(markerRegex)];
    if (matches.length >= 2) {
      const origin = {
        lat: Number.parseFloat(matches[0][1]),
        lng: Number.parseFloat(matches[0][2])
      };
      const destination = {
        lat: Number.parseFloat(matches[1][1]),
        lng: Number.parseFloat(matches[1][2])
      };
      return { origin, destination };
    } else {
      throw new Error("Could not find both origin and destination markers.");
    }
};

const extractPrice = (text: string): PriceInfo => {
    // ... existing code ...
    const lines = text.split('\n');
    const priceLine = lines.find(line => line.includes('NT$'));
    
    if (!priceLine) {
      throw new Error("Could not find any line containing NT$ in email text");
    }

    const standardFormat = priceLine.match(/NT\$(\d+\.\d{2})/);
    if (standardFormat) {
      return { price: Number.parseFloat(standardFormat[1]) };
    }

    const europeanFormat = priceLine.match(/(\d+),(\d{2})\s*NT\$/);
    if (europeanFormat) {
      return { price: Number.parseFloat(`${europeanFormat[1]}.${europeanFormat[2]}`) };
    }

    console.log("Price line found:", priceLine);
    throw new Error("Could not parse price format in the line containing NT$");
};
  
async function emailInfo(rawEmail: string): Promise<TripInfo | null> {
    try {
        const parsedEmail = await simpleParser(rawEmail);
        const text = parsedEmail.text;
        const mapUrlMatch = text?.match(/https:\/\/maps\.googleapis\.com\/maps\/api\/staticmap[^"'\s]*/);
        if (!mapUrlMatch || mapUrlMatch.length === 0) {
            return null;
        }
        const { origin, destination } = extractCoordinates(mapUrlMatch[0]);
        const { price } = extractPrice(text!);
        return { origin, destination, price, date: parsedEmail.date! };
    } catch (error) {
        console.error('Error:', (error as Error).message);
        return null;
    }
}


// Add NFT contract configuration
const nftContract = {
	abi: [
		{
			name: 'balanceOf',
			type: 'function',
			inputs: [{ name: 'owner', type: 'address' }],
			outputs: [{ name: '', type: 'uint256' }],
			stateMutability: 'view'
		}
	]
} as const;

// const erc20Contract = {
//     abi: [
//         {
//             name: 'transferFrom',
//             type: 'function',
//             inputs: [
//                 { name: 'from', type: 'address' },
//                 { name: 'to', type: 'address' },
//                 { name: 'amount', type: 'uint256' }
//             ],
//             outputs: [{ name: '', type: 'bool' }],
//             stateMutability: 'nonpayable'
//         }
//     ]
// } as const;

const publicClient = createPublicClient({
  chain: optimism,
  transport: http()
})

async function verifyNFT(nftAddress: string, accountAddress: string) {
    const contract = getContract({
        address: nftAddress as `0x${string}`,
        abi: nftContract.abi,
        client: publicClient,
    })

    const balance = await contract.read.balanceOf([accountAddress as `0x${string}`])
    return Number(balance) > 0
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { rewardID, accountAddress, email, nft, userId } = body;

		const reward = await prisma.reward.findUnique({
			where: {
				id: rewardID
			}
		});
		if (!reward) {
			return NextResponse.json({ error: 'Invalid reward ID' }, { status: 400 });
		}
		const config = {
			...reward,
			requirements: JSON.parse(reward?.requirements!)
		};
        // const configResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/config`);
        // const configs = await configResponse.json();
        // const config = configs.rewards.find((c: any) => c.id === rewardID);
		
        if (!config) {
			return NextResponse.json({ error: 'Invalid reward ID' }, { status: 400 });
        }

        for (const requirement of config.requirements) {
            switch (requirement.type) {
                case 'uber': {
                    const rawEmail = Buffer.from(email, 'base64').toString('utf-8');
                    console.log("verifying email")
                    const isValidEmail = await verifyEmailDKIM(rawEmail);
                    if (!isValidEmail) {
                        console.log("email invalid")
                        return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
                    }
                    const emailData = await emailInfo(rawEmail);
                    if (!emailData) {
                        console.log("email data invalid")
                        return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
                    }
                    break;
                }
                case 'nft': {
                    console.log("verifying nft")
                    const isValidNFT = await verifyNFT(nft, accountAddress);
                    if (!isValidNFT) {
                        return NextResponse.json({ error: 'Invalid NFT' }, { status: 400 });
                    }
                    break;
                }
				case 'self': {
					console.log("verifying self")
					const validation = await prisma.validation.findMany({
						where: {
							userId: userId,
							rewardId: rewardID
						}
					});
					if (validation.length === 0) {
						return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
					}
					if (!validation[0].verified) {
						return NextResponse.json({ error: 'User not verified' }, { status: 400 });
					}
					break;
				}
            }
        }
        console.log("transferring reward tokens");

        const privateKey = process.env.NEXT_PRIVATE_KEY?.startsWith('0x') 
            ? process.env.NEXT_PRIVATE_KEY as `0x${string}`
            : `0x${process.env.NEXT_PRIVATE_KEY}` as `0x${string}`;
        const accountP = privateKeyToAccount(privateKey)
        
        const client = createWalletClient({
            account: accountP,
            chain: flowTestnet,
            transport: http(),
        });
    
        try {
            const hash = await client.writeContract({
                account: accountP,
                address: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
                abi: erc20Abi,
                functionName: 'transferFrom',
                args: [
                    config.wallet as `0x${string}`,
                    accountAddress as `0x${string}`,
                    BigInt(config?.amount!),
                ],
            });

            console.log('Transaction sent:', hash);
            return new Response(JSON.stringify({ hash }), { status: 200 });
        } catch (error) {
            console.error('Transfer failed:', error);
            return new Response(JSON.stringify({ error: 'Transfer failed' }), { status: 500 });
        }

        // return NextResponse.json({ message: 'Reward sent successfully' }, { status: 200 });
        
    } catch (error) {
        console.error('Error:', (error as Error).message);
        return NextResponse.json({ error: 'Error verifying reward' }, { status: 500 });
    }
}

// function test_uber_email(filePath: string): void {
//     const rawEmail = fs.readFileSync(filePath, 'utf8');
    
//     verifyEmailDKIM(rawEmail).then(valid => {
//         if (valid) {
//             console.log('Valid');
//         } else {
//             console.log('Invalid');
//         }
//     });
//     emailInfo(rawEmail).then(info => {
//         console.log(info);
//     });
// }

// test_email('./email_uber_paul_2.eml');
// test_email('./email_uber_jacob.eml');