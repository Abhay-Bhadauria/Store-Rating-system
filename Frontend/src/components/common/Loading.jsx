const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-gray-600">{text}</p>
      </div>
    </div>
  );
};

export default Loading;