"use client";

import { useState } from "react";

interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
}

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onSave: (job: Job) => void;
}

export default function JobCard({ job, isSaved, onSave }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    onSave(job);
  };

  return (
    <div
      className={`transition-all duration-300 p-4 rounded-lg shadow-md border cursor-pointer bg-white ${
        expanded ? "h-auto" : "h-32"
      } hover:scale-[1.02] relative`}
      onClick={() => setExpanded(!expanded)}
    >
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-sm text-gray-600">
        {job.company} - {job.location}
      </p>

      {expanded && (
        <div className="mt-2">
          <p className="text-sm">{job.description}</p>
          <p className="text-sm">Requirements: {job.requirements}</p>
        </div>
      )}

      <button
        className="absolute top-2 right-2 p-1 bg-transparent border-0 outline-none appearance-none"
        onClick={handleClick}
        style={{
          filter: isSaved
            ? "sepia(100%) saturate(500%) hue-rotate(10deg) brightness(120%)"
            : "none",
        }}
      >
      <img src="/save_icon.jpg" alt="Save Icon" className="w-6 h-6" />
    </button>

    </div>
  );
}
