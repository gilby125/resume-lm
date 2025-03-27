'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { Profile, Resume } from "@/lib/types";

interface CreateResumeDialogProps {
  children: React.ReactNode;
  type: 'base' | 'tailored';
  profile: Profile;
  baseResumes?: Resume[];
}

export function CreateResumeDialog({ children, type, profile, baseResumes }: CreateResumeDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[800px] p-6"
        aria-describedby="resume-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>
            Create {type === 'base' ? 'Base' : 'Tailored'} Resume
          </DialogTitle>
          <DialogDescription id="resume-dialog-description">
            {type === 'base' 
              ? 'Create a new base resume that you can use as a template for job applications'
              : 'Create a tailored resume based on one of your base resumes'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Your existing dialog content */}
        
      </DialogContent>
    </Dialog>
  );
} 
