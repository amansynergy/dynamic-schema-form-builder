import React, { useState } from 'react';
import { HierarchicalManager } from '@/components/HierarchicalManager';
import { HierarchicalFormBuilder } from '@/components/HierarchicalFormBuilder';
import { DynamicForm } from '@/components/DynamicForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, Database } from 'lucide-react';

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

const Index = () => {
  const [hierarchies, setHierarchies] = useState([
    {
      id: '1',
      name: "mercedes benz",
      alias_name: "Brand",
      child: {
        alias_name: "Body Type",
        value: [
          {
            name: "ABC",
            alias_name: "body type",
            child: {
              alias_name: "Model Name",
              value: [
                {
                  name: "A-class",
                  alias_name: "model",
                  child: {
                    alias_name: "segment",
                    value: [{ name: "SUV", alias_name: "segment" }]
                  }
                },
                {
                  name: "B-class",
                  alias_name: "model"
                }
              ]
            }
          },
          {
            name: "XYZ",
            alias_name: "body type"
          }
        ]
      }
    }
  ]);

  const [formSections, setFormSections] = useState<FormSection[]>([
    {
      id: '1',
      name: 'basic_info',
      label: 'Basic Information',
      fields: [
        { id: '1', name: 'name', label: 'Name', type: 'text', required: true },
        { id: '2', name: 'alias_name', label: 'Category Type', type: 'text', required: true }
      ]
    }
  ]);

  const getFlatFields = (sections: FormSection[]): FormField[] => {
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

  const addNewHierarchy = () => {
    const newHierarchy = {
      id: Date.now().toString(),
      name: "New Item",
      alias_name: "Root Category",
      child: null
    };
    setHierarchies([...hierarchies, newHierarchy]);
  };

  const updateHierarchy = (id: string, updatedData: any) => {
    setHierarchies(hierarchies.map(h => h.id === id ? { ...h, ...updatedData } : h));
  };

  const deleteHierarchy = (id: string) => {
    setHierarchies(hierarchies.filter(h => h.id !== id));
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    const newHierarchy = {
      id: Date.now().toString(),
      name: data.name || "New Item",
      alias_name: data.alias_name || "Category",
      child: null,
      ...data
    };
    setHierarchies([...hierarchies, newHierarchy]);
  };

  const handleFormSectionsSave = (sections: FormSection[]) => {
    setFormSections(sections);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dynamic Hierarchical Data Manager
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Create custom hierarchical forms and manage complex nested data structures for any industry
          </p>
        </div>

        <Tabs defaultValue="data" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Management
            </TabsTrigger>
            <TabsTrigger value="form" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Entries
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Form Builder
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Hierarchical Data</h2>
              <Button 
                onClick={addNewHierarchy}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Hierarchy
              </Button>
            </div>

            <div className="grid gap-6">
              {hierarchies.map((hierarchy) => (
                <Card key={hierarchy.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="text-xl font-semibold">
                      {hierarchy.name} ({hierarchy.alias_name})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <HierarchicalManager
                      data={hierarchy}
                      onUpdate={(updatedData) => updateHierarchy(hierarchy.id, updatedData)}
                      onDelete={() => deleteHierarchy(hierarchy.id)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {hierarchies.length === 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="text-gray-500 text-lg">
                    No hierarchical data yet. Create entries using the form or click "Add New Hierarchy"!
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="form">
            <DynamicForm
              fields={getFlatFields(formSections)}
              onSubmit={handleFormSubmit}
              title="Create New Hierarchical Entry"
            />
          </TabsContent>

          <TabsContent value="builder">
            <HierarchicalFormBuilder
              onSave={handleFormSectionsSave}
              initialSections={formSections}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
