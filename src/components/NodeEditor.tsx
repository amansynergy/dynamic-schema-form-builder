
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Check } from 'lucide-react';

interface NodeEditorProps {
  node: any;
  onSave: (node: any) => void;
  onCancel: () => void;
}

export const NodeEditor: React.FC<NodeEditorProps> = ({ node, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: node.name || '',
    alias_name: node.alias_name || '',
    child_alias_name: node.child?.alias_name || '',
    description: node.description || '',
    metadata: node.metadata || {}
  });

  const [metadataFields, setMetadataFields] = useState<Array<{key: string, value: string}>>([]);

  useEffect(() => {
    if (node.metadata) {
      const fields = Object.entries(node.metadata).map(([key, value]) => ({
        key,
        value: String(value)
      }));
      setMetadataFields(fields);
    }
  }, [node.metadata]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addMetadataField = () => {
    setMetadataFields(prev => [...prev, { key: '', value: '' }]);
  };

  const removeMetadataField = (index: number) => {
    setMetadataFields(prev => prev.filter((_, i) => i !== index));
  };

  const updateMetadataField = (index: number, field: 'key' | 'value', value: string) => {
    setMetadataFields(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    const metadata = metadataFields.reduce((acc, field) => {
      if (field.key.trim()) {
        acc[field.key.trim()] = field.value.trim();
      }
      return acc;
    }, {} as Record<string, string>);

    const updatedNode = {
      ...node,
      name: formData.name,
      alias_name: formData.alias_name,
      description: formData.description,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined
    };

    if (formData.child_alias_name && !updatedNode.child) {
      updatedNode.child = {
        alias_name: formData.child_alias_name,
        value: []
      };
    } else if (formData.child_alias_name && updatedNode.child) {
      updatedNode.child.alias_name = formData.child_alias_name;
    }

    onSave(updatedNode);
  };

  const industryTemplates = [
    {
      name: "Automotive",
      template: {
        name: "Toyota",
        alias_name: "Brand",
        child_alias_name: "Model Series"
      }
    },
    {
      name: "E-commerce",
      template: {
        name: "Electronics",
        alias_name: "Category",
        child_alias_name: "Product Type"
      }
    },
    {
      name: "Real Estate",
      template: {
        name: "Residential",
        alias_name: "Property Type",
        child_alias_name: "Sub Type"
      }
    },
    {
      name: "Food & Beverage",
      template: {
        name: "Beverages",
        alias_name: "Category",
        child_alias_name: "Type"
      }
    }
  ];

  const applyTemplate = (template: any) => {
    setFormData(prev => ({
      ...prev,
      ...template
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-lg text-blue-800">Quick Templates</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {industryTemplates.map((template) => (
              <Badge
                key={template.name}
                variant="outline"
                className="cursor-pointer hover:bg-blue-100 p-2"
                onClick={() => applyTemplate(template.template)}
              >
                {template.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Mercedes Benz, Electronics, Residential"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="alias_name" className="text-sm font-medium text-gray-700">
              Alias Name *
            </Label>
            <Input
              id="alias_name"
              value={formData.alias_name}
              onChange={(e) => handleInputChange('alias_name', e.target.value)}
              placeholder="e.g., Brand, Category, Type"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="child_alias_name" className="text-sm font-medium text-gray-700">
              Child Category Name
            </Label>
            <Input
              id="child_alias_name"
              value={formData.child_alias_name}
              onChange={(e) => handleInputChange('child_alias_name', e.target.value)}
              placeholder="e.g., Body Type, Sub Category, Model"
              className="mt-1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Optional description for this node"
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium text-gray-700">
                Additional Metadata
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMetadataField}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Field
              </Button>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {metadataFields.map((field, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Key"
                    value={field.key}
                    onChange={(e) => updateMetadataField(index, 'key', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => updateMetadataField(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeMetadataField(index)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!formData.name || !formData.alias_name}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Check className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};
