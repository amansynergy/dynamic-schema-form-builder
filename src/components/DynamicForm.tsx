
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

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

interface DynamicFormProps {
  sections: FormSection[];
  onSubmit: (data: Record<string, any>) => void;
  title?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ sections, onSubmit, title = "Create New Entry" }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const getAllFields = (sections: FormSection[]): FormField[] => {
    const fields: FormField[] = [];
    
    const extractFields = (sectionList: FormSection[]) => {
      sectionList.forEach(section => {
        fields.push(...section.fields);
        if (section.children) {
          extractFields(section.children);
        }
      });
    };
    
    extractFields(sections);
    return fields;
  };

  const createHierarchicalEntry = (data: Record<string, any>) => {
    // Create the main entry with name and alias_name
    const mainEntry = {
      id: Date.now().toString(),
      name: data.name || "New Item",
      alias_name: data.alias_name || "Category",
      child: null
    };

    // If there are additional fields, create nested structure
    const otherFields = Object.keys(data).filter(key => key !== 'name' && key !== 'alias_name');
    
    if (otherFields.length > 0) {
      // Create child structure for additional data
      const childData = otherFields.reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {} as Record<string, any>);

      // Create a simple child structure
      mainEntry.child = {
        alias_name: "Additional Info",
        value: [
          {
            name: "Details",
            alias_name: "details",
            data: childData
          }
        ]
      };
    }

    return mainEntry;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allFields = getAllFields(sections);
    
    // Validate required fields
    const missingFields = allFields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(', ')}`);
      return;
    }

    const hierarchicalEntry = createHierarchicalEntry(formData);
    onSubmit(hierarchicalEntry);
    setFormData({});
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, Number(e.target.value))}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
      case 'select':
        return (
          <Select 
            value={formData[field.name] || ''} 
            onValueChange={(value) => handleInputChange(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
            rows={3}
          />
        );
      default:
        return null;
    }
  };

  const renderSection = (section: FormSection, level: number = 0): React.ReactNode => {
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
        {section.fields.length > 0 && (
          <Card className={`border-2 ${getBorderColor()} ${getBgColor()}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{section.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.name} className="flex items-center gap-1">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {section.children && section.children.map(child => 
          renderSection(child, level + 1)
        )}
      </div>
    );
  };

  if (sections.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-gray-500 text-lg">
            No form template defined yet. Please create a form template in the Form Builder first!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {sections.map(section => renderSection(section))}
          
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
