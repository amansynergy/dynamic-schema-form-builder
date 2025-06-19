
export interface HierarchyNode {
  id?: string;
  name: string;
  alias_name: string;
  description?: string;
  metadata?: Record<string, any>;
  child?: {
    alias_name: string;
    value: HierarchyNode[];
  };
}

export const createNewNode = (name: string = "", alias_name: string = ""): HierarchyNode => ({
  name,
  alias_name,
  child: null
});

export const addChildToNode = (
  parentNode: HierarchyNode, 
  childNode: HierarchyNode, 
  childCategoryName: string = "Sub Category"
): HierarchyNode => {
  const updatedParent = { ...parentNode };
  
  if (!updatedParent.child) {
    updatedParent.child = {
      alias_name: childCategoryName,
      value: []
    };
  }
  
  updatedParent.child.value.push(childNode);
  return updatedParent;
};

export const removeNodeAtPath = (rootNode: HierarchyNode, path: (string | number)[]): HierarchyNode => {
  if (path.length === 0) return rootNode;
  
  const updatedRoot = { ...rootNode };
  let current: any = updatedRoot;
  
  // Navigate to parent
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (key === 'child') {
      current = current.child;
    } else if (key === 'value') {
      current = current.value;
    } else if (typeof key === 'number') {
      current = current[key];
    }
  }
  
  const lastKey = path[path.length - 1];
  if (typeof lastKey === 'number' && Array.isArray(current)) {
    current.splice(lastKey, 1);
  }
  
  return updatedRoot;
};

export const updateNodeAtPath = (
  rootNode: HierarchyNode, 
  path: (string | number)[], 
  updates: Partial<HierarchyNode>
): HierarchyNode => {
  if (path.length === 0) {
    return { ...rootNode, ...updates };
  }
  
  const updatedRoot = { ...rootNode };
  let current: any = updatedRoot;
  
  // Navigate to target node
  for (const key of path) {
    if (key === 'child') {
      current = current.child;
    } else if (key === 'value') {
      current = current.value;
    } else if (typeof key === 'number') {
      current = current[key];
    }
  }
  
  Object.assign(current, updates);
  return updatedRoot;
};

export const exportToJSON = (hierarchies: HierarchyNode[]): string => {
  return JSON.stringify(hierarchies, null, 2);
};

export const importFromJSON = (jsonString: string): HierarchyNode[] => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

export const validateHierarchy = (node: HierarchyNode): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!node.name?.trim()) {
    errors.push('Name is required');
  }
  
  if (!node.alias_name?.trim()) {
    errors.push('Alias name is required');
  }
  
  if (node.child && node.child.value) {
    node.child.value.forEach((child, index) => {
      const childValidation = validateHierarchy(child);
      if (!childValidation.isValid) {
        errors.push(`Child ${index + 1}: ${childValidation.errors.join(', ')}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getNodeCount = (node: HierarchyNode): number => {
  let count = 1;
  
  if (node.child && node.child.value) {
    count += node.child.value.reduce((acc, child) => acc + getNodeCount(child), 0);
  }
  
  return count;
};

export const searchNodes = (
  rootNode: HierarchyNode, 
  searchTerm: string
): HierarchyNode[] => {
  const results: HierarchyNode[] = [];
  const term = searchTerm.toLowerCase();
  
  const search = (node: HierarchyNode) => {
    if (
      node.name.toLowerCase().includes(term) ||
      node.alias_name.toLowerCase().includes(term) ||
      node.description?.toLowerCase().includes(term)
    ) {
      results.push(node);
    }
    
    if (node.child && node.child.value) {
      node.child.value.forEach(search);
    }
  };
  
  search(rootNode);
  return results;
};
