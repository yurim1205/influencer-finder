// 141000 -> 14.1만 형식으로 바꿔주는 함수
export const formatCount = (num: number): string => {
  const format = (value: number, unit: string) =>
    `${value.toFixed(1).replace(/\.0$/, '')}${unit}`;

  if (num >= 100000000) return format(num / 100000000, '억');
  if (num >= 10000) return format(num / 10000, '만');
  if (num >= 1000) return format(num / 1000, '천');
  return num.toString();
};

  // &#39;, &amp;, &quot; 같으 html 엔티티를 브라우저의 내장 파서를 이용해
  // 원래 문자로 되돌려줌
  export function decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  // 14.1만 -> 141000으로 바꿔주는 함수
  // 숫자로 바꿀 수 없는 입력이면 NaN을 돌려줌
  export const parseCount = (value: string): number => {
    const text = value.replace(/[,\s]/g, '');
    if (!text) return 0;

    const match = text.match(/^(\d+(?:\.\d+)?)(억|만|천)?$/);
    if (!match) return NaN;

    const units: Record<string, number> = { 억: 100000000, 만: 10000, 천: 1000 };
    const unit = match[2] ? units[match[2]] : 1;

    return Math.round(parseFloat(match[1]) * unit);
  };