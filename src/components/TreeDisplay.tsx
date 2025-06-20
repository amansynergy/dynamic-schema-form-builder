
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface TreeDisplayProps {
  data: any;
  onEdit: (node: any, path: string[]) => void;
  onAddChild: (node: any, path: string[]) => void;
  onDelete: (path: string[]) => void;
  path?: string[];
  level?: number;
}

export const TreeDisplay: React.FC<TreeDisplayProps> = ({
  data,
  onEdit,
  onAddChild,
  onDelete,
  path = [],
  level = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getIndentation = () => level * 20;
  
  const getBorderColor = () => {
    const colors = ['border-blue-200', 'border-green-200', 'border-purple-200', 'border-orange-200', 'border-pink-200'];
    return colors[level % colors.length];
  };

  const getBgColor = () => {
    const colors = ['bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-orange-50', 'bg-pink-50'];
    return colors[level % colors.length];
  };

  const getTextColor = () => {
    const colors = ['text-blue-700', 'text-green-700', 'text-purple-700', 'text-orange-700', 'text-pink-700'];
    return colors[level % colors.length];
  };

  return (
    <div style={{ marginLeft: getIndentation() }} className="space-y-3">
      <Card className={`border-2 ${getBorderColor()} ${getBgColor()} shadow-sm hover:shadow-md transition-shadow duration-200`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {data.child && data.child.value && data.child.value.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 h-6 w-6"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold ${getTextColor()}`}>{data.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {data.alias_name}
                  </Badge>
                </div>
                
                {data.child && (
                  <div className="text-sm text-gray-600">
                    Category: <span className="font-medium">{data.child.alias_name}</span>
                    {data.child.value && (
                      <span className="ml-2">
                        ({data.child.value.length} item{data.child.value.length !== 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(data, path)}
                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddChild(data, path)}
                className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
              >
                <Plus className="h-4 w-4" />
              </Button>
              {level > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(path)}
                  className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isExpanded && data.child && data.child.value && data.child.value.map((item: any, index: number) => (
        <TreeDisplay
          key={index}
          data={item}
          onEdit={onEdit}
          onAddChild={onAddChild}
          onDelete={onDelete}
          path={[...path, 'child', 'value', index.toString()]}
          level={level + 1}
        />
      ))}
    </div>
  );
};
