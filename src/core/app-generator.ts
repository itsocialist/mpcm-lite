import { promises as fs } from 'fs';
import path from 'path';
import { AppOutput, GeneratedFile } from '../types';
import { nextConfigs } from '../templates/configs';

export class AppGenerator {
  async generateApp(output: AppOutput): Promise<string> {
    const timestamp = Date.now();
    const appName = `todo-app-${timestamp}`;
    const outputPath = path.join(process.cwd(), 'output', appName);
    
    // Create directory structure
    await this.createDirectoryStructure(outputPath);
    
    // Generate files
    const files = this.generateFiles(output);
    
    // Write all files
    for (const file of files) {
      const filePath = path.join(outputPath, file.path);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, file.content);
    }
    
    return outputPath;
  }
  
  private async createDirectoryStructure(basePath: string) {
    const dirs = [
      'src/app',
      'src/components', 
      'src/app/api/todos',
      'public'
    ];
    
    for (const dir of dirs) {
      await fs.mkdir(path.join(basePath, dir), { recursive: true });
    }
  }

  private generateFiles(output: AppOutput): GeneratedFile[] {
    const files: GeneratedFile[] = [];
    
    // package.json
    files.push({
      path: 'package.json',
      content: this.generatePackageJson(!!output.payment_code)
    });
    
    // Next.js app
    files.push({
      path: 'src/app/page.tsx',
      content: this.generateMainPage(!!output.payment_code)
    });
    
    // Layout
    files.push({
      path: 'src/app/layout.tsx',
      content: this.generateLayout()
    });
    
    // Global styles
    files.push({
      path: 'src/app/globals.css',
      content: this.generateGlobalStyles()
    });
    
    // Todo component
    files.push({
      path: 'src/components/TodoApp.tsx',
      content: this.generateTodoComponent()
    });
    
    // API route
    files.push({
      path: 'src/app/api/todos/route.ts',
      content: this.generateApiRoute()
    });
    
    // If payment code exists, add Stripe files
    if (output.payment_code) {
      files.push({
        path: 'src/app/api/create-checkout-session/route.ts',
        content: this.generateStripeApi()
      });
      
      files.push({
        path: 'src/components/CheckoutButton.tsx',
        content: this.generateCheckoutButton()
      });
      
      files.push({
        path: '.env.local.example',
        content: this.generateEnvExample()
      });
    }
    
    // Config files
    files.push({
      path: 'tailwind.config.js',
      content: nextConfigs.tailwindConfig
    });
    
    files.push({
      path: 'postcss.config.js',
      content: nextConfigs.postcssConfig
    });
    
    files.push({
      path: 'next.config.js',
      content: nextConfigs.nextConfig
    });
    
    files.push({
      path: 'tsconfig.json',
      content: nextConfigs.tsConfig
    });
    
    // README
    files.push({
      path: 'README.md',
      content: this.generateReadme(!!output.payment_code)
    });
    
    return files;
  }

  private generatePackageJson(hasStripe: boolean): string {
    const deps: Record<string, string> = {
      "next": "14.1.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "typescript": "^5.3.3",
      "@types/node": "^20.11.0",
      "@types/react": "^18.2.48",
      "@types/react-dom": "^18.2.18",
      "tailwindcss": "^3.4.1",
      "autoprefixer": "^10.4.17",
      "postcss": "^8.4.33"
    };
    
    if (hasStripe) {
      deps["stripe"] = "^14.14.0";
      deps["@stripe/stripe-js"] = "^2.4.0";
    }
    
    return JSON.stringify({
      name: "todo-app",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint"
      },
      dependencies: deps
    }, null, 2);
  }

  private generateMainPage(hasStripe: boolean): string {
    const imports = hasStripe ? `import TodoApp from '@/components/TodoApp';
import CheckoutButton from '@/components/CheckoutButton';` : `import TodoApp from '@/components/TodoApp';`;
    
    const stripeButton = hasStripe ? '\n      <CheckoutButton />' : '';
    
    return `${imports}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <TodoApp />${stripeButton}
    </main>
  );
}`;
  }

  private generateLayout(): string {
    return `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App - Built by MPCM-Pro',
  description: 'A modern todo application built by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}`;
  }

  private generateGlobalStyles(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;`;
  }

  private generateTodoComponent(): string {
    return `'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!inputText.trim()) return;
    
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, completed: false })
      });
      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setInputText('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Todos</h1>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {todos.map(todo => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-5 h-5 text-blue-500"
            />
            <span className={\`flex-1 \${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}\`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      
      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No todos yet. Add one above!</p>
      )}
    </div>
  );
}`;
  }

  private generateApiRoute(): string {
    return `import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo
let todos: any[] = [];

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newTodo = {
    id: Date.now(),
    ...body
  };
  todos.push(newTodo);
  return NextResponse.json(newTodo, { status: 201 });
}`;
  }

  private generateStripeApi(): string {
    return `import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Todo Pro Subscription',
            description: 'Unlock premium features for your todo app',
          },
          unit_amount: 999,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: \`\${request.headers.get('origin')}/success\`,
      cancel_url: \`\${request.headers.get('origin')}/\`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}`;
  }

  private generateCheckoutButton(): string {
    return `'use client';

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutButton() {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
    });
    
    const { sessionId } = await response.json();
    
    const result = await stripe?.redirectToCheckout({
      sessionId,
    });
    
    if (result?.error) {
      console.error(result.error.message);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="fixed bottom-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
    >
      Upgrade to Pro - $9.99/mo
    </button>
  );
}`;
  }

  private generateEnvExample(): string {
    return `# Stripe API keys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY`;
  }

  private generateReadme(hasStripe: boolean): string {
    return `# Todo App - Built by MPCM-Pro

This application was generated by the MPCM-Pro AI development team.

## Features

- ✅ Create, complete, and delete todos
- 💾 In-memory storage (easily replaceable with a database)
- 🎨 Modern UI with Tailwind CSS
- 📱 Fully responsive design
${hasStripe ? '- 💳 Stripe payment integration for Pro features' : ''}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. ${hasStripe ? 'Set up environment variables:\n   - Copy \`.env.local.example\` to \`.env.local\`\n   - Add your Stripe API keys\n\n3. ' : ''}Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

${hasStripe ? '4. ' : '3. '}Open [http://localhost:3000](http://localhost:3000)

## Built By

This app was built by the MPCM-Pro AI team:
- **Product Manager**: Defined requirements and features
- **Frontend Developer**: Built the React UI components
- **Backend Developer**: Created the API routes
${hasStripe ? '- **Stripe Expert**: Integrated payment processing' : ''}

## Next Steps

- Add a database (PostgreSQL, MongoDB, etc.)
- Implement user authentication
- Add more features like categories, due dates, etc.
${hasStripe ? '- Configure Stripe webhooks for subscription management' : '- Add payment processing with the Stripe Expert role'}

---

Generated with ❤️ by MPCM-Pro
`;
  }
}
