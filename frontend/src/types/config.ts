export interface VerificationType {
  type: "wld" | "uber" | "nft" | "self";
  id: string;
  address?: string;
  dateRange?: { start: string; end: string };
  coordinates?: { lat: number; lng: number };
  country?: string;
}

export interface RewardConfig {
  wallet: string;
  name: string;
  amount: number;
  requirements: VerificationType[];
  signature?: string;
} 