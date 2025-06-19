
import React, { useState } from 'react';
import { TreeDisplay } from './TreeDisplay';
import { NodeEditor } from './NodeEditor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Plus, File } from 'lucide-react';

interface HierarchicalManagerProps {
  data: any;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}

export const HierarchicalManager: React.FC<HierarchicalManagerProps> = ({
  data,
  onUpdate,
  onDelete
}) => {
  const [editingNode, setEditingNode] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [parentPath, setParentPath] = useState<string[]>([]);

  const handleEditNode = (node: any, path: string[] = []) => {
    setEditingNode(node);
    setParentPath(path);
    setIsDialogOpen(true);
  };

  const handleAddChild = (parentNode: any, path: string[] = []) => {
    const newNode = {
      name: "",
      alias_name: "",
      child: null
    };
    setEditingNode(newNode);
    setParentPath([...path, 'child']);
    setIsDialogOpen(true);
  };

  const handleSaveNode = (updatedNode: any) => {
    let newData = { ...data };
    
    if (parentPath.length === 0) {
      // Editing root node
      newData = { ...newData, ...updatedNode };
    } else {
      // Navigate to the parent and update/add child
      let current = newData;
      for (let i = 0; i < parentPath.length - 1; i++) {
        if (parentPath[i] === 'child') {
          current = current.child;
        } else if (parentPath[i] === 'value') {
          current = current.value;
        } else if (typeof parentPath[i] === 'number') {
          current = current[parentPath[i]];
        }
      }

      const lastKey = parentPath[parentPath.length - 1];
      if (lastKey === 'child') {
        if (!current.child) {
          current.child = {
            alias_name: updatedNode.alias_name || "Sub Category",
            value: []
          };
        }
        if (!current.child.value) {
          current.child.value = [];
        }
        current.child.value.push(updatedNode);
      } else {
        // Update existing node
        Object.assign(current, updatedNode);
      }
    }

    onUpdate(newData);
    setIsDialogOpen(false);
    setEditingNode(null);
  };

  const handleDeleteNode = (path: string[]) => {
    if (path.length === 0) {
      onDelete();
      return;
    }

    let newData = { ...data };
    let current = newData;
    
    // Navigate to parent
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === 'child') {
        current = current.child;
      } else if (path[i] === 'value') {
        current = current.value;
      } else if (typeof path[i] === 'number') {
        current = current[path[i]];
      }
    }

    const lastKey = path[path.length - 1];
    if (typeof lastKey === 'number' && Array.isArray(current)) {
      current.splice(lastKey, 1);
    }

    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditNode(data)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Root
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddChild(data)}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Child
          </Button>
        </div>
      </div>

      <TreeDisplay
        data={data}
        onEdit={handleEditNode}
        onAddChild={handleAddChild}
        onDelete={handleDeleteNode}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              {editingNode?.name ? 'Edit Node' : 'Add New Node'}
            </DialogTitle>
          </DialogHeader>
          {editingNode && (
            <NodeEditor
              node={editingNode}
              onSave={handleSaveNode}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
