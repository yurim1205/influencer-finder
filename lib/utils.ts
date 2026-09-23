export const formatCount = (num: number): string => {
    if (num >= 100000000) return `${(num / 100000000).toFixed(0)}억`;
    if (num >= 10000) return `${(num / 10000).toFixed(0)}만`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}천`;
    return num.toString();
  };

  // &#39;, &amp;, &quot; 같으 html 엔티티를 브라우저의 내장 파서를 이용해
  // 원래 문자로 되돌려줌
  export function decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }