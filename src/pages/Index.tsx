
import React, { useState } from 'react';
import { HierarchicalManager } from '@/components/HierarchicalManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dynamic Hierarchical Data Manager
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Manage complex nested data structures for any industry - Automotive, E-commerce, Services & More
          </p>
          
          <Button 
            onClick={addNewHierarchy}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
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
                No hierarchical data yet. Click "Add New Hierarchy" to get started!
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
