'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { YoutubeVideo } from '@/lib/youtube';
import { formatCount } from '@/lib/utils';

interface ViewsChartProps {
  videos: YoutubeVideo[];
  avgViews: number;
}

interface ChartData {
  date: string;
  views: number;
  title: string;
}

// 막대에 마우스를 올렸을 때 보이는 말풍선 (영상 제목 + 조회수)
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartData }[];
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="max-w-[220px] rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-md">
      <p className="text-sm font-semibold text-gray-800 line-clamp-2">{data.title}</p>
      <p className="mt-1 text-sm text-gray-500">조회수 {formatCount(data.views)}</p>
    </div>
  );
}

export default function ViewsChart({ videos, avgViews }: ViewsChartProps) {
  // 최근 10개만, 왼쪽이 오래된 영상 → 오른쪽이 최신 영상이 되도록 뒤집기
  const data: ChartData[] = videos
    .slice(0, 10)
    .reverse()
    .map((v) => ({
      date: v.snippet.publishedAt.slice(5, 10).replace('-', '/'), // MM/DD
      views: v.viewCount,
      title: v.snippet.title,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#F3F4F6" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#6B7280', fontSize: 12 }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value: number) => formatCount(value)}
          tick={{ fill: '#6B7280', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F3F6' }} />

        {/* 평균 조회수 기준선 */}
        <ReferenceLine
          y={avgViews}
          stroke="#6A4F6A"
          strokeWidth={2}
          strokeDasharray="6 4"
          label={{
            value: `평균 ${formatCount(avgViews)}`,
            position: 'insideTopLeft',
            fill: '#6A4F6A',
            fontSize: 12,
            fontWeight: 600,
          }}
        />

        <Bar
          dataKey="views"
          fill="#DCCFDD"                     
          radius={[6, 6, 0, 0]}
          activeBar={{ fill: '#B39CB5' }}    
        />
      </BarChart>
    </ResponsiveContainer>
  );
}