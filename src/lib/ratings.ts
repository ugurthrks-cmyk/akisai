export type ToolRatingScores = {
  kullanimKolayligi?: number;
  turkiyeUyumu?: number;
  fiyatDeger?: number;
  ozellikler?: number;
  destek?: number;
};

export const TOOL_RATING_WEIGHTS: Record<keyof ToolRatingScores, number> = {
  kullanimKolayligi: 0.2,
  turkiyeUyumu: 0.2,
  fiyatDeger: 0.2,
  ozellikler: 0.25,
  destek: 0.15,
};

export function computeToolRating(scores: ToolRatingScores) {
  let weightedTotal = 0;
  let weightSum = 0;

  (Object.keys(TOOL_RATING_WEIGHTS) as Array<keyof ToolRatingScores>).forEach((key) => {
    const value = scores[key];
    const weight = TOOL_RATING_WEIGHTS[key];

    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      weightedTotal += value * weight;
      weightSum += weight;
    }
  });

  if (!weightSum) {
    return undefined;
  }

  const score = weightedTotal / weightSum;
  return Math.round(score * 10) / 10;
}
