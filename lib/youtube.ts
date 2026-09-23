'use client';

import {decodeHtmlEntities} from '@/lib/utils';

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
    publishedAt: string;
  }
}

export interface SearchResult {
  channels: Channel[];
  nextChannelPageToken: string|null;
  nextVideoPageToken: string|null;
  totalResults: number;
}

export interface YoutubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    publishedAt: string;
    channelId: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
  viewCount: number;
}

export interface YoutubeChannelData {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: { url: string };
    };
  };
  statistics: {
    subscriberCount: string;
    viewCount: string;
  };
}

export interface YoutubeSearchItem {
  id: {
    channelId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: { url: string };
    };
  };
}


const channelDetailsCache = new Map<string, YoutubeChannelData>(); // 채널 id 단위 캐시 (같은 세션 내에서 중복 조회 방지)


// 채널 검색 함수
export async function searchChannels(query: string, pageToken: string|null = null) {
  try {
  const response = await fetch(
    `${YOUTUBE_API_BASE_URL}/search?` +
    `part=snippet&type=channel&q=${encodeURIComponent(query)}&` +
    `maxResults=12&key=${YOUTUBE_API_KEY}` +
    (pageToken ? `&pageToken=${pageToken}` : '')       // 페이지 토큰 사용
  );

  if (!response.ok) {
    throw new Error('api 호출 실패');
  }

  const data = await response.json();
  return { 
    items: data.items || [],
    nextPageToken: data.nextPageToken || null,
    totalResults: data.pageInfo?.totalResults || 0
  };
} catch (error) {
  console.error('채널명 검색 에러:', error);
  return {items: [], nextPageToken: null, totalResults: 0};
  }
}

// 채널 상세 정보 가져오기
export async function getChannelDetails(channelId: string): Promise<YoutubeChannelData | null> {

  // 캐시에 있으면 바로 반환
  if (channelDetailsCache.has(channelId)) {
    return channelDetailsCache.get(channelId) !;
  }

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/channels?` +
      `part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('api 호출 실패');
    }

    const data = await response.json();
    const channelData = data.items?.[0] || null;

    // 조회 성공하면 캐시에 저장
    if (channelData) {
      channelDetailsCache.set(channelId, channelData);
    }

    return channelData;
  } catch (error) {
    console.error('채널 상세 정보 에러:', error);
    return null;
  }
}

export async function getChannelsDetailsBatch(channelIds: string[]): Promise<YoutubeChannelData[]> {
  if (channelIds.length === 0) return [];

  const cached: YoutubeChannelData[] = [];
  const idsToFetch: string[] = [];

  channelIds.forEach((id)=> {
    const hit= channelDetailsCache.get(id);
    if (hit) {
      cached.push(hit);
    } else {
      idsToFetch.push(id);
    }
  })

  // 캐시에 데이터가 있어서 api 호출이 불필요하면 api 호출을 생략
  if (idsToFetch.length === 0) {
    return cached;
  }

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/channels?` +
      `part=snippet,statistics&id=${idsToFetch.join(',')}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API 호출 실패');
    }

    const data = await response.json();
    const fetched: YoutubeChannelData[] = data.items || [];

    // 새로 받아온 것들 캐시에 저장
    fetched.forEach((item) => {
      channelDetailsCache.set(item.id, item);
    })

    // 캐시에서 꺼낸 것 + 새로 받아온 것 합쳐서 반환
    return [...cached, ...fetched];
  } catch (error) {
    console.error('채널 상세 정보 배치 에러:', error);
    return cached; // 
  }
}

// YouTube 데이터를 쓸 수 있는 타입으로 변환
export function convertToChannel(youtubeChannel: YoutubeChannelData): Channel {
  const channelId = typeof youtubeChannel.id === 'string' 
    ? youtubeChannel.id 
    : (youtubeChannel.id as { channelId: string }).channelId || youtubeChannel.id;
    
  return {
    id: channelId,
    name: decodeHtmlEntities(youtubeChannel.snippet.title), 
    description: decodeHtmlEntities(youtubeChannel.snippet.description),
    subscribers: parseInt(youtubeChannel.statistics?.subscriberCount || '0'),
    averageViews: parseInt(youtubeChannel.statistics?.viewCount || '0'),
    thumbnail: youtubeChannel.snippet.thumbnails.high.url,
  };
}

// 이 함수에서도 pageToken을 넘길 수 있도록 수정
export async function searchChannelsByVideo(query: string, pageToken: string|null = null) {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?` +
      `part=snippet&type=video&q=${encodeURIComponent(query)}&` +
      `maxResults=12&key=${YOUTUBE_API_KEY}` +
      (pageToken ? `&pageToken=${pageToken}` : '')     // 여기서 토큰 사용
    );

    if (!response.ok) {
      throw new Error('YouTube API 호출 실패');
    }

    const data = await response.json();

  // 채널별로 첫 번째 매칭 영상 저장
    const channelMap = new Map<string, { 
      channelId: string; 
      matchedVideo: { 
        title: string; 
        thumbnail: string; 
        publishedAt: string 
      } 
    }>();
    
    data.items.forEach((item: YoutubeVideo) => {
      const channelId = item.snippet.channelId;
      if (!channelMap.has(channelId)) {
        channelMap.set(channelId, {
          channelId,
          matchedVideo: {
            title: decodeHtmlEntities(item.snippet.title),
            thumbnail: item.snippet.thumbnails.medium.url,
            publishedAt: item.snippet.publishedAt,
          }
        });
      }
    });

    const matchedEntries = Array.from(channelMap.values());

    const channelIds = matchedEntries.map((item) => item.channelId);
    const detailsList = await getChannelsDetailsBatch(channelIds);

    const detailsById = new Map(detailsList.map((d) => [d.id, d]));

    const channels = matchedEntries
    .map((item) => {
      const details = detailsById.get(item.channelId);
      if (!details) return null;
      const channel = convertToChannel(details);
      channel.matchVideo = item.matchedVideo;
      return channel;
    })
    .filter((ch): ch is Channel => ch !== null);

    return {
      channels,
      nextPageToken: data.nextPageToken || null,
      totalResults: data.pageInfo?.totalResults || 0,
    };
  } catch (error) {
    console.error('영상 검색 에러:', error);
    return {
      channels: [],
      nextPageToken: null,
      totalResults: 0
    };
  }
 }   

export async function searchChannelsHybrid(
  query: string,
  channelPageToken: string|null = null,
  videoPageToken: string|null = null,
): Promise<SearchResult> {
  try {
  const [
    { items: channelSearchResults, nextPageToken: nextChannelPageToken, totalResults } ,
    { channels: videoResults, nextPageToken: nextVideoPageToken} ,
  ] = await Promise.all([
      searchChannels(query, channelPageToken),
      searchChannelsByVideo(query, videoPageToken),
    ]);

    const channelmap = new Map<string, Channel>();
    videoResults.forEach((channel: Channel)=>{
      channelmap.set(channel.id, channel);
    })


   // 검색 결과에 이미 있는 채널은 제외하고, 새로 조회할 채널 id만 추림
   const newChannelIds = channelSearchResults
     .map((item: YoutubeSearchItem) => item.id.channelId)
     .filter((id: string) => typeof id === 'string' && !channelmap.has(id));

   const newDetailsList = await getChannelsDetailsBatch(newChannelIds);
   const channelResults = newDetailsList.map((details) => convertToChannel(details));

   channelResults.forEach((channel: Channel) => {
     if (channel && !channelmap.has(channel.id)) {
       channelmap.set(channel.id, channel);
     }
   });

    return {
      channels: Array.from(channelmap.values()),
      nextChannelPageToken,
      nextVideoPageToken,
      totalResults,
    };
  } catch (error) {
    console.error('하이브리드 검색 에러:', error);
    return { channels: [], nextChannelPageToken: null, nextVideoPageToken: null, totalResults: 0 };
  }
}

// 채널 최신 영상 가져오는 함수
export async function getChannelLatestVideos(channelId: string, maxResults: number = 6) {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?` +
      `part=snippet&channelId=${channelId}&type=video&order=date&` +
      `maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) throw new Error('YouTube API 호출 실패');

    const data = await response.json();
    const items = data.items || [];

      // 영상 id 목록 추출
      const videoIds = items.map((item: YoutubeVideo) => item.id.videoId).join(',');

      if (!videoIds) return [];
  
      // 조회수 가져오기
      const statsResponse = await fetch(
        `${YOUTUBE_API_BASE_URL}/videos?` +
        `part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );
  
      const statsData = await statsResponse.json();
    // 조회수를 원본 아이템에 합치기
    return items.map((item: YoutubeVideo) => {
      const stats = statsData.items?.find((s: { id: string; statistics: { viewCount: string } }) => s.id === item.id.videoId);
      return {
        ...item,
        viewCount: parseInt(stats?.statistics?.viewCount || '0'),
      };
    });
  } catch (error) {
    console.error('최신 영상 가져오기 에러:', error);
    return [];
  }
}