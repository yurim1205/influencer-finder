'use client';

import { useEffect, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import {supabase} from '@/lib/supabase';
import { useAuthStore } from '@/app/stores/useAuthStore';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
}

export default function Modal({ isOpen, onClose, onSaved }: ModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        subscribers: '',
        avgViews: '',
        gender: 'M',
        intro: '',
        contactPoint: '',
        contactNote: '',
        contactStatus: '미컨택',
    });

    const user = useAuthStore((state)=> state.user);
    const [isSaving, setIsSaving] = useState(false);

     const inputClass =
      'h-[42px] rounded-full border border-[#c6c1c1] bg-[#f5f3f6] px-5 text-[16px] text-black outline-none focus:border-[#4B5563] transition-all';
     const labelClass = 'text-[16px] font-medium text-[#717070]';

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    
    const handleSave = async()=> {
        if (!user) return;

        if (!formData.name) {
            alert('이름은 필수 입력값입니다.');
            return;
        }

        setIsSaving(true);

        const {error} = await supabase.from('my_influencers').insert({
            user_id: user.id,
            name: formData.name,
            gender: formData.gender,
            subscribers: Number(formData.subscribers) || 0,
            avg_views: Number(formData.avgViews) || 0,
            description: formData.intro,
            contact_point: formData.contactPoint,
            contact_note: formData.contactNote,
            contact_status: formData.contactStatus,
            note: '',
        });

        setIsSaving(false);

        if (error) {
            console.error('저장 오류:', error);
            alert('저장에 실패했습니다.');
            return;
        }

        onSaved(); // 부모(page.tsx)한테 인플루언서 목록 새로고침 시켜달라고 요청
        onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(e) => e.stopPropagation()}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="relative flex max-h-[90vh] w-full max-w-[548px] flex-col overflow-hidden rounded-[32px] 
                bg-[#fdfaff] sm:rounded-[62px] shadow-[0px_20px_26px_16px_rgba(54,53,53,0.2)]"
            >

            {/* 헤더 — 스크롤 밖, 고정 */}
                <div className="flex items-center justify-between px-8 pt-8">
                    <p id="modal-title" className="text-[21px] font-medium text-black">
                        항목 추가
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="닫기"
                        className="flex h-6 w-6 items-center justify-center text-black hover:cursor-pointer"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                 {/* 본문 — 여기부터 스크롤 */}
                <div className="flex flex-col gap-6 overflow-y-auto px-8 py-6">
                     <div className="flex flex-col gap-2">
                        <label htmlFor="name" className={labelClass}>
                            이름 <span className="text-[#ff5f5f]">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-6 sm:flex-row">
                        <div className="flex flex-1 flex-col gap-2">
                            <label htmlFor="subscribers" className={labelClass}>
                                구독자수
                            </label>
                            <input
                                id="subscribers"
                                type="text"
                                value={formData.subscribers}
                                onChange={(e) => setFormData({ ...formData, subscribers: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <label htmlFor="avgViews" className={labelClass}>
                                평균 조회수
                            </label>
                            <input
                                id="avgViews"
                                type="text"
                                value={formData.avgViews}
                                onChange={(e) => setFormData({ ...formData, avgViews: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className={labelClass}>성별</span>
                            <div className="inline-flex h-[42px] w-[220px] items-center rounded-full border border-[#c6c1c1] bg-[#f5f3f6] p-1 hover:cursor-pointer">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: 'F' })}
                                    className={`flex h-full flex-1 items-center justify-center rounded-full text-[16px] transition-colors hover:cursor-pointer ${
                                        formData.gender === 'F'
                                            ? 'bg-white text-black shadow-sm'
                                            : 'text-[#717070]'
                                    }`}
                                >
                                    여
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: 'M' })}
                                    className={`flex h-full flex-1 items-center justify-center rounded-full text-[16px] transition-colors hover:cursor-pointer ${
                                        formData.gender === 'M'
                                            ? 'bg-white text-black shadow-sm'
                                            : 'text-[#717070]'
                                    }`}
                                >
                                    남
                                </button>
                            </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="contactPoint" className={labelClass}>
                            컨택 포인트
                        </label>
                        <input
                            id="contactPoint"
                            type="text"
                            placeholder="예: example@gmail.com, 인스타 DM 등"
                            value={formData.contactPoint}
                            onChange={(e) => setFormData({ ...formData, contactPoint: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div className="h-px w-full bg-[#c6c1c1]" />

                    <div className="flex flex-col gap-6 sm:flex-row">
                        <div className="flex flex-1 flex-col gap-2">
                            <label htmlFor="contactStatus" className={labelClass}>
                                컨택 이력
                            </label>

                            <div className="relative">
                                <select
                                    id="contactStatus"
                                    value={formData.contactStatus}
                                    onChange={(e) => setFormData({ ...formData, contactStatus: e.target.value })}
                                    className={`${inputClass} appearance-none w-full pr-10`}
                                >
                                    <option value="미컨택">미컨택</option>
                                    <option value="컨택">컨택</option>
                                    <option value="지원">지원</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 
                                -translate-y-1/2 text-[#717070]" />
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col gap-2">
                            <label htmlFor="lastContactDate" className={labelClass}>
                                과거 컨택 시기
                            </label>
                            <input
                                id="lastContactDate"
                                type="text"
                                value={formData.contactNote}
                                onChange={(e) => setFormData({ ...formData, contactNote: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="intro" className={labelClass}>
                            소개 및 대표 콘텐츠
                        </label>
                        <textarea
                            id="intro"
                            value={formData.intro}
                            onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                            className="min-h-[100px] resize-y rounded-[20px] border border-[#c6c1c1] bg-[#f5f3f6] px-5 py-3 text-[16px]
                             text-black outline-none focus:border-[#4B5563] transition-all [field-sizing:content]"
                            placeholder='소개 및 대표 콘텐츠를 입력해주세요'
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-4 mb-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-[53px] w-[118px] items-center justify-center rounded-full bg-[#e8dcea] text-[21px] 
                        font-medium text-[#717070] hover:cursor-pointer shadow-[0px_4px_10px_0px_#eaeaea]"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex h-[53px] w-[118px] items-center justify-center rounded-full bg-[#6a4f6a] text-[21px] 
                        font-medium text-white hover:cursor-pointer shadow-[0px_4px_10px_0px_#eaeaea]"
                    >
                        {isSaving ? '저장 중...' : '저장'}
                    </button>
                </div>
            </div>
        </div>
    );
}