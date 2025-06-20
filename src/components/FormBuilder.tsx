
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Save } from 'lucide-react';

interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

interface FormBuilderProps {
  onSave: (fields: FormField[]) => void;
  initialFields?: FormField[];
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ onSave, initialFields = [] }) => {
  const [fields, setFields] = useState<FormField[]>(initialFields.length > 0 ? initialFields : [
    { id: '1', name: 'name', label: 'Name', type: 'text', required: true },
    { id: '2', name: 'alias_name', label: 'Category Type', type: 'text', required: true }
  ]);

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      name: '',
      label: '',
      type: 'text',
      required: false
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const addOption = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const options = field.options || [];
      updateField(fieldId, { options: [...options, ''] });
    }
  };

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.options) {
      const newOptions = [...field.options];
      newOptions[optionIndex] = value;
      updateField(fieldId, { options: newOptions });
    }
  };

  const removeOption = (fieldId: string, optionIndex: number) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.options) {
      const newOptions = field.options.filter((_, index) => index !== optionIndex);
      updateField(fieldId, { options: newOptions });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Field Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <Card key={field.id} className="p-4 border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Field Name</Label>
                <Input
                  value={field.name}
                  onChange={(e) => updateField(field.id, { name: e.target.value })}
                  placeholder="e.g., brand, category"
                />
              </div>
              <div>
                <Label>Field Label</Label>
                <Input
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  placeholder="e.g., Brand Name, Category"
                />
              </div>
              <div>
                <Label>Field Type</Label>
                <Select value={field.type} onValueChange={(value: any) => updateField(field.id, { type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="select">Select Dropdown</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                  />
                  Required
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeField(field.id)}
                  className="text-red-600"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {field.type === 'select' && (
              <div className="mt-4">
                <Label>Options</Label>
                <div className="space-y-2">
                  {(field.options || []).map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(field.id, index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(field.id, index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(field.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}

        <div className="flex justify-between">
          <Button variant="outline" onClick={addField}>
            <Plus className="h-4 w-4 mr-1" />
            Add Field
          </Button>
          <Button onClick={() => onSave(fields)}>
            <Save className="h-4 w-4 mr-1" />
            Save Form Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
