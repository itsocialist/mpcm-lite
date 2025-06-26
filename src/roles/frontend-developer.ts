import { RoleExecution, WorkflowContext } from '../types';

export class FrontendDeveloperRole implements RoleExecution {
  async execute(input: any, _context: WorkflowContext): Promise<string> {
    const requirements = input.requirements || input;
    
    // For POC: Return mock React code
    // In real version: Call LLM with requirements
    
    return `
// TodoApp.tsx
import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputText,
        completed: false
      }]);
      setInputText('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      {/* Implementation based on: ${requirements.substring(0, 50)}... */}
    </div>
  );
}
    `.trim();
  }
}
