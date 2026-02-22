export interface Channel {
  id: string;
  name: string;         // 채널명
  subscribers: number; // 구독자 수
  averageViews: number; // 평균 조회수
  description: string; // 채널에 대한 설명
  thumbnail: string; // 채널 썸네일
}

export const mockChannels: Channel[] = [
  {
    id: "1",
    name: "코딩하는 개발자",
    subscribers: 1250000,
    averageViews: 850000,
    description: "프로그래밍과 개발 팁을 공유하는 채널입니다.",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  },
  {
    id: "2",
    name: "요리하는 셰프",
    subscribers: 890000,
    averageViews: 620000,
    description: "맛있는 요리 레시피와 요리 팁을 알려드립니다.",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  },
  {
    id: "3",
    name: "여행 브이로그",
    subscribers: 2100000,
    averageViews: 1200000,
    description: "전 세계 여행지를 소개하는 브이로그 채널입니다.",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  },
  {
    id: "4",
    name: "피트니스 트레이너",
    subscribers: 650000,
    averageViews: 480000,
    description: "건강한 몸을 만드는 운동 루틴을 공유합니다.",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  },
  {
    id: "5",
    name: "게임 리뷰어",
    subscribers: 1800000,
    averageViews: 950000,
    description: "최신 게임 리뷰와 플레이 영상을 제공합니다.",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  },
  {
    id: "6",
    name: "뷰티 크리에이터",
    subscribers: 1450000,
    averageViews: 780000,
    description: "메이크업 튜토리얼과 뷰티 팁을 알려드립니다.",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  },
  {
    id: "7",
    name: "음악 채널",
    subscribers: 1000000,
    averageViews: 500000,
    description: "음악 채널입니다.",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  },
];

