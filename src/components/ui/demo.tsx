import { ReviewSummaryCard } from './card-2'; // Relative import path

/**
 * A demo component to showcase the ReviewSummaryCard.
 */
const ReviewSummaryCardDemo = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-4">
      <ReviewSummaryCard
        rating={5.0}
        reviewCount={1092}
        summaryText="Outstanding: Rated 5.0 with 1,092 Reviews."
      />
    </div>
  );
};

export default ReviewSummaryCardDemo;
