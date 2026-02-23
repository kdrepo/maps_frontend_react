const EmptyState = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center text-center text-orange-600 dark:text-orange-400">
    <div className="text-lg font-semibold text-orange-900 dark:text-orange-200">{title}</div>
    <p className="mt-2 max-w-sm text-sm text-orange-700 dark:text-orange-100">{description}</p>
  </div>
);

export default EmptyState;
