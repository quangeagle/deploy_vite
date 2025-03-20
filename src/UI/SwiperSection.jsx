// SwiperSection.jsx
import { } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SwiperSection = ({ images }) => {
  return (
    <div className="w-full h-96">
      <Swiper
        cssMode={true}
        navigation={{ clickable: true }}
        pagination={{ clickable: true }}
        mousewheel={true}
        keyboard={true}
        autoplay={{
          delay: 3000, // Tự động chuyển slide mỗi 3 giây
          disableOnInteraction: false, // Không dừng autoplay khi người dùng tương tác
        }}
        loop={true} // Lặp lại vòng tròn khi đến cuối slider
        modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]} // Thêm Autoplay vào các module
        className="mySwiper w-full h-98 group"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className="bg-white h-98">
            <img src={img} className='h-98 w-full object-fill' alt={`slide-${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperSection;
