
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

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  title?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit, title = "Create New Entry" }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(', ')}`);
      return;
    }

    onSubmit(formData);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.name} className="flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}
          
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
