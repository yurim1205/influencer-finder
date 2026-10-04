'use client';

import Link from 'next/link';

export default function SignupCompletePage() {
  return (
    <div className="min-h-screen bg-page-gradient flex items-center justify-center px-6">
      <div className="bg-white/30 backdrop-blur-md rounded-3xl p-12 w-full max-w-lg shadow-sm border border-white/50 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 font-['Carlito']">
          Welcome!
        </h1>
        <p className="text-gray-600 mb-8">
          회원가입이 완료됐습니다.
        </p>
        <Link
          href="/login"
          className="w-full block py-4 bg-[#B39CB5] text-white font-medium rounded-full hover:scale-110 transition-transform duration-300 shadow-lg"
        >
          로그인 하기
        </Link>
      </div>
    </div>
  );
}