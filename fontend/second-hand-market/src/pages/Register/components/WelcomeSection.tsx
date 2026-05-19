import React from 'react';

export const WelcomeSection: React.FC = () => {
  return (
    <div className="flex flex-col justify-center bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 rounded-lg h-full mb-6 p-8">
      <div className="text-white">
        <h4 className="mb-6 text-2xl md:text-3xl font-bold">
          Sống xanh, sống bền vững với những món đồ cũ đầy giá trị.
        </h4>
        <div className="space-y-4">
          <p className="mb-0 italic text-lg leading-relaxed">
            "Sự sáng tạo là nhìn thấy những gì mà người khác không nhìn
            thấy và nghĩ ra những gì chưa từng tồn tại."
          </p>
          <p className="text-sm opacity-90">
            — Albert Einstein
          </p>
        </div>
      </div>
    </div>
  );
};
