import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  LoaderCircle,
  PlayCircle,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/zoom';
import { createCloudinaryTransformedUrl } from '../utils/cloudinary';
import {
  MEDIA_IMAGE,
  MEDIA_VIDEO,
  normalizeProductMediaList,
} from '../utils/productMedia';

const ProductMediaGallery = ({ mediaList, productName, fallbackImage }) => {
  const galleryMedia = useMemo(() => {
    const normalized = normalizeProductMediaList({ mediaList });
    if (normalized.length > 0) {
      return normalized;
    }

    return fallbackImage
      ? [{ id: 'fallback-image', url: fallbackImage, type: MEDIA_IMAGE, position: 0 }]
      : [];
  }, [fallbackImage, mediaList]);

  const galleryKey = useMemo(
    () => galleryMedia.map((item) => `${item.type}:${item.url}`).join('|'),
    [galleryMedia],
  );

  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [readyVideos, setReadyVideos] = useState({});
  const [activatedSlides, setActivatedSlides] = useState({ 0: true });
  const [hoverPoint, setHoverPoint] = useState({ x: 50, y: 50, active: false });

  useEffect(() => {
    setActiveIndex(0);
    setLoadedImages({});
    setReadyVideos({});
    setActivatedSlides({ 0: true });
    setHoverPoint({ x: 50, y: 50, active: false });
    swiperRef.current?.slideTo?.(0, 0);
  }, [galleryKey]);

  useEffect(() => {
    setActivatedSlides((current) => ({
      ...current,
      [activeIndex]: true,
    }));
  }, [activeIndex]);

  if (galleryMedia.length === 0) {
    return null;
  }

  const buildThumbUrl = (item) => createCloudinaryTransformedUrl(
    item.url,
    item.type === MEDIA_IMAGE
      ? 'f_auto,q_auto,c_fill,g_auto,w_180,h_180'
      : 'so_0,f_jpg,q_auto,c_fill,g_auto,w_180,h_180',
  );

  const buildBlurUrl = (item) => createCloudinaryTransformedUrl(
    item.url,
    item.type === MEDIA_IMAGE
      ? 'f_auto,q_auto,e_blur:900,w_60'
      : 'so_0,f_jpg,q_auto,e_blur:900,w_60',
  );

  const buildStageUrl = (item) => createCloudinaryTransformedUrl(
    item.url,
    item.type === MEDIA_IMAGE ? 'f_auto,q_auto,w_1600' : 'q_auto,w_1600',
  );

  const buildPosterUrl = (item) => createCloudinaryTransformedUrl(
    item.url,
    'so_0,f_jpg,q_auto,w_1400',
  );

  return (
    <div className="rounded-[2rem] border border-[#1c2e26] bg-[radial-gradient(circle_at_top,rgba(126,242,184,0.12),transparent_28%),linear-gradient(180deg,#111111_0%,#070707_100%)] p-4 shadow-[0_28px_64px_rgba(5,5,5,0.34)] md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3 rounded-[1.3rem] border border-white/8 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#8ef0be]">Premium gallery</p>
          <p className="mt-1 text-sm text-white/68">Swipe, zoom, and preview every product asset in one mixed-media rail.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/68">
          {galleryMedia.length} assets
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[108px_minmax(0,1fr)]">
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:max-h-[42rem] lg:flex-col lg:overflow-y-auto lg:pr-1">
          {galleryMedia.map((item, index) => {
            const isActive = index === activeIndex;
            const thumbUrl = buildThumbUrl(item);

            return (
              <button
                key={`${item.type}-${item.url}-${index}`}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  swiperRef.current?.slideTo?.(index);
                }}
                className={`group relative h-24 min-w-24 overflow-hidden rounded-[1.15rem] border transition-all duration-300 lg:h-[106px] lg:min-w-0 ${
                  isActive
                    ? 'border-[#8ef0be]/70 bg-[#112018] shadow-[0_14px_30px_rgba(84,223,161,0.16)]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/22'
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className={`absolute inset-0 ${isActive ? 'ring-1 ring-inset ring-[#8ef0be]/70' : 'bg-black/16'}`} />
                <div className="absolute left-2 top-2 rounded-full border border-white/10 bg-black/40 p-1 text-white/80">
                  {item.type === MEDIA_IMAGE ? <ImageIcon className="h-3.5 w-3.5" /> : <Film className="h-3.5 w-3.5" />}
                </div>
                {item.type === MEDIA_VIDEO ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full bg-black/52 p-2 text-white">
                      <PlayCircle className="h-4 w-4" />
                    </span>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-[1.7rem] border border-white/8 bg-[#060606]">
            {galleryMedia.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slidePrev?.()}
                  className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/50 text-white transition hover:bg-black/68"
                  aria-label="Show previous media"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slideNext?.()}
                  className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/50 text-white transition hover:bg-black/68"
                  aria-label="Show next media"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}

            <Swiper
              modules={[Keyboard, Zoom]}
              keyboard={{ enabled: true }}
              zoom={{ maxRatio: 2.6 }}
              spaceBetween={0}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              className="aspect-[4/4.2] w-full sm:aspect-[4/3.5] xl:aspect-[4/3]"
            >
              {galleryMedia.map((item, index) => {
                const isActive = index === activeIndex;
                const shouldRenderAsset = Boolean(activatedSlides[index]);
                const stageUrl = buildStageUrl(item);
                const blurUrl = buildBlurUrl(item);
                const posterUrl = item.type === MEDIA_VIDEO ? buildPosterUrl(item) : null;
                const imageLoaded = Boolean(loadedImages[index]);
                const videoReady = Boolean(readyVideos[index]);

                return (
                  <SwiperSlide key={`${item.type}-${item.url}-${index}`}>
                    <div className="relative h-full w-full">
                      {item.type === MEDIA_IMAGE ? (
                        <div className="swiper-zoom-container h-full w-full">
                          <div
                            className="group relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(126,242,184,0.09),transparent_24%),linear-gradient(180deg,#121212_0%,#070707_100%)]"
                            onMouseMove={(event) => {
                              if (!isActive) {
                                return;
                              }

                              const bounds = event.currentTarget.getBoundingClientRect();
                              setHoverPoint({
                                x: ((event.clientX - bounds.left) / bounds.width) * 100,
                                y: ((event.clientY - bounds.top) / bounds.height) * 100,
                                active: true,
                              });
                            }}
                            onMouseLeave={() => setHoverPoint({ x: 50, y: 50, active: false })}
                          >
                            <img
                              src={blurUrl}
                              alt=""
                              aria-hidden="true"
                              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
                            />
                            {!imageLoaded ? (
                              <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.04)_8%,rgba(255,255,255,0.1)_18%,rgba(255,255,255,0.04)_33%)]" />
                            ) : null}
                            {shouldRenderAsset ? (
                              <img
                                src={stageUrl}
                                alt={`${productName} view ${index + 1}`}
                                loading={index === 0 ? 'eager' : 'lazy'}
                                onLoad={() => setLoadedImages((current) => ({ ...current, [index]: true }))}
                                className={`relative z-[1] h-full w-full object-cover transition duration-500 ease-out ${
                                  imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{
                                  transformOrigin: `${hoverPoint.x}% ${hoverPoint.y}%`,
                                  transform: isActive && hoverPoint.active ? 'scale(1.75)' : 'scale(1)',
                                }}
                              />
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <div className="relative h-full w-full bg-[radial-gradient(circle_at_top,rgba(126,242,184,0.08),transparent_24%),linear-gradient(180deg,#151515_0%,#090909_100%)]">
                          {!isActive ? (
                            <>
                              <img
                                src={posterUrl || buildThumbUrl(item)}
                                alt={`${productName} video preview ${index + 1}`}
                                className="h-full w-full object-cover opacity-72"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/28">
                                <div className="rounded-full border border-white/12 bg-black/56 p-4 text-white">
                                  <PlayCircle className="h-9 w-9" />
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              {!videoReady ? (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35">
                                  <LoaderCircle className="h-8 w-8 animate-spin text-[#8ef0be]" />
                                </div>
                              ) : null}
                              <video
                                src={stageUrl}
                                poster={posterUrl || buildThumbUrl(item)}
                                controls
                                playsInline
                                preload="metadata"
                                onLoadedData={() => setReadyVideos((current) => ({ ...current, [index]: true }))}
                                className="h-full w-full object-cover"
                              />
                            </>
                          )}
                        </div>
                      )}

                      <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/12 bg-black/44 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/76">
                        {item.type === MEDIA_IMAGE ? `Image ${index + 1}` : `Video ${index + 1}`}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMediaGallery;
