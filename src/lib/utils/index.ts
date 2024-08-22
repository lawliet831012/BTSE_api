export const numberWuthCommas = (x?: number | string): string => {
  return x !== undefined
    ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '';
};

export * from './request';
