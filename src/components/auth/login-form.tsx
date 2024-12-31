"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/auth/login/actions";
import { useState } from "react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  setError: (error: string) => void;
}

export function LoginForm() {
  const [error, setError] = useState<string>();

  function SubmitButton({ setError }: SubmitButtonProps) {
    const { pending } = useFormStatus();
    return (
      <Button 
        type="submit" 
        onClick={async (e) => {
          e.preventDefault();
          const form = e.currentTarget.form;
          if (!form) return;
          const formData = new FormData(form);
          const result = await login(formData);
          if (!result.success) {
            setError("Invalid credentials");
          }
        }} 
        disabled={pending}
        className="w-full"
      >
        Sign In
      </Button>
    );
  }

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
      <SubmitButton setError={setError} />
    </form>
  );
} 