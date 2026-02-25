const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface Channel {
  id: string;
  name: string;         // 채널명
  subscribers: number; // 구독자 수
  averageViews: number; // 평균 조회수
  description: string; // 채널에 대한 설명
  thumbnail: string; // 채널 썸네일
  matchVideo?: {
    title: string;
    thumbnail: string;
  }
}

// 채널 검색
export async function searchChannels(query: string) {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?` +
      `part=snippet&type=channel&q=${encodeURIComponent(query)}&` +
      `maxResults=10&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API 호출 실패');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('채널 검색 에러:', error);
    return [];
  }
}

// 채널 상세 정보 가져오기
export async function getChannelDetails(channelId: string) {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/channels?` +
      `part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API 호출 실패');
    }

    const data = await response.json();
    return data.items?.[0] || null;
  } catch (error) {
    console.error('채널 상세 정보 에러:', error);
    return null;
  }
}

// YouTube 데이터를 쓸 수 있는 타입으로 변환
export function convertToChannel(youtubeChannel: any): Channel {
  return {
    id: youtubeChannel.id.channelId || youtubeChannel.id,
    name: youtubeChannel.snippet.title,
    description: youtubeChannel.snippet.description,
    subscribers: parseInt(youtubeChannel.statistics?.subscriberCount || '0'),
    averageViews: parseInt(youtubeChannel.statistics?.viewCount || '0'),
    thumbnail: youtubeChannel.snippet.thumbnails.high.url,
  };
}

export async function searchChannelsByVideo(query: string) {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?` +
      `part=snippet&type=video&q=${encodeURIComponent(query)}&` +
      `maxResults=10&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API 호출 실패');
    }

    const data = await response.json();

  // 채널별로 첫 번째 매칭 영상 저장
    const channelMap = new Map<string, any>();
    
    data.items.forEach((item: any) => {
      const channelId = item.snippet.channelId;
      if (!channelMap.has(channelId)) {
        channelMap.set(channelId, {
          channelId,
          matchedVideo: {
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
          }
        });
      }
    });

    const channelPromises = Array.from(channelMap.values())
    .slice(0, 10)
    .map(async (item) => {
      const details = await getChannelDetails(item.channelId);
      if (details) {
        const channel = convertToChannel(details);
        // 매칭 영상 정보 추가
        channel.matchVideo = item.matchedVideo;
        return channel;
      }
      return null;
    });

  const channels = await Promise.all(channelPromises);
  return channels.filter(ch => ch !== null);
} catch (error) {
  console.error('영상 검색 에러:', error);
  return [];
}
}

export async function searchChannelsHybrid(query: string) {
  try {
    // 채널명 검색
    const channelResults = await searchChannels(query);

    // 영상 제목 검색
    const videoResults = await searchChannelsByVideo(query);

   const channelmap = new Map();

   videoResults.forEach((channel: any) => {
    channelmap.set(channel.id, channel);
   });

   channelResults.forEach((channel: any) => {
    if (!channelmap.has(channel.id)) {
      channelmap.set(channel.id, channel);
    }
   });

   return Array.from(channelmap.values()).slice(0, 10);
  } catch (error) {
    console.error('하이브리드 검색 에러:', error);
    return [];
  }
}
