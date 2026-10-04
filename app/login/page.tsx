'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useForm } from 'react-hook-form';
import { email, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
    email: z.string().email('올바른 이메일 주소를 입력해주세요'),
    password: z.string().min(1,'비밀번호를 입력해주세요'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [authError, setAuthError] = useState('');

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    }= useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });
    
    const handleLogin = async (data: LoginFormData) => {
       setAuthError('');

        const {error} = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            setAuthError('이메일 또는 비밀번호가 올바르지 않습니다.');
            return;
        }

        router.push('/'); // 로그인 성공 후 이동할 페이지
    };
    
    return (
        <div className="min-h-screen bg-page-gradient flex items-center justify-center px-6">
         
        <button
            onClick={() => router.back()}
            className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
            <ChevronLeft className="w-8 h-8 text-gray-400"/>
        </button>

        <div className="bg-white/30 backdrop-blur-md rounded-3xl p-12 w-full h-[600px] max-w-lg shadow-sm border border-white/50">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 font-['Carlito']">
                    Log in
                </h1>
            <div className="mb-8" /> 


        <form onSubmit={handleSubmit(handleLogin)}>
            <div className="flex flex-col gap-6">
                <div>
                    <label className="text-sm text-gray-800 mt-6 mb-2 block">이메일</label>
                    <input
                        type="email"
                        {...register('email')}
                        className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                     {errors.email && (
                        <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm text-gray-800 mb-2 block">비밀번호</label>
                    <input
                        type="password"
                        {...register('password')}
                        className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                    {errors.password && (
                        <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                    )}
                </div>
            </div>

            {authError && (
            <p className="text-red-400 text-sm text-center mt-4">{authError}</p>
          )}

            <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-20 py-4 bg-[#B39CB5] text-white font-medium rounded-full shadow-lg
                    hover:scale-110 transition-transform
                    duration-300 cursor-pointer"
                    >
                {isSubmitting?'로딩 중':'로그인'}
            </button>
        </form>

            <p className="text-center text-sm text-gray-400 mt-4">
                계정이 없으신가요?{' '}
                <Link href="/signup" className="text-[#B39CB5] hover:underline">
                    회원가입 하기
                </Link>
            </p>
         </div>
        </div>
    );
}