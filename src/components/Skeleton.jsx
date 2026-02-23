const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-xl bg-orange-200/70 dark:bg-orange-900/30 ${className}`}
  />
);

export default Skeleton;
