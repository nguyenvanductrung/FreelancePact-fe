import { WalletProvider, WalletState, EscrowStatus, ReputationNFT } from '../types/web3';

export const mockConnectWallet = async (provider: WalletProvider): Promise<WalletState> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate fake address and random balance between 50 and 5000 ADA
      const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const randomBalance = Math.floor(Math.random() * (5000 - 50 + 1) + 50);

      resolve({
        connected: true,
        provider,
        address: `addr1q${randomString}`,
        balanceAda: randomBalance,
      });
    }, 800);
  });
};

export const mockEscrowStatusByContractId: Record<string, EscrowStatus> = {
  // References the hardcoded contract ID from page.tsx
  'CTR-2024-892': 'FUNDED',
  'CTR-2024-893': 'PENDING_DEPOSIT',
  'CTR-2024-894': 'RELEASED',
  'CTR-2024-895': 'DISPUTED',
};

export const mockReputationNFTs: ReputationNFT[] = [
  {
    id: 'nft-rep-001',
    contractId: 'CTR-2023-112',
    contractTitle: 'E-commerce Platform Redesign',
    mintedAt: '2023-12-01T10:00:00Z',
    skillTags: ['UI/UX', 'Figma', 'Web Design'],
    metadataStandard: 'CIP-25',
  },
  {
    id: 'nft-rep-002',
    contractId: 'CTR-2024-045',
    contractTitle: 'Smart Contract Audit & Optimization',
    mintedAt: '2024-03-15T14:30:00Z',
    skillTags: ['Security', 'Aiken', 'Cardano'],
    metadataStandard: 'CIP-25',
  },
  {
    id: 'nft-rep-003',
    contractId: 'CTR-2024-318',
    contractTitle: 'React Native Mobile App Development',
    mintedAt: '2024-08-20T09:15:00Z',
    skillTags: ['React Native', 'Frontend', 'Mobile'],
    metadataStandard: 'CIP-25',
  },
];
