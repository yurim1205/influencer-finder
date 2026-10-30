'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, X  } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {useForm, useWatch} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/Input';

const PASSWORD_RULES = [
  { label: '영문 소문자', test: (v: string) => /[a-z]/.test(v) },
  { label: '숫자', test: (v: string) => /\d/.test(v) },
  { label: '특수문자', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
  { label: '6자 이상', test: (v: string) => v.length >= 6 },
];

const signupSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요.'),
 
  password: z
    .string()
    .refine((v) => PASSWORD_RULES.every((rule) => rule.test(v)), {
      message: '비밀번호 조건을 모두 충족해주세요.',
    }),
  passwordConfirm: z.string().min(1, '비밀번호를 확인해주세요'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

type SignupFormData = z.infer<typeof signupSchema>;

// status: 'idle'(입력 전, 회색) | 'pass'(통과, 초록) | 'fail'(미통과, 빨강)
function RuleChip({ label, status }: { label: string; status: 'idle' | 'pass' | 'fail' }) {
  const style = {
    idle: 'bg-gray-100 text-gray-500',
    pass: 'bg-green-50 text-green-700',
    fail: 'bg-red-50 text-red-500',
  }[status]; // 상태값으로 꺼내쓰기
 
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${style}`}>
      {status === 'pass' && <Check className="w-3.5 h-3.5" />}
      {status === 'fail' && <X className="w-3.5 h-3.5" />}
      {label}
    </span>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, control } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const password = useWatch({ control, name: 'password' }) ?? '';
  const passwordConfirm = useWatch({ control, name: 'passwordConfirm' }) ?? '';
  const email = useWatch({ control, name: 'email' });

  // 규칙 하나라도 못 지키면 빨간 상태
  const isPasswordInvalid = password.length > 0 && !PASSWORD_RULES.every((rule) => rule.test(password));
  const isConfirmMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

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
    <div className="min-h-screen bg-page-gradient relative flex items-center justify-center p-6 sm:p-10">
        <button
            onClick={() => router.back()}
            aria-label="뒤로가기"
            className="absolute top-6 left-6 sm:top-10 sm:left-10 text-gray-400 hover:text-gray-600 transition-colors"
          >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 w-full max-w-lg shadow-sm border border-white/50">
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8 font-['Carlito']">
            Sign UP
          </h1>

          <div className="flex flex-col gap-5"> 
            <Input label="이름" {...register('name')} />
    
            <Input label="이메일" type="email" invalid={!!email && !!errors.email} {...register('email')}>
              <p className={`text-xs mt-1 ${
                !email ? 'text-gray-400' : errors.email ? 'text-red-400' : 'text-green-500'
              }`}>
                {errors.email ? errors.email.message : '올바른 이메일 형식을 입력해주세요'}
              </p>
            </Input>

            <Input label="비밀번호" type="password" invalid={isPasswordInvalid} {...register('password')}>
              <div className="flex flex-wrap gap-1.5 mt-2" aria-live="polite">
                {PASSWORD_RULES.map((rule) => (
                  <RuleChip
                    key={rule.label}
                    label={rule.label}
                    status={!password ? 'idle' : rule.test(password) ? 'pass' : 'fail'}
                  />
                ))}
              </div>
            </Input>

            <Input label="비밀번호 확인" type="password" invalid={isConfirmMismatch} {...register('passwordConfirm')}>
              <div className="mt-2" aria-live="polite">
                {passwordConfirm && (
                  <RuleChip
                    label={isConfirmMismatch ? '비밀번호 불일치' : '비밀번호 일치'}
                    status={isConfirmMismatch ? 'fail' : 'pass'}
                  />
                )}
              </div>
            </Input>
          </div>

          <button
            onClick={handleSubmit(handleSignup)}
            disabled={isSubmitting} // 회원가입 중복 요청 방지
            className="w-full mt-8 py-4 bg-[#6A4F6A] text-white font-medium rounded-full
              flex items-center justify-center gap-2
              hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg
              disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>가입 중...</span>
              </>
            ) : (
              '회원가입'
            )}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-[#6A4F6A] hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
  );
}