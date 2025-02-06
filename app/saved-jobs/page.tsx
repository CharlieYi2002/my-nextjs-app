"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import { Job } from "@/lib/jobs";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]") as Job[];
    setSavedJobs(storedJobs);
  }, []);

  const handleSaveJob = (job: Job) => {
    // Clicking save button when it's already highlighted should unsave the job 
    const newSavedJobs = savedJobs.filter((j) => j.title !== job.title);
    setSavedJobs(newSavedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(newSavedJobs));
  };

  return (
    <div className="container mx-auto p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>
      <div className="flex flex-col gap-4">
        {savedJobs.length > 0 ? (
          savedJobs.map((job, index) => (
            <JobCard
              key={index}
              job={job}
              isSaved={true}
              onSave={handleSaveJob}
            />
          ))
        ) : (
          <p className="text-gray-500">No saved jobs yet.</p>
        )}
      </div>
    </div>
  );
}
