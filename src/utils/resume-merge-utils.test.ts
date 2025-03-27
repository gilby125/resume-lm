import { mergeResumeContent } from './resume-merge-utils';
import { Resume } from "@/lib/types";

describe('mergeResumeContent', () => {
  const mockResume1: Resume = {
    id: 'res1',
    user_id: 'user1',
    name: 'Resume 1',
    target_role: 'Software Engineer',
    is_base_resume: true,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    location: 'San Francisco, CA',
    summary: 'Experienced developer',
    work_experience: [
      {
        id: 'exp1',
        resume_id: 'res1',
        company: 'Company A',
        position: 'Developer',
        start_date: '2020-01',
        end_date: '2022-12',
        description: ['Worked on projects'],
        location: 'San Francisco',
        current: false
      }
    ],
    education: [
      {
        id: 'edu1',
        resume_id: 'res1',
        school: 'University A',
        degree: 'BS',
        field_of_study: 'Computer Science',
        start_year: '2016',
        end_year: '2020',
        description: ['Bachelor degree']
      }
    ],
    skills: [
      {
        id: 'skill1',
        resume_id: 'res1',
        skill_name: 'JavaScript',
        category: 'Programming',
        proficiency: 'Advanced'
      }
    ],
    projects: [
      {
        id: 'proj1',
        resume_id: 'res1',
        project_name: 'Project X',
        description: ['A cool project'],
        technologies: ['JavaScript', 'React']
      }
    ],
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
  };

  const mockResume2: Resume = {
    id: 'res2',
    user_id: 'user1',
    name: 'Resume 2',
    target_role: 'Senior Software Engineer',
    is_base_resume: false,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    location: 'San Francisco, CA',
    summary: 'Senior developer',
    work_experience: [
      {
        id: 'exp2',
        resume_id: 'res2',
        company: 'Company B',
        position: 'Senior Developer',
        start_date: '2023-01',
        description: ['Lead projects'],
        location: 'Remote',
        current: true
      },
      // Duplicate from resume 1 (should be merged)
      {
        id: 'exp1',
        resume_id: 'res1',
        company: 'Company A',
        position: 'Developer',
        start_date: '2020-01',
        end_date: '2022-12',
        description: ['Worked on projects'],
        location: 'San Francisco',
        current: false
      }
    ],
    education: [
      {
        id: 'edu2',
        resume_id: 'res2',
        school: 'University B',
        degree: 'MS',
        field_of_study: 'Data Science',
        start_year: '2020',
        end_year: '2022',
        description: ['Master degree']
      }
    ],
    skills: [
      {
        id: 'skill2',
        resume_id: 'res2',
        skill_name: 'TypeScript',
        category: 'Programming',
        proficiency: 'Advanced'
      },
      // Duplicate from resume 1 (should be merged)
      {
        id: 'skill1',
        resume_id: 'res1',
        skill_name: 'JavaScript',
        category: 'Programming',
        proficiency: 'Advanced'
      }
    ],
    projects: [],
    created_at: '2025-01-02',
    updated_at: '2025-01-02'
  };

  const mockEmptyResume: Resume = {
    id: 'empty',
    user_id: 'user1',
    name: 'Empty Resume',
    target_role: '',
    is_base_resume: false,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    work_experience: [],
    education: [],
    skills: [],
    projects: [],
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
  };

  it('merges work experience from multiple resumes', () => {
    const result = mergeResumeContent([mockResume1, mockResume2]);
    expect(result.work_experience).toHaveLength(2);
    expect(result.work_experience).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ company: 'Company A' }),
        expect.objectContaining({ company: 'Company B' })
      ])
    );
    // Verify merged descriptions
    const companyAExp = result.work_experience.find(e => e.company === 'Company A');
    expect(companyAExp?.description).toEqual(['Worked on projects']);
  });

  it('tracks sources for merged items', () => {
    const result = mergeResumeContent([mockResume1, mockResume2]);
    expect(result.sources.res1.sections.work_experience).toContain('exp1');
    expect(result.sources.res2.sections.work_experience).toContain('exp1');
    expect(result.sources.res2.sections.work_experience).toContain('exp2');
  });

  it('handles empty resumes', () => {
    const result = mergeResumeContent([mockEmptyResume]);
    expect(result.work_experience).toHaveLength(0);
    expect(result.education).toHaveLength(0);
    expect(result.skills).toHaveLength(0);
    expect(result.projects).toHaveLength(0);
    expect(result.sources.empty).toBeDefined();
  });

  it('preserves metadata from primary resume', () => {
    const result = mergeResumeContent([mockResume1, mockResume2]);
    expect(result.first_name).toBe('John');
    expect(result.last_name).toBe('Doe');
    expect(result.email).toBe('john@example.com');
  });

  it('handles array descriptions correctly', () => {
    const result = mergeResumeContent([mockResume1, mockResume2]);
    expect(result.work_experience[0].description).toBeInstanceOf(Array);
    expect(result.education[0].description).toBeInstanceOf(Array);
  });

  it('merges projects sections', () => {
    const result = mergeResumeContent([mockResume1, mockResume2]);
    expect(result.projects).toHaveLength(1);
    expect(result.projects[0].project_name).toBe('Project X');
  });

  it('merges education sections', () => {
    const result = mergeResumeContent([mockResume1, mockResume2]);
    expect(result.education).toHaveLength(2);
    expect(result.education).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ school: 'University A' }),
        expect.objectContaining({ school: 'University B' })
      ])
    );
  });

  it('merges skills sections', () => {
    const result = mergeResumeContent([mockResume1, mockResume2]);
    expect(result.skills).toHaveLength(2);
    expect(result.skills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'JavaScript' }),
        expect.objectContaining({ name: 'TypeScript' })
      ])
    );
  });

  it('handles missing sections', () => {
    const result = mergeResumeContent([mockResume1, mockEmptyResume]);
    expect(result.work_experience).toHaveLength(1);
    expect(result.education).toHaveLength(1);
    expect(result.skills).toHaveLength(1);
    expect(result.projects).toHaveLength(1);
  });
});
