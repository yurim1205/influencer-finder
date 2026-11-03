import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export async function DELETE() {
  // 1. 쿠키로 지금 로그인한 사용자가 누구인지 확인
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        // 리프레시 토큰 갱신 후 그 쿠키를 저장하는 함수지만, 
        // 지금은 탈퇴 api 파일이기 때문에 곧바로 계정을 삭제하므로 로그인 상태를 유지할 필요가 없어 비워둠 
        setAll() {
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser(); // 사용자 정보 확인 

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  // 2. README에 공개한 테스트 계정은 탈퇴 막기
  if (user.email === process.env.TEST_ACCOUNT_EMAIL) {
    return NextResponse.json({ error: '테스트 계정은 탈퇴할 수 없어요.' }, { status: 403 });
  }

  // 3. 관리자 권한(service_role)으로 계정 삭제
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error('회원탈퇴 오류:', error);
    return NextResponse.json({ error: '탈퇴 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}