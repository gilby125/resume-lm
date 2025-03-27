'use client';

import React from "react";
import { cn } from "@/lib/utils";
import { Resume } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

interface BaseResumeSelectorProps {
  baseResumes: Resume[];
  selectedResumeIds: string[];
  onResumeSelect: (values: string[]) => void;
  isInvalid?: boolean;
  maxSelections?: number;
}

export function BaseResumeSelector({ 
  baseResumes = [],
  selectedResumeIds,
  onResumeSelect,
  isInvalid,
  maxSelections = 3,
}: BaseResumeSelectorProps) {
  const handleCheckedChange = (resumeId: string, checked: boolean) => {
    console.log('Checkbox changed:', { resumeId, checked, currentSelection: selectedResumeIds });
    
    if (checked && selectedResumeIds.length >= maxSelections) {
      toast({
        title: "Maximum Selection Reached",
        description: `You can only select up to ${maxSelections} base resumes.`,
        variant: "destructive",
      });
      return;
    }

    const newSelection = checked
      ? [...selectedResumeIds, resumeId]
      : selectedResumeIds.filter(id => id !== resumeId);

    console.log('New selection:', newSelection);
    onResumeSelect(newSelection);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {baseResumes.map((resume) => {
          const isSelected = selectedResumeIds.includes(resume.id);
          
          return (
            <div
              key={resume.id}
              className={cn(
                "relative flex items-center space-x-4 p-4 rounded-lg",
                "border transition-all duration-200",
                isSelected
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
              )}
            >
              <div className="flex items-center space-x-2 flex-1">
                <Checkbox
                  id={`resume-checkbox-${resume.id}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    console.log('Checkbox clicked:', resume.id);
                    handleCheckedChange(resume.id, checked === true);
                  }}
                  className={cn(
                    "h-5 w-5",
                    "data-[state=checked]:bg-purple-500",
                    "data-[state=checked]:border-purple-500",
                    "border-2 border-gray-300"
                  )}
                />
                <label
                  htmlFor={`resume-checkbox-${resume.id}`}
                  className="flex-1 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCheckedChange(resume.id, !isSelected);
                  }}
                >
                  <h4 className="font-medium text-gray-900">
                    {resume.name || 'Untitled Resume'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {resume.target_role || 'No target role specified'}
                  </p>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
