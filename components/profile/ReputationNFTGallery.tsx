"use client";

import { Award, ShieldCheck } from "lucide-react";
import { ReputationNFT } from "@/types/web3";
import { NAVY } from "@/constants";

// ─── Gradient palettes for thumbnail placeholders ─────────────────────────────

const THUMBNAIL_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
];

// ─── Single NFT card ──────────────────────────────────────────────────────────

function NFTCard({ nft, index }: { nft: ReputationNFT; index: number }) {
  const gradient = THUMBNAIL_GRADIENTS[index % THUMBNAIL_GRADIENTS.length];
  const mintedDate = new Date(nft.mintedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* ── Gradient thumbnail ── */}
      <div
        className="relative h-32 flex items-center justify-center"
        style={{ background: gradient }}
      >
        {/* CIP-25 badge — top right corner */}
        <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 bg-black/30 backdrop-blur-sm text-white text-[10px] font-bold rounded-full border border-white/20">
          <ShieldCheck className="w-2.5 h-2.5" />
          CIP-25
        </span>

        {/* Centre icon */}
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
          <Award className="w-7 h-7 text-white drop-shadow" />
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            Hợp đồng #{nft.contractId}
          </p>
          <h3 className="text-sm font-bold text-gray-900 mt-0.5 leading-snug line-clamp-2">
            {nft.contractTitle}
          </h3>
        </div>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5">
          {nft.skillTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Mint date */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <span className="text-[10px] text-gray-400">Minted on-chain</span>
          <span className="text-[10px] font-semibold text-gray-600">{mintedDate}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyNFTState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${NAVY}12` }}
      >
        <Award className="w-8 h-8 opacity-30" style={{ color: NAVY }} />
      </div>
      <p className="text-sm font-semibold text-gray-500">Chưa có NFT uy tín</p>
      <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
        Hoàn thành hợp đồng đầu tiên để nhận chứng nhận on-chain vĩnh viễn từ FreelancePact.
      </p>
    </div>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

interface ReputationNFTGalleryProps {
  nfts: ReputationNFT[];
}

export function ReputationNFTGallery({ nfts }: ReputationNFTGalleryProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* ── Header — matches SkillsCard / ExperienceCard pattern exactly ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${NAVY}15` }}
          >
            <Award className="w-4 h-4" style={{ color: NAVY }} />
          </div>
          <h2 className="text-sm font-bold text-gray-800">Reputation NFTs</h2>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold bg-emerald-50 border-emerald-200 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          On-chain · Cardano
        </span>
      </div>

      {/* ── NFT grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.length === 0 ? (
          <EmptyNFTState />
        ) : (
          nfts.map((nft, i) => <NFTCard key={nft.id} nft={nft} index={i} />)
        )}
      </div>
    </div>
  );
}
