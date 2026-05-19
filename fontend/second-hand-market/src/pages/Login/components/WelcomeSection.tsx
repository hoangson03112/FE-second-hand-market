import React from 'react';

export const WelcomeSection: React.FC = () => {
  return (
    <div className="flex flex-col justify-center h-full mb-6">
      <div className="text-white px-6 py-8 md:px-12 md:py-10">
        <h4 className="mb-6 text-2xl md:text-3xl font-bold">
          Khám phá giá trị cũ, tạo phong cách mới
        </h4>
        <div className="space-y-4">
          <p className="mb-0 italic text-lg leading-relaxed">
            "Tôi luôn tin rằng những món đồ cũ không chỉ là những vật
            thể đã qua sử dụng mà còn là những phần của ký ức và câu
            chuyện cá nhân..."
          </p>
          <p className="text-sm opacity-90">
            — Sophia Amoruso, Nhà sáng lập Nasty Gal và tác giả của #GIRLBOSS.
          </p>
        </div>
      </div>
    </div>
  );
};
