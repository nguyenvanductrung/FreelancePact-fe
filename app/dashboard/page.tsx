"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NavBar } from "@/components/shared/NavBar";
import { Briefcase, DollarSign, Target, Star, ChevronRight } from "lucide-react";
import { ContractSummary, Milestone, Payment } from "@/types";

// ─── Mock Data ──────────────────────────────────────────────────────────────

// TODO: replace with real API calls
const MOCK_CONTRACTS: ContractSummary[] = [
  {
    id: "CTR-2024-892",
    title: "Website Redesign",
    partnerName: "Acme Corp",
    status: "active",
    totalValue: 50000000,
    startDate: "2024-05-01T00:00:00Z",
    endDate: "2024-08-01T00:00:00Z",
    progressPercent: 40,
  },
  {
    id: "CTR-2024-893",
    title: "Mobile App MVP",
    partnerName: "Startup Inc",
    status: "pending_signature",
    totalValue: 120000000,
    startDate: "2024-06-15T00:00:00Z",
    endDate: "2024-10-15T00:00:00Z",
    progressPercent: 0,
  },
];

const MOCK_MILESTONES: (Milestone & { contractName: string })[] = [
  {
    id: "m1",
    name: "Design Wireframes",
    budget: 10000000,
    deadline: "2024-05-20T00:00:00Z",
    status: "completed",
    progressPercent: 100,
    contractName: "Website Redesign",
  },
  {
    id: "m2",
    name: "Frontend Implementation",
    budget: 20000000,
    deadline: "2024-06-25T00:00:00Z",
    status: "active",
    progressPercent: 25,
    contractName: "Website Redesign",
  },
];

const MOCK_PAYMENTS: Payment[] = [
  {
    id: "p1",
    contractId: "CTR-2024-892",
    milestoneId: "m1",
    amount: 10000000,
    status: "completed",
    createdAt: "2024-05-21T00:00:00Z",
    completedAt: "2024-05-22T00:00:00Z",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Active</span>;
    case "pending_signature":
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
    case "completed":
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Completed</span>;
    default:
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{status}</span>;
  }
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [contracts, setContracts] = useState<ContractSummary[]>([]);
  const [milestones, setMilestones] = useState<(Milestone & { contractName: string })[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    // TODO: replace with real API calls using fetch/lib api
    setContracts(MOCK_CONTRACTS);
    setMilestones(MOCK_MILESTONES);
    setPayments(MOCK_PAYMENTS);
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans">
      <NavBar activePage="Dashboard" />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here is an overview of your freelance activity.</p>
        </div>

        {/* Top Section - Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Contracts */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Briefcase className="w-6 h-6 text-[#4F6AF5]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter((c) => c.status === "active").length}
              </p>
            </div>
          </div>

          {/* Total Earned */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatVND(
                  payments
                    .filter((p) => p.status === "completed")
                    .reduce((acc, curr) => acc + curr.amount, 0)
                )}
              </p>
            </div>
          </div>

          {/* Pending Milestones */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Milestones</p>
              <p className="text-2xl font-bold text-gray-900">
                {milestones.filter((m) => m.status !== "completed").length}
              </p>
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">100%</p>
            </div>
          </div>
        </div>

        {/* Middle Section - Active Contracts Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your Contracts</h3>
            <Link href="/contracts" className="text-sm text-[#4F6AF5] font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Progress</th>
                  <th className="px-6 py-3 font-medium">Dates</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{contract.title}</td>
                    <td className="px-6 py-4 text-gray-600">{contract.partnerName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1B2A4A] rounded-full"
                            style={{ width: `${contract.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{contract.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(contract.status)}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/contracts/${contract.id}`}
                        className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors"
                        style={{ backgroundColor: "#1B2A4A" }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {contracts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No contracts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section - Milestones & Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Milestones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Milestones</h3>
            </div>
            <div className="p-6 flex-1">
              <ul className="space-y-4">
                {milestones
                  .filter((m) => m.status !== "completed")
                  .map((milestone) => (
                    <li key={milestone.id} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{milestone.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{milestone.contractName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatDate(milestone.deadline)}</p>
                        <div className="mt-1">{getStatusBadge(milestone.status)}</div>
                      </div>
                    </li>
                  ))}
                {milestones.filter((m) => m.status !== "completed").length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No upcoming milestones.</p>
                )}
              </ul>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
            </div>
            <div className="p-6 flex-1">
              <ul className="space-y-4">
                {payments.map((payment) => (
                  <li key={payment.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Payment Received</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {payment.completedAt ? formatDate(payment.completedAt) : formatDate(payment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatVND(payment.amount)}</p>
                      <div className="mt-1">{getStatusBadge(payment.status)}</div>
                    </div>
                  </li>
                ))}
                {payments.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No recent payments.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
