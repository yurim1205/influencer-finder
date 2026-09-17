'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import {useRouter} from 'next/navigation';
import {useAuthStore} from '@/app/stores/useAuthStore';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/myPageModal';
import {createPortal} from 'react-dom';

interface MyInfluencer {
  id: string;
  name: string;
  gender: 'M' | 'F';
  subscribers: number;
  avg_views: number;
  description: string;
  contact_point: string;
  contact_email: string;
  contact_note: string;     // 컨택 시기
  contact_status: '미컨택' | '컨택' | '지원'; // 컨택 이력
  note: string;
}

const TABS = ['전체', '미컨택', '컨택', '지원'] as const;
type TabType = (typeof TABS)[number];

const SORT_OPTIONS = [
  { value: 'subscribers', label: '구독자순' },
  { value: 'views', label: '조회수순' },
] as const;
type SortType = (typeof SORT_OPTIONS)[number]['value'];

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('전체');
  const [sortType, setSortType] = useState<SortType>('subscribers');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [influencers, setInfluencers] = useState<MyInfluencer[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

    const fetchInfluencers = async ()=> {
      if (!user) return;     // 사용자가 아니면 그냥 끝냄

      const {data, error} = await supabase
        .from('my_influencers')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('데이터 조회 오류', error);
      } else {
        setInfluencers(data|| []);
      }
      setDataLoading(false);
    };
    
    useEffect(()=> {
      if (user) {
        fetchInfluencers();
      }
  }, [user]);

  useEffect(() => {
    if (!isSortOpen || !sortButtonRef.current) return;

    const rect = sortButtonRef.current.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + 4, left: rect.left });
  }, [isSortOpen]);

  useEffect(()=> {
    if (!isSortOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        sortButtonRef.current &&
        !sortButtonRef.current.contains(e.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSortOpen]);

  const filteredData = useMemo(()=> {
    return influencers
      .filter((item) => activeTab === '전체' || item.contact_status === activeTab)
      .filter((item) => item.name.toLowerCase().includes(searchKeyword.toLowerCase()))
      .sort((a, b) => {
        if (sortType === 'subscribers') return b.subscribers - a.subscribers;
        return b.avg_views - a.avg_views;
      });
    }, [influencers, activeTab, searchKeyword, sortType]);

  const formatCount = (num: number) => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
    return num.toLocaleString();
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 px-6 py-10">
      <Header />
      <div className="max-w-6xl mx-auto">
      <Link href="/" className="text-xl font-bold text-gray-500">
          Influencer Finder
      </Link>

        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border
         border-gray-300 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-[#6A4F6A] text-white'
                    : 'text-gray-600 hover:bg-[#B39CB5]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* 정렬 드롭다운 */}
            <div className="relative z-0">
              <button
                ref={sortButtonRef}
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 flex items-center gap-2"
              >
                정렬: {SORT_OPTIONS.find((o) => o.value === sortType)?.label}
                <span>{isSortOpen ? '▲' : '▼'}</span>
              </button>

              {isSortOpen && createPortal(
                    <div
                        className="fixed z-[9999] bg-white rounded-xl shadow-lg border border-gray-200 w-32"
                        style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                    >
                              {SORT_OPTIONS.map((option) => (
                              <button
                                  key={option.value}
                                  onClick={() => {
                                      setSortType(option.value);
                                      setIsSortOpen(false);
                                  }}
                                  className="w-full px-4 py-3 text-left text-sm hover:bg-purple-50 first:rounded-t-xl last:rounded-b-xl"
                              >
                                  {option.label}
                              </button>
                          ))}
                      </div>,
                      document.body
                  )}
              </div>

            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="이름으로 검색해주세요"
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 
              focus:ring-purple-200 w-56"
            />
            
            {/******* 항목 추가 버튼 ********/}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#6A4F6A] text-white text-sm font-medium rounded-xl
            hover:-translate-y-1 hover:shadow-lg transition-all duration-300
            flex items-center gap-1 shadow-md shadow-gray-400/50">
              + 항목 추가
            </button>

          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-lg">저장한 인플루언서가 없습니다</p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
            <div className="hidden md:grid grid-cols-[1.5fr_0.7fr_1fr_1fr_1.5fr_1fr] gap-4 px-6 py-3 bg-gray-50 text-sm font-semibold text-gray-600 border-b border-gray-200">
              <span>이름</span>
              <span>성별</span>
              <span>구독자수</span>
              <span>평균조회수</span>
              <span>컨택 포인트</span>
              <span>컨택 이력</span>
            </div>

            {filteredData.map((item) => (
              <div key={item.id} className="border-b border-gray-100 last:border-b-0 px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_0.7fr_1fr_1fr_1.5fr_1fr] gap-2 md:gap-4 items-center">
                  <span className="font-semibold text-gray-800">{item.name}</span>

                  <span className="text-sm text-gray-500">
                    <span className="md:hidden">성별: </span>
                    {item.gender}
                  </span>

                  <span className="text-sm text-gray-500">
                    <span className="md:hidden">구독자수: </span>
                    {formatCount(item.subscribers)}
                  </span>

                  <span className="text-sm text-gray-500">
                    <span className="md:hidden">평균조회수: </span>
                    {formatCount(item.avg_views)}
                  </span>

                  <span className="text-sm text-gray-500 truncate">
                    <span className="md:hidden">컨택 포인트: </span>
                    {item.contact_email || '-'}
                  </span>

                  <span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        item.contact_status === '지원'
                          ? 'bg-blue-100 text-blue-700'
                          : item.contact_status === '컨택'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.contact_status}
                    </span>
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  <span className="font-medium text-gray-700">소개 및 대표 콘텐츠: </span>
                  {item.description || '등록된 소개가 없습니다'}
                </p>

                <p className="mt-1 text-sm text-gray-400 line-clamp-1">
                  <span className="font-medium text-gray-500">NOTE: </span>
                  {item.note || '작성된 메모 없음'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSaved={fetchInfluencers}
      />
    </div>
  );
}