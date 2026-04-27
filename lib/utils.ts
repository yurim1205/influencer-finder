export const formatCount = (num: number): string => {
    if (num >= 100000000) return `${(num / 100000000).toFixed(0)}억`;
    if (num >= 10000) return `${(num / 10000).toFixed(0)}만`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}천`;
    return num.toString();
  };