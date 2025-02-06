"use client";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import JobCard from "@/components/JobCard";
import { Job } from "@/lib/jobs";

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // States for custom filters
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch("/jobs.csv");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        // Clean data
        transform: (value: string) => value.replace(/(^")|("$)/g, "").replace(/[\r\n]+/g, " ").trim(),
        complete: (result) => {
          // Map data
          const parsedJobs: Job[] = (result.data as any[]).map((row) => ({
            title: row["Job Title"],
            company: row["Company Name"],
            location: row["Location"],
            description: row["Job Description"],
            requirements: row["Requirements"]
          }));
          setJobs(parsedJobs);
        }
      });
    };

    // Load saved jobs from local storage 
    const stored = JSON.parse(localStorage.getItem("savedJobs") || "[]") as Job[];
    setSavedJobs(stored);

    fetchJobs();
  }, []);

  // Toggle saved state for a job
  const handleSaveJob = (job: Job) => {
    let updatedSavedJobs = [...savedJobs];
    if (updatedSavedJobs.some((j) => j.title === job.title)) {
      updatedSavedJobs = updatedSavedJobs.filter((j) => j.title !== job.title);
    } else {
      updatedSavedJobs.push(job);
    }
    /*
      console.log(updatedSavedJobs)
    */
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
  };

  // Filtering logic
  /*
    Note - make sure locations don't match using substrings (CA should not map to Chicago where ca is in chicago)
  */
  const filteredJobs = jobs.filter((job) => {
    const searchMatch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());

    const skillsMatch =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) =>
        job.requirements.toLowerCase().includes(skill.toLowerCase()) ||
        job.description.toLowerCase().includes(skill.toLowerCase())
      );

    const locationMatch =
      selectedLocations.length === 0 ||
      selectedLocations.some((loc) =>
        job.location
          .toLowerCase()
          .split(/\s+/)
          .some((word) => word.startsWith(loc.toLowerCase()))
      );

    return searchMatch && skillsMatch && locationMatch;
  });

  // Handlers to add custom filters
  const addSkillFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillInput && !selectedSkills.includes(skillInput)) {
      setSelectedSkills([...selectedSkills, skillInput]);
      setSkillInput("");
    }
  };

  const addLocationFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput && !selectedLocations.includes(locationInput)) {
      setSelectedLocations([...selectedLocations, locationInput]);
      setLocationInput("");
    }
  };

  // Handlers to remove filters
  const removeSkillFilter = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const removeLocationFilter = (loc: string) => {
    setSelectedLocations(selectedLocations.filter((l) => l !== loc));
  };

  return (
    <div className="container mx-auto p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>

      {/* Search Bar and Filter Button */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by job title or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border rounded"
        />
        <button
          className="p-2 border rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
        >
          Filter
        </button>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="mb-4 p-4 border rounded bg-gray-50">
          <div className="mb-2">
            <form onSubmit={addSkillFilter} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Add skill filter (e.g., Python)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="p-2 border rounded flex-grow"
              />
              <button type="submit" className="p-2 border rounded bg-blue-500 text-white">
                Add Skill
              </button>
            </form>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer"
                  onClick={() => removeSkillFilter(skill)}
                  title="Click to remove filter"
                >
                  {skill} &times;
                </span>
              ))}
            </div>
          </div>
          <div>
            <form onSubmit={addLocationFilter} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Add location filter (e.g., CA for California)"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="p-2 border rounded flex-grow"
              />
              <button type="submit" className="p-2 border rounded bg-blue-500 text-white">
                Add Location
              </button>
            </form>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedLocations.map((loc) => (
                <span
                  key={loc}
                  className="bg-green-100 text-green-700 px-2 py-1 rounded cursor-pointer"
                  onClick={() => removeLocationFilter(loc)}
                  title="Click to remove filter"
                >
                  {loc} &times;
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filtered Job Listings */}
      <div className="flex flex-col gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <JobCard
              key={index}
              job={job}
              isSaved={savedJobs.some((j) => j.title === job.title)}
              onSave={handleSaveJob}
            />
          ))
        ) : (
          <p className="text-gray-500">No jobs found.</p>
        )}
      </div>
    </div>
  );
}
