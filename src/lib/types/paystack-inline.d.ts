declare module '@paystack/inline-js' {
	const PaystackPop: new () => {
		resumeTransaction(
			accessCode: string,
			callbacks?: {
				onLoad?: (r: { id: number; accessCode: string; customer: Record<string, unknown> }) => void;
				onSuccess?: (r: { id: number; reference: string; message: string }) => void;
				onCancel?: () => void;
				onError?: (e: { message: string }) => void;
			}
		): void;
	};
	export default PaystackPop;
}