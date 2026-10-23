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