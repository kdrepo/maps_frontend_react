const DistrictPills = ({ districts, selectedDistrict, onSelect }) => {
  if (!districts || districts.length === 0) {
    return (
      <div className="glass-panel flex h-24 items-center justify-center text-orange-600 dark:text-orange-400">
        No districts available
      </div>
    );
  }

  return (
    <div className="glass-panel p-4">
      <div className="flex flex-wrap gap-3">
        {districts.map((district) => (
          <button
            key={district.code}
            className={`pill ${selectedDistrict === district.code ? "pill-active" : ""}`}
            onClick={() => onSelect(district.code)}
            type="button"
          >
            {district.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DistrictPills;
