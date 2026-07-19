const RatingStars = ({ rating }) => {
  const value = Number(rating || 0);

  return (
    <div className="flex items-center gap-1">

      {[1,2,3,4,5].map((star)=>(
        <span
          key={star}
          className={`text-xl ${
            star <= Math.round(value)
              ? "text-yellow-500"
              : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}

      <span className="ml-2 text-sm text-gray-600">
        {value || 0}
      </span>

    </div>
  );
};

export default RatingStars;