import React from 'react';
import { BookOpenCheck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary-color border-b border-gray-800 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-2 rounded-lg mr-2 shadow-lg">
              <BookOpenCheck size={20} className="text-white" />
            </div>
            <span className="text-xl font-semibold">Item Marketplace</span>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a className="text-gray-300 hover:text-white transition-colors" href="#">Home</a>
            <a className="text-gray-300 hover:text-white transition-colors" href="#">AI Agents</a>
            <a className="text-gray-300 hover:text-white transition-colors" href="#">MCP Servers</a>
            <a className="text-white border-b-2 border-purple-500 pb-1" href="#">Knowledge Base</a>
            <a className="text-gray-300 hover:text-white transition-colors" href="#">APPs</a>
            <a className="text-gray-300 hover:text-white transition-colors" href="#">API</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-200 hover:text-white px-4 py-2 rounded-md transition-colors">
            Sign In
          </button>
          
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;