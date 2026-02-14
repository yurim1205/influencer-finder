// components/SearchBar.tsx
'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery); 
  };;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-2xl relative w-full max-w-2xl flex items-center">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-black" />
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="뷰티, 브이로그, 음악 등 키워드를 입력하세요"
        className="
          w-full pl-12 pr-24 py-3
          bg-white/10 backdrop-blur-lg
          border border-white/20
          rounded-2xl
          text-black
          placeholder-gray-400 font-semibold
          focus:outline-none focus:ring-2 focus:ring-white/30
          shadow-lg shadow-black/10
          transition-all duration-300
        "
      />
      
      <button
        type="button"
        onClick={handleSearch}
        className="
          absolute right-2
          w-10 h-10
          bg-purple-600
          rounded-xl
          flex items-center justify-center
          hover:bg-purple-700
          active:bg-purple-800
          transition-all duration-200
          shadow-lg shadow-purple-500/30
        "
      >
        <Search className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}