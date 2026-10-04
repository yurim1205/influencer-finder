'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {useForm} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWatch } from 'react-hook-form';

const signupSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상 입력해주세요.'),
  passwordConfirm: z.string().min(1, '비밀번호를 확인해주세요'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, control } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const password = useWatch({ control, name: 'password' });
  const passwordConfirm = useWatch({ control, name: 'passwordConfirm' });
  const email = useWatch({ control, name: 'email' });

  const handleSignup = async (data: SignupFormData) => {

    // 이 형태로 디비에 사용자 테이블이 저장됨 (따로 유저 테이블 생성 필요 x)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name },
      },
    });
  
    if (error) {
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      return;
    }
  
    router.push('/signup/complete');
  };

  return (
    <div className="min-h-screen bg-page-gradient flex">
      
      {/* 왼쪽 영역 */}
      <div className="flex flex-col justify-between p-10 w-1/2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors w-fit"
        >
          <ChevronLeft className="w-8 h-8 text-gray-400"/>
        </button>

        {/* <p className="text-2xl font-bold text-gray-800">
          서비스 관련 문구
        </p> */}
      </div>

      {/* 오른쪽 폼 영역 */}
      <div className="flex items-center justify-center w-1/2 p-10">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 w-full max-w-lg shadow-sm border border-white/50">
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8 font-['Carlito']">
            Sign UP
          </h1>

          <div className="flex flex-col gap-5">
            <div>
              <label className="text-sm text-gray-800 mb-2 block">이름</label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="text-sm text-gray-800 mb-2 block">이메일</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <p className={`text-xs mt-1 ${
              !email 
                ? 'text-gray-400' 
                : errors.email 
                  ? 'text-red-400' 
                  : 'text-green-500'
            }`}>
              {errors.email ? errors.email.message : '올바른 이메일 형식을 입력해주세요'}
            </p>
            </div>

            <div>
              <label className="text-sm text-gray-800 mb-2 block">비밀번호</label>
              <input
                type="password"
                {...register('password')}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
             <p className={`text-xs mt-1 ${
                !password 
                  ? 'text-gray-400' 
                  : errors.password 
                    ? 'text-red-400' 
                    : 'text-green-500'
              }`}>
                6자 이상 입력해주세요
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-800 mb-2 block">비밀번호 확인</label>
              <input
                type="password"
                {...register('passwordConfirm')}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <p className={`text-xs mt-1 ${
                !passwordConfirm
                ? 'text-gray-400' 
                  : errors.passwordConfirm 
                    ? 'text-red-400' 
                    : 'text-green-500'
              }`}>
                {errors.passwordConfirm 
                  ? errors.passwordConfirm.message 
                  : '비밀번호를 한 번 더 입력해주세요'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit(handleSignup)}
            disabled={isSubmitting} // 회원가입 중복 요청 방지
            className="w-full mt-8 py-4 bg-[#B39CB5] text-white font-medium rounded-full
             hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg 
             disabled:opacity-50"
          >
            {isSubmitting?(
              <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>가입 중...</span>
              </>
            ):(
              '회원가입'
            )}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-[#B39CB5] hover:underline">
              로그인 하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}