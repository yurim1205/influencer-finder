'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 부모 함수에 검색 키워드 전달
  const handleSearch = () => {
    onSearch(searchQuery); // searchQuery: 사용자가 입력한 검색 키워드임
  };;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="rounded-2xl relative w-full flex items-center h-12">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="뷰티, 브이로그, 음악 등 키워드를 입력하세요"
        className="
          w-full pl-12 pr-24 py-3 h-18
          bg-white backdrop-blur-lg
          border border-white/20
          rounded-4xl
          text-gray-800
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
          absolute right-4
          w-10 h-10
          bg-purple-600
          rounded-2xl
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