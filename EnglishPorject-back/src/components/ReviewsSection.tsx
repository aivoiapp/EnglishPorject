import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';
import { useEffect, useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { reviews } from '../data/reviewsData';
import { formatDate } from '../utils/dateFormatter';

const ReviewsSection = () => {
  const { t, i18n } = useTranslation();
  const [slidePercentage, setSlidePercentage] = useState(25);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const updateResponsive = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSlidePercentage(100);
        setIsMobile(true);
      } else if (width < 1024) {
        setSlidePercentage(50);
        setIsMobile(false);
      } else {
        setSlidePercentage(25);
        setIsMobile(false);
      }
    };

    updateResponsive();
    window.addEventListener('resize', updateResponsive);
    return () => window.removeEventListener('resize', updateResponsive);
  }, []);

  return (
    <section
      id="reviews"
      className="py-16 bg-gradient-to-b from-[#5B0E88] to-[#C5156E] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white"
    >
      <div className="container mx-auto px-6 pb-16">
        <h2 className="text-4xl font-bold text-center mb-12 mt-4">
          {t('reviewsSection.title')}
        </h2>
        <div className="relative overflow-visible">
          <Carousel
            showArrows={true}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            centerMode={true}
            centerSlidePercentage={slidePercentage}
            showIndicators={false}
            showStatus={false}
            swipeable={true}
            dynamicHeight={false}
            className="max-w-7xl mx-auto"
            selectedItem={currentSlide}
            onChange={setCurrentSlide}
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-[#f6e6fa]/90 dark:bg-gray-800/90 rounded-lg shadow-lg overflow-hidden border border-gray-200 p-6 mx-4 flex flex-col"
                style={{
                  minHeight: isMobile ? 'auto' : '380px',
                  maxHeight: isMobile ? 'auto' : '380px'
                }}
              >
                <div className="flex-grow overflow-hidden">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {review.name}
                  </h3>
                  <p className="text-pink-500 font-semibold mb-4">
                    {formatDate(review.date, i18n.language)}
                  </p>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${i < review.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {review.comment || t('reviewsSection.noComment')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
          {/* Solo este indicador personalizado queda */}
          {!isMobile && (
            <ul className="flex justify-center mt-2">
              {reviews.map((_, index) => (
                <li
                  key={index}
                  className={`inline-block mx-1 cursor-pointer ${currentSlide === index ? 'bg-gray-800 dark:bg-white' : 'bg-gray-400 dark:bg-gray-600'}`}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '20%',
                    marginTop: '10px'
                  }}
                  onClick={() => setCurrentSlide(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
