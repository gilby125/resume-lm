import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for better assertions
import { CreateTailoredResumeDialog } from './create-tailored-resume-dialog';
import { createTailoredResume } from '@/utils/actions/resumes/actions';

// Mock the createTailoredResume server action
jest.mock('@/utils/actions/resumes/actions', () => ({
  createTailoredResume: jest.fn(() => Promise.resolve({ id: 'test-resume-id', name: 'Test Tailored Resume' })), // Mock implementation
}));

const baseResumes = [
  { id: 'resume-1', name: 'Base Resume 1', target_role: 'Software Engineer' },
  { id: 'resume-2', name: 'Base Resume 2', target_role: 'Data Scientist' },
];

describe('CreateTailoredResumeDialog', () => {
  beforeEach(() => {
    (createTailoredResume as jest.Mock).mockClear(); // Clear mock calls before each test
  });

  it('renders without crashing', () => {
    render(
      <CreateTailoredResumeDialog baseResumes={baseResumes}>
        <div>Open Dialog</div>
      </CreateTailoredResumeDialog>
    );
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('allows selecting a resume, entering job details, and creating a tailored resume', async () => {
    render(
      <CreateTailoredResumeDialog baseResumes={baseResumes}>
        <div>Open Dialog</div>
      </CreateTailoredResumeDialog>
    );

    // Open the dialog
    fireEvent.click(screen.getByText('Open Dialog'));

    // Select a resume
    fireEvent.click(screen.getByLabelText('Base Resume 1'));

    // Enter job details
    fireEvent.change(screen.getByLabelText('Job Title'), { target: { value: 'Senior Developer' } });
    fireEvent.change(screen.getByLabelText('Company Name'), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText('Job Description (Optional, but recommended)'), { target: { value: 'Job description...' } });

    // Click the create button
    fireEvent.click(screen.getByText('Create Tailored Resume'));

    // Wait for the server action to be called
    await waitFor(() => {
      expect(createTailoredResume).toHaveBeenCalledTimes(1);
      expect(createTailoredResume).toHaveBeenCalledWith(
        baseResumes[0], // Selected resume object
        null,
        'Senior Developer',
        'Acme Corp',
        'Job description...'
      );
    });
  });

  it('displays an error message if no resume is selected', async () => {
    render(
      <CreateTailoredResumeDialog baseResumes={baseResumes}>
        <div>Open Dialog</div>
      </CreateTailoredResumeDialog>
    );

    // Open the dialog
    fireEvent.click(screen.getByText('Open Dialog'));

    // Click the create button without selecting a resume
    fireEvent.click(screen.getByText('Create Tailored Resume'));

    // Check for the error message
    await waitFor(() => {
      expect(screen.getByText('No Resume Selected')).toBeInTheDocument();
    });
  });

  it('displays an error message if job title or company name is missing', async () => {
    render(
      <CreateTailoredResumeDialog baseResumes={baseResumes}>
        <div>Open Dialog</div>
      </CreateTailoredResumeDialog>
    );

    // Open the dialog
    fireEvent.click(screen.getByText('Open Dialog'));

    // Select a resume
    fireEvent.click(screen.getByLabelText('Base Resume 1'));

    // Click the create button without entering job title or company name
    fireEvent.click(screen.getByText('Create Tailored Resume'));

    // Check for the error message
    await waitFor(() => {
      expect(screen.getByText('Missing Information')).toBeInTheDocument();
    });
  });
});
