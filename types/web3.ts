export type WalletProvider = 'nami' | 'eternl';

export interface WalletState {
  connected: boolean;
  provider: WalletProvider | null;
  address: string | null;
  balanceAda: number;
}

export type EscrowStatus =
  | 'PENDING_DEPOSIT'
  | 'FUNDED'
  | 'SUBMITTED'
  | 'CLIENT_CONFIRMED'
  | 'FREELANCER_CONFIRMED'
  | 'RELEASED'
  | 'DISPUTED'
  | 'RESOLVED';

export interface ReputationNFT {
  id: string;
  contractId: string;
  contractTitle: string;
  mintedAt: string;
  skillTags: string[];
  metadataStandard: 'CIP-25';
}
