import React from "react";
import { cn } from "@/lib/utils";
import { Resume, WorkExperience } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BaseResumeSelectorProps {
  baseResumes: Resume[];
  selectedResumeIds: string[];
  onResumeSelect: (values: string[]) => void;
  isInvalid?: boolean;
}

function analyzeResumesForJob(baseResumes: Resume[], jobDesc: string) {
  if (!jobDesc) return null;
  
  // Extract keywords from job description
  const jobKeywords = jobDesc.toLowerCase().match(/\b\w+\b/g) || [];
  
  // Score each resume based on keyword matches
  const scoredResumes = baseResumes.map((resume: Resume) => {
    const content = resume.work_experience
      ?.map((exp: WorkExperience) => exp.description.join(' '))
      .join(' ') || '';
    const contentKeywords: string[] = content.toLowerCase().match(/\b\w+\b/g) || [];
    
    // Calculate match score
    const score = jobKeywords.filter((keyword: string) => 
      contentKeywords.includes(keyword)
    ).length;
    
    return { ...resume, score };
  });

  // Sort by score descending
  scoredResumes.sort((a, b) => b.score - a.score);

  // Extract best content from top resumes
  const bestContent = scoredResumes.slice(0, 3).map(resume => ({
    id: resume.id,
    name: resume.name,
    content: resume.work_experience?.map(exp => exp.description.join('\n')).join('\n\n')
  }));

  return bestContent;
}

export function BaseResumeSelector({ 
  baseResumes = [],
  selectedResumeIds: initialSelectedResumeIds = [],
  onResumeSelect,
  isInvalid 
}: BaseResumeSelectorProps) {
  const [selectedResumeIds, setSelectedResumeIds] = React.useState<string[]>(initialSelectedResumeIds || []);
  const [jobDesc, setJobDesc] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!Array.isArray(baseResumes)) {
      console.error('[BaseResumeSelector] baseResumes must be an array');
      return;
    }
  }, [baseResumes]);

  const isInitialMount = React.useRef(true);

  const handleResumeSelect = React.useCallback((newIds: string[]) => {
    try {
      if (!Array.isArray(newIds)) {
        throw new Error('Invalid resume selection');
      }
      
      const uniqueIds = Array.from(new Set(newIds));
      setSelectedResumeIds(uniqueIds);
    } catch (error) {
      console.error('[BaseResumeSelector] Error handling resume selection:', error);
    }
  }, []);

  // Sync initial selected state only when it changes
  React.useEffect(() => {
    if (initialSelectedResumeIds && Array.isArray(initialSelectedResumeIds)) {
      // Only update if the values are different
      if (JSON.stringify(initialSelectedResumeIds) !== JSON.stringify(selectedResumeIds)) {
        setSelectedResumeIds(initialSelectedResumeIds);
      }
    }
  }, [initialSelectedResumeIds, selectedResumeIds]);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else if (typeof onResumeSelect === 'function') {
      onResumeSelect(selectedResumeIds);
    }
  }, [selectedResumeIds, onResumeSelect]);

  const handleJobDescChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      setIsLoading(true);
      const value = e.target.value;
      setJobDesc(value);
      
      if (value && Array.isArray(baseResumes)) {
        const bestResumes = analyzeResumesForJob(baseResumes, value);
        if (bestResumes) {
          const bestIds = bestResumes.map(r => r.id);
          handleResumeSelect(bestIds);
        }
      }
    } catch (error) {
      console.error('[BaseResumeSelector] Error analyzing job description:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!onResumeSelect || typeof onResumeSelect !== 'function') {
    console.error('[BaseResumeSelector] Missing or invalid onResumeSelect prop');
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        Configuration error: Missing required onResumeSelect function
      </div>
    );
  }

  if (!Array.isArray(baseResumes)) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        Configuration error: baseResumes must be an array
      </div>
    );
  }

  // Filter out invalid resumes
  const validResumes = baseResumes.filter(resume => 
    resume?.id && typeof resume.id === 'string' && 
    resume?.name && typeof resume.name === 'string'
  );

  if (validResumes.length === 0) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        No valid resumes found
      </div>
    );
  }
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Select Base Resumes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Base Resumes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="job-description" className="block text-sm font-medium mb-2">
              Job Description
            </label>
            <textarea
              id="job-description"
              value={jobDesc}
              onChange={handleJobDescChange}
              rows={4}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Paste job description here..."
            />
          </div>
          <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : (
          validResumes.map((resume) => (
            <div key={resume.id} className="flex items-center space-x-2">
              <Checkbox
                id={resume.id}
                checked={selectedResumeIds.includes(resume.id)}
                onCheckedChange={(checked) => {
                  const newIds = checked === true
                    ? [...selectedResumeIds, resume.id]
                    : selectedResumeIds.filter(id => id !== resume.id);
                  handleResumeSelect(newIds);
                }}
                aria-label={`Select ${resume.name} as base resume`}
                disabled={isLoading}
              />
              <label
                htmlFor={resume.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {resume.name}
              </label>
            </div>
          ))
        )}
      </div>
      {selectedResumeIds.length > 0 && (
        <div className="text-sm text-gray-500">
          Selected {selectedResumeIds.length} base resume{selectedResumeIds.length > 1 ? 's' : ''}
        </div>
      )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
