'use client';

import { useAuthStore } from "@/app/stores/useAuthStore";
import {useState, useRef, useEffect} from 'react';
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, User, LogOut } from 'lucide-react';

export default function Header() {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

     {/* 로그아웃 메뉴 연결 */}
    const handleLogout = async ()=> {
        await supabase.auth.signOut();
        setIsMenuOpen(false);
    };

    {/* 마이페이지 메뉴 연결 */}
    const handleMyPage = () => {
        setIsMenuOpen(false);
        router.push('/mypage');
    }

    useEffect(() => {
        if (!isMenuOpen) return;
    
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);
    
    if (loading) return null;

    return (
        <div className="absolute top-0 right-0 p-6 flex items-center gap-3 z-50">
            {user ? (
                <div className="group relative" ref={menuRef}>
                 <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="rounded-full transition-all hover:shadow-md hover:cursor-pointer"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6A4F6A] text-white
                    text-sm font-semibold">
                        {(user.user_metadata?.name ?? user.email ?? '?').charAt(0).toUpperCase()}
                    </div>
                </button>

                    {/* 툴팁 - 드롭다운 열려있지 않을 때만 보이게 */}
                    {!isMenuOpen && (
                        <div className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            사용자 메뉴 열기
                        </div>
                    )}

                    {/* 드롭다운 내용 */}
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-5 shadow-lg border border-gray-100 z-50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {user.user_metadata?.name ?? '사용자'}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {user.email}
                                    </p>
                            </div>

                            {/* X 버튼 추가 */}
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="닫기"
                                className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="my-4 h-px w-full bg-gray-200" />


                         {/* 마이페이지 메뉴 연결 */}
                            <button
                                onClick={handleMyPage}
                                className="flex w-full items-center gap-2 py-2 text-gray-700 hover:text-gray-900
                                hover:cursor-pointer"
                            >
                                <User className="h-5 w-5" />
                                my page
                            </button>


                        {/* 로그아웃 버튼 연결 (기존 로직 연결) */}
                        <button 
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 py-2 text-red-500 hover:text-red-600
                             hover:cursor-pointer"
                        >
                            <LogOut className="h-5 w-5" />
                                Log out
                        </button>
                    </div>
                    )}
                </div>
            ) : (
                <>
                    <Link href="/login" className="text-sm lg:text-lg font-medium text-[#3f3f3f] hover:text-black 
                    transition-colors">
                        로그인
                    </Link>
                    <span className="text-sm lg:text-lg text-[#3f3f3f]">|</span>
                    <Link href="/signup" className="text-sm lg:text-lg font-medium text-[#3f3f3f] hover:text-black 
                    transition-colors">
                        회원가입
                    </Link>
                </>
            )}
        </div>
    );
}