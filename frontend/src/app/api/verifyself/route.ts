import { countries, SelfBackendVerifier } from '@selfxyz/core';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
    try {
		const requestParams = new URL(request.url).searchParams;
		const rewardId = requestParams.get('id');
        const body = await request.json();
        const { proof, publicSignals } = body;

        if (!proof || !publicSignals) {
            return NextResponse.json(
                { message: 'Proof and publicSignals are required' },
                { status: 400 }
            );
        }

        const configuredVerifier = new SelfBackendVerifier(
            "touchgrass",
            `${process.env.NEXT_PUBLIC_API_URL}`,
            'uuid',
            false
        ).excludeCountries(countries.FRANCE);

        const result = await configuredVerifier.verify(proof, publicSignals);
        console.log("Verification result:", result, result.userId);
        console.log('credentialSubject', result.credentialSubject);

		await prisma.validation.create({
			data: {
				userId: result.userId,
				rewardId: rewardId!,
				verified: result.isValid
			}
		});

        if (result.isValid) {
            return NextResponse.json({
                status: 'success',
                result: result.isValid,
                credentialSubject: result.credentialSubject
            });
        // biome-ignore lint/style/noUselessElse: <explanation>
        } else {
            return NextResponse.json({
                status: 'error',
                result: result.isValid,
                message: 'Verification failed',
                details: result.isValidDetails
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Error verifying proof:', error);
        return NextResponse.json({
            message: 'Error verifying proof',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
