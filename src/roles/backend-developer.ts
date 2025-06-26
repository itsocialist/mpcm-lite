import { RoleExecution, WorkflowContext } from '../types';

export class BackendDeveloperRole implements RoleExecution {
  async execute(_input: any, _context: WorkflowContext): Promise<string> {
    return `
// api/todos.ts
import { NextApiRequest, NextApiResponse } from 'next';

let todos: Todo[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json(todos);
    case 'POST':
      const newTodo = { ...req.body, id: Date.now() };
      todos.push(newTodo);
      return res.status(201).json(newTodo);
    default:
      return res.status(405).end();
  }
}
    `.trim();
  }
}
