"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NavBar } from "@/components/shared/NavBar";
import { Briefcase, DollarSign, AlertCircle, Users, Check, X } from "lucide-react";
import { ContractSummary, Milestone } from "@/types";

// ─── Mock Data ──────────────────────────────────────────────────────────────

// TODO: replace with real API calls
const MOCK_PROJECTS: (ContractSummary & { budgetUsed: number })[] = [
  {
    id: "CTR-2024-892",
    title: "Website Redesign",
    partnerName: "Nguyen Van A", // Freelancer name
    status: "active",
    totalValue: 50000000,
    budgetUsed: 10000000,
    startDate: "2024-05-01T00:00:00Z",
    endDate: "2024-08-01T00:00:00Z",
    progressPercent: 40,
  },
  {
    id: "CTR-2024-893",
    title: "Mobile App MVP",
    partnerName: "Tran Thi B",
    status: "active",
    totalValue: 120000000,
    budgetUsed: 60000000,
    startDate: "2024-06-15T00:00:00Z",
    endDate: "2024-10-15T00:00:00Z",
    progressPercent: 50,
  },
];

const MOCK_PENDING_APPROVALS: (Milestone & { contractName: string; freelancerName: string })[] = [
  {
    id: "m2",
    name: "Frontend Implementation",
    budget: 20000000,
    deadline: "2024-06-25T00:00:00Z",
    status: "pending", // Waiting for review
    progressPercent: 100,
    contractName: "Website Redesign",
    freelancerName: "Nguyen Van A",
  },
];

const MOCK_ESCROW_SUMMARY = {
  totalEscrowed: 170000000,
  totalReleased: 70000000,
  remaining: 100000000,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
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

export default function ClientDashboardPage() {
  const [projects, setProjects] = useState<(ContractSummary & { budgetUsed: number })[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<(Milestone & { contractName: string; freelancerName: string })[]>([]);
  const [escrowSummary, setEscrowSummary] = useState(MOCK_ESCROW_SUMMARY);

  useEffect(() => {
    // TODO: replace with real API calls using fetch/lib api
    setProjects(MOCK_PROJECTS);
    setPendingApprovals(MOCK_PENDING_APPROVALS);
    setEscrowSummary(MOCK_ESCROW_SUMMARY);
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans">
      <NavBar activePage="Dashboard" />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your active projects, approvals, and escrowed funds.</p>
        </div>

        {/* Top Section - Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Projects */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Briefcase className="w-6 h-6 text-[#4F6AF5]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter((p) => p.status === "active").length}
              </p>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatVND(escrowSummary.totalReleased)}
              </p>
            </div>
          </div>

          {/* Milestones to Review (Amber highlight) */}
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-800 font-medium">Milestones to Review</p>
              <p className="text-2xl font-bold text-amber-900">
                {pendingApprovals.length}
              </p>
            </div>
          </div>

          {/* Freelancers Hired */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Freelancers Hired</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(projects.map(p => p.partnerName)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Main Section - My Projects Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">My Projects</h3>
            <Link href="/contracts" className="text-sm text-[#4F6AF5] font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Project Title</th>
                  <th className="px-6 py-3 font-medium">Freelancer</th>
                  <th className="px-6 py-3 font-medium">Progress</th>
                  <th className="px-6 py-3 font-medium">Budget Used / Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{project.title}</td>
                    <td className="px-6 py-4 text-gray-600">{project.partnerName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1B2A4A] rounded-full"
                            style={{ width: `${project.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{project.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="font-medium text-gray-900">{formatVND(project.budgetUsed)}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span>{formatVND(project.totalValue)}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(project.status)}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/contracts/${project.id}`}
                        className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors hover:opacity-90"
                        style={{ backgroundColor: "#1B2A4A" }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section - Pending Approvals & Escrow Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Approvals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
            </div>
            <div className="p-6 flex-1">
              <ul className="space-y-4">
                {pendingApprovals.map((milestone) => (
                  <li key={milestone.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-gray-900">{milestone.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{milestone.contractName} • {milestone.freelancerName}</p>
                      </div>
                      <p className="font-semibold text-[#1B2A4A]">{formatVND(milestone.budget)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
                {pendingApprovals.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No milestones waiting for approval.</p>
                )}
              </ul>
            </div>
          </div>

          {/* Escrow Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Escrow Summary</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Total Escrowed</span>
                  <span className="text-xl font-bold text-gray-900">{formatVND(escrowSummary.totalEscrowed)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Total Released</span>
                  <span className="text-xl font-bold text-green-600">{formatVND(escrowSummary.totalReleased)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Remaining in Escrow</span>
                  <span className="text-xl font-bold text-[#4F6AF5]">{formatVND(escrowSummary.remaining)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
