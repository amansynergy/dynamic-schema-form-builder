
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Save, Edit, ChevronDown, ChevronUp, FolderPlus } from 'lucide-react';

interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

interface FormSection {
  id: string;
  name: string;
  label: string;
  fields: FormField[];
  children?: FormSection[];
}

interface HierarchicalFormBuilderProps {
  onSave: (sections: FormSection[]) => void;
  initialSections?: FormSection[];
}

export const HierarchicalFormBuilder: React.FC<HierarchicalFormBuilderProps> = ({ 
  onSave, 
  initialSections = [] 
}) => {
  const [sections, setSections] = useState<FormSection[]>(
    initialSections.length > 0 ? initialSections : [
      {
        id: '1',
        name: 'basic_info',
        label: 'Basic Information',
        fields: [
          { id: '1', name: 'name', label: 'Name', type: 'text', required: true },
          { id: '2', name: 'alias_name', label: 'Category Type', type: 'text', required: true }
        ]
      }
    ]
  );

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['1']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const addSection = (parentId?: string) => {
    const newSection: FormSection = {
      id: Date.now().toString(),
      name: '',
      label: '',
      fields: []
    };

    if (parentId) {
      setSections(prevSections => {
        const updateSection = (section: FormSection): FormSection => {
          if (section.id === parentId) {
            return {
              ...section,
              children: [...(section.children || []), newSection]
            };
          }
          if (section.children) {
            return {
              ...section,
              children: section.children.map(updateSection)
            };
          }
          return section;
        };
        return prevSections.map(updateSection);
      });
    } else {
      setSections([...sections, newSection]);
    }
  };

  const updateSection = (sectionId: string, updates: Partial<FormSection>) => {
    const updateSectionRecursive = (section: FormSection): FormSection => {
      if (section.id === sectionId) {
        return { ...section, ...updates };
      }
      if (section.children) {
        return {
          ...section,
          children: section.children.map(updateSectionRecursive)
        };
      }
      return section;
    };

    setSections(sections.map(updateSectionRecursive));
  };

  const removeSection = (sectionId: string) => {
    const removeSectionRecursive = (sections: FormSection[]): FormSection[] => {
      return sections
        .filter(section => section.id !== sectionId)
        .map(section => ({
          ...section,
          children: section.children ? removeSectionRecursive(section.children) : undefined
        }));
    };

    setSections(removeSectionRecursive(sections));
  };

  const addField = (sectionId: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      name: '',
      label: '',
      type: 'text',
      required: false
    };

    updateSection(sectionId, {
      fields: [...(findSection(sectionId)?.fields || []), newField]
    });
  };

  const findSection = (sectionId: string): FormSection | null => {
    const search = (sections: FormSection[]): FormSection | null => {
      for (const section of sections) {
        if (section.id === sectionId) return section;
        if (section.children) {
          const found = search(section.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(sections);
  };

  const updateField = (sectionId: string, fieldId: string, updates: Partial<FormField>) => {
    const section = findSection(sectionId);
    if (section) {
      const updatedFields = section.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      );
      updateSection(sectionId, { fields: updatedFields });
    }
  };

  const removeField = (sectionId: string, fieldId: string) => {
    const section = findSection(sectionId);
    if (section) {
      const updatedFields = section.fields.filter(field => field.id !== fieldId);
      updateSection(sectionId, { fields: updatedFields });
    }
  };

  const addOption = (sectionId: string, fieldId: string) => {
    const section = findSection(sectionId);
    const field = section?.fields.find(f => f.id === fieldId);
    if (field) {
      const options = field.options || [];
      updateField(sectionId, fieldId, { options: [...options, ''] });
    }
  };

  const updateOption = (sectionId: string, fieldId: string, optionIndex: number, value: string) => {
    const section = findSection(sectionId);
    const field = section?.fields.find(f => f.id === fieldId);
    if (field && field.options) {
      const newOptions = [...field.options];
      newOptions[optionIndex] = value;
      updateField(sectionId, fieldId, { options: newOptions });
    }
  };

  const removeOption = (sectionId: string, fieldId: string, optionIndex: number) => {
    const section = findSection(sectionId);
    const field = section?.fields.find(f => f.id === fieldId);
    if (field && field.options) {
      const newOptions = field.options.filter((_, index) => index !== optionIndex);
      updateField(sectionId, fieldId, { options: newOptions });
    }
  };

  const renderSection = (section: FormSection, level: number = 0): React.ReactNode => {
    const isExpanded = expandedSections.has(section.id);
    const indentation = level * 20;
    
    const getBorderColor = () => {
      const colors = ['border-blue-200', 'border-green-200', 'border-purple-200', 'border-orange-200'];
      return colors[level % colors.length];
    };

    const getBgColor = () => {
      const colors = ['bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-orange-50'];
      return colors[level % colors.length];
    };

    return (
      <div key={section.id} style={{ marginLeft: indentation }} className="space-y-3">
        <Card className={`border-2 ${getBorderColor()} ${getBgColor()}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection(section.id)}
                  className="p-1 h-6 w-6"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Section Name</Label>
                    <Input
                      value={section.name}
                      onChange={(e) => updateSection(section.id, { name: e.target.value })}
                      placeholder="e.g., basic_info"
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Section Label</Label>
                    <Input
                      value={section.label}
                      onChange={(e) => updateSection(section.id, { label: e.target.value })}
                      placeholder="e.g., Basic Information"
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addSection(section.id)}
                  className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
                  title="Add Subsection"
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addField(section.id)}
                  className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100"
                  title="Add Field"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSection(section.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                  title="Remove Section"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {isExpanded && (
            <CardContent className="pt-0">
              {section.fields.map((field) => (
                <Card key={field.id} className="p-3 mb-3 border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Field Name</Label>
                      <Input
                        value={field.name}
                        onChange={(e) => updateField(section.id, field.id, { name: e.target.value })}
                        placeholder="e.g., brand, category"
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Field Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
                        placeholder="e.g., Brand Name"
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Field Type</Label>
                      <Select 
                        value={field.type} 
                        onValueChange={(value: any) => updateField(section.id, field.id, { type: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(section.id, field.id, { required: e.target.checked })}
                        />
                        Required
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeField(section.id, field.id)}
                        className="text-red-600 h-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {field.type === 'select' && (
                    <div className="mt-3">
                      <Label className="text-xs">Options</Label>
                      <div className="space-y-2">
                        {(field.options || []).map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(section.id, field.id, index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                              className="h-8"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(section.id, field.id, index)}
                              className="h-8"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(section.id, field.id)}
                          className="h-8"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              {section.fields.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No fields in this section. Click "Add Field" to add some.
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {isExpanded && section.children && section.children.map(child => 
          renderSection(child, level + 1)
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hierarchical Form Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map(section => renderSection(section))}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => addSection()}>
            <FolderPlus className="h-4 w-4 mr-1" />
            Add Section
          </Button>
          <Button onClick={() => onSave(sections)}>
            <Save className="h-4 w-4 mr-1" />
            Save Form Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
