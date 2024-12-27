import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Resume } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface DocumentSettingsFormProps {
  resume: Resume;
  onChange: (field: keyof Resume, value: any) => void;
}

export function DocumentSettingsForm({ resume, onChange }: DocumentSettingsFormProps) {
  const defaultSettings = {
    // Header Settings
    header_name_size: 24,
    header_name_bottom_spacing: 4,

    // Skills Section
    skills_margin_top: 2,
    skills_margin_bottom: 2,
    skills_item_spacing: 2,

    // Experience Section
    experience_margin_top: 2,
    experience_margin_bottom: 2,
    experience_item_spacing: 4,

    // Projects Section
    projects_margin_top: 2,
    projects_margin_bottom: 2,
    projects_item_spacing: 4,

    // Education Section
    education_margin_top: 2,
    education_margin_bottom: 2,
    education_item_spacing: 4,
  };

  // Initialize document_settings if it doesn't exist
  if (!resume.document_settings) {
    onChange('document_settings', defaultSettings);
  }

  const handleRestoreDefaults = () => {
    onChange('document_settings', defaultSettings);
  };

  const SectionSettings = ({ title, section }: { title: string; section: 'skills' | 'experience' | 'projects' | 'education' }) => (
    <div className="space-y-4 bg-slate-50/50 rounded-lg p-4 border border-slate-200/50">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-muted-foreground">Space Above {title} Section</Label>
          <span className="text-xs text-muted-foreground/60">{resume.document_settings?.[`${section}_margin_top`] !== undefined ? resume.document_settings[`${section}_margin_top`] : 2}pt</span>
        </div>
        <Slider
          value={[Number(resume.document_settings?.[`${section}_margin_top`] !== undefined ? resume.document_settings[`${section}_margin_top`] : 2)]}
          min={0}
          max={16}
          step={1}
          onValueChange={([value]) => 
            onChange('document_settings', {
              ...resume.document_settings,
              [`${section}_margin_top`]: value
            })
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-muted-foreground">Space Below {title} Section</Label>
          <span className="text-xs text-muted-foreground/60">{resume.document_settings?.[`${section}_margin_bottom`] !== undefined ? resume.document_settings[`${section}_margin_bottom`] : 2}pt</span>
        </div>
        <Slider
          value={[Number(resume.document_settings?.[`${section}_margin_bottom`] !== undefined ? resume.document_settings[`${section}_margin_bottom`] : 2)]}
          min={0}
          max={16}
          step={1}
          onValueChange={([value]) => 
            onChange('document_settings', {
              ...resume.document_settings,
              [`${section}_margin_bottom`]: value
            })
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-muted-foreground">Space Between Items</Label>
          <span className="text-xs text-muted-foreground/60">{resume.document_settings?.[`${section}_item_spacing`] !== undefined ? resume.document_settings[`${section}_item_spacing`] : 4}pt</span>
        </div>
        <Slider
          value={[Number(resume.document_settings?.[`${section}_item_spacing`] !== undefined ? resume.document_settings[`${section}_item_spacing`] : 4)]}
          min={0}
          max={8}
          step={0.5}
          onValueChange={([value]) => 
            onChange('document_settings', {
              ...resume.document_settings,
              [`${section}_item_spacing`]: value
            })
          }
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-white/40 shadow-xl backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Document Settings
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestoreDefaults}
            className="text-xs text-muted-foreground hover:text-teal-600 border-slate-200/50 hover:border-teal-200/50 transition-colors"
          >
            Restore Defaults
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Header Settings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Header</Label>
              <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>

            <div className="space-y-4 bg-slate-50/50 rounded-lg p-4 border border-slate-200/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">Name Size</Label>
                  <span className="text-xs text-muted-foreground/60">{resume.document_settings?.header_name_size !== undefined ? resume.document_settings.header_name_size : 24}pt</span>
                </div>
                <Slider
                  value={[resume.document_settings?.header_name_size !== undefined ? resume.document_settings.header_name_size : 24]}
                  min={0}
                  max={40}
                  step={1}
                  onValueChange={([value]) => 
                    onChange('document_settings', {
                      ...resume.document_settings,
                      header_name_size: value
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">Space Below Name</Label>
                  <span className="text-xs text-muted-foreground/60">{resume.document_settings?.header_name_bottom_spacing !== undefined ? resume.document_settings.header_name_bottom_spacing : 4}pt</span>
                </div>
                <Slider
                  value={[resume.document_settings?.header_name_bottom_spacing !== undefined ? resume.document_settings.header_name_bottom_spacing : 4]}
                  min={0}
                  max={18}
                  step={1}
                  onValueChange={([value]) => 
                    onChange('document_settings', {
                      ...resume.document_settings,
                      header_name_bottom_spacing: value
                    })
                  }
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground/40">Compact</span>
                  <span className="text-[10px] text-muted-foreground/40">Spacious</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Skills</Label>
              <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>
            <SectionSettings title="Skills" section="skills" />
          </div>

          {/* Experience Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Experience</Label>
              <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>
            <SectionSettings title="Experience" section="experience" />
          </div>

          {/* Projects Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Projects</Label>
              <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>
            <SectionSettings title="Projects" section="projects" />
          </div>

          {/* Education Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Education</Label>
              <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>
            <SectionSettings title="Education" section="education" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 