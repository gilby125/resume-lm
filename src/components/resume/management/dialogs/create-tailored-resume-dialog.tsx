'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createTailoredResume } from "@/utils/actions/resumes/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Changed from Checkbox
import { Input } from "@/components/ui/input"; // Added Input
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Resume } from "@/lib/types";

interface CreateTailoredResumeDialogProps {
  children: React.ReactNode;
  baseResumes?: Resume[];
}

export function CreateTailoredResumeDialog({ children, baseResumes = [] }: CreateTailoredResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null); // Changed state for single selection
  const [jobTitle, setJobTitle] = useState(''); // Added state for Job Title
  const [companyName, setCompanyName] = useState(''); // Added state for Company Name
  const [jobDescription, setJobDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleCreate = async () => {
    setIsCreating(true); // Set loading state

    if (!selectedResumeId) {
      toast({
        title: "No Resume Selected",
        description: "Please select a base resume",
        variant: "destructive",
      });
      setIsCreating(false);
      return;
    }

    if (!jobTitle || !companyName) {
       toast({
        title: "Missing Information",
        description: "Please enter both Job Title and Company Name",
        variant: "destructive",
      });
      setIsCreating(false);
      return;
    }

    // Get the selected base resume object
    const selectedResume = baseResumes?.find(resume => resume.id === selectedResumeId);

    if (!selectedResume) {
      toast({
        title: "Error",
        description: "Selected base resume not found.",
        variant: "destructive",
      });
      setIsCreating(false);
      return;
    }

    try {
      // Call createTailoredResume with the single selected resume and job details
      const tailoredResume = await createTailoredResume(
        selectedResume,
        null, // Assuming jobId is not needed here or handled differently
        jobTitle,
        companyName,
        jobDescription
      );

      toast({
        title: "Success",
        description: `Tailored resume "${tailoredResume.name}" created.`,
      });
      router.push(`/resumes/${tailoredResume.id}`); // Navigate to the new resume
      setOpen(false); // Close the dialog on success

    } catch (error) {
      console.error("Error creating tailored resume:", error);
      toast({
        title: "Error Creating Resume",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false); // Reset loading state
    }
  };

  // Reset form state when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedResumeId(null);
      setJobTitle('');
      setCompanyName('');
      setJobDescription('');
      setIsCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Tailored Resume</DialogTitle>
          <DialogDescription>
            Select a base resume and provide job details to generate a tailored version.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Base Resume Selection */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Select Base Resume</Label>
            <RadioGroup
              value={selectedResumeId ?? undefined}
              onValueChange={setSelectedResumeId}
              className="border rounded-lg divide-y max-h-60 overflow-y-auto" // Added scroll for many resumes
            >
              {baseResumes?.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">No base resumes available.</p>
              )}
              {baseResumes?.map((resume) => (
                <Label
                  key={resume.id}
                  htmlFor={`resume-${resume.id}`}
                  className={cn(
                    "flex items-center space-x-3 p-3 cursor-pointer",
                    "transition-colors duration-200 hover:bg-gray-50",
                    selectedResumeId === resume.id && "bg-purple-50"
                  )}
                >
                  <RadioGroupItem
                    value={resume.id}
                    id={`resume-${resume.id}`}
                    className={cn(
                      "border-gray-300 text-purple-600 focus:ring-purple-500",
                      selectedResumeId === resume.id && "border-purple-600"
                    )}
                  />
                  <div className="flex-1 select-none">
                    <div className="font-medium">{resume.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {resume.target_role || 'No target role specified'}
                    </div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Job Title and Company Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Software Engineer"
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Acme Corp"
                disabled={isCreating}
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description (Optional, but recommended)</Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here for better tailoring..."
              className="h-32"
              disabled={isCreating}
            />
          </div>
        </div>

        <DialogFooter>
           <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating || !selectedResumeId || !jobTitle || !companyName}
          >
            {/* Add spinner or better loading indicator here if desired */}
            {isCreating ? "Creating..." : "Create Tailored Resume"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
