"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Job, Application } from "@/types";
import { jobsApi } from "@/lib/api";
import { CheckCircle2, AlertCircle, FileText, Star, Clock } from "lucide-react";

export default function ApplicantsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobData, appsData] = await Promise.all([
        jobsApi.getById(id),
        jobsApi.getApplications(id)
      ]);
      setJob(jobData);
      setApplications(appsData);
    } catch (err: any) {
      setError("Failed to load applicants: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFreelancer = async (applicationId: string) => {
    if (!confirm("Are you sure you want to select this freelancer and draft a contract?")) {
      return;
    }
    
    setSelectingId(applicationId);
    setError("");
    
    try {
      const res = await jobsApi.selectFreelancer(id, applicationId);
      // Redirect to the new draft contract to finish it
      router.push(`/contracts/${res.contractId}`);
    } catch (err: any) {
      setError(err.message || "Failed to select freelancer");
      setSelectingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading applicants...</div>;
  }

  if (!job) {
    return <div className="text-center py-12 text-destructive">Job not found.</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Review Applicants</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg border">
          <div className="font-medium text-foreground">
            {job.title}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">{job.budget} ₳</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}
          </div>
          <div className="flex items-center gap-1">
            Status: <span className="font-semibold uppercase">{job.status}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">
        {applications.length} Proposals
      </h2>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-xl shadow-sm">
          <p className="text-muted-foreground">No one has applied to this job yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="p-6 bg-card border rounded-xl shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{app.freelancerName}</h3>
                    <div className="flex items-center gap-1 text-sm text-yellow-500 mt-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{app.freelancerRating?.toFixed(1) || "New"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{app.proposedBudget || job.budget} ₳</div>
                    <div className="text-xs text-muted-foreground">Proposed Budget</div>
                  </div>
                </div>

                <div className="mt-4 bg-muted/30 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Cover Letter
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {app.coverLetter || "No cover letter provided."}
                  </p>
                </div>
                
                <div className="mt-4 text-xs text-muted-foreground">
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="md:w-48 flex flex-col justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                {app.status === "ACCEPTED" ? (
                  <div className="flex flex-col items-center justify-center text-green-600 gap-2 h-full bg-green-50 rounded-lg p-4">
                    <CheckCircle2 className="w-8 h-8" />
                    <span className="font-bold text-center">Hired for this Job</span>
                  </div>
                ) : app.status === "REJECTED" ? (
                  <div className="text-center text-muted-foreground p-4 bg-muted/50 rounded-lg">
                    Not Selected
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectFreelancer(app.id)}
                    disabled={selectingId !== null || job.status !== "OPEN"}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {selectingId === app.id ? (
                      "Processing..."
                    ) : (
                      <>
                        Hire Freelancer
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
