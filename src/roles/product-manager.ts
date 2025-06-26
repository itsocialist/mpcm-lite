import { RoleExecution, WorkflowContext } from '../types';

export class ProductManagerRole implements RoleExecution {
  async execute(input: string, _context: WorkflowContext): Promise<string> {
    // For POC: Return mock requirements containing "todo"
    // In real version: Call LLM
    
    return `
# Todo Application Requirements

## Overview
A modern todo application with the following features:

## Core Features
1. **Task Management**
   - Create new todos
   - Mark todos as complete
   - Delete todos
   - Edit todo text
   
2. **User Interface**
   - Clean, modern design
   - Responsive layout
   - Real-time updates
   
3. **Data Persistence**
   - Local storage for now
   - API ready for backend

## Technical Requirements
- React with TypeScript
- Tailwind CSS for styling
- Component-based architecture
- Mobile-friendly design

Input: ${input}
    `.trim();
  }
}
