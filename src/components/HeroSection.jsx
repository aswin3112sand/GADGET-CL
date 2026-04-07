import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimationControls,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HEADPHONES_IMAGE = '/hero-headphones.png';

const revealGroup = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const showcaseRef = useRef(null);
  const [interactiveEnabled, setInteractiveEnabled] = useState(false);
  const [sonicMode, setSonicMode] = useState(false);
  const [assetLoaded, setAssetLoaded] = useState(false);
  const burstControls = useAnimationControls();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(42);
  const imageDriftX = useMotionValue(0);
  const imageDriftY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { stiffness: 170, damping: 20, mass: 0.7 });
  const springTiltY = useSpring(tiltY, { stiffness: 170, damping: 20, mass: 0.7 });
  const springLightX = useSpring(lightX, { stiffness: 120, damping: 20, mass: 0.8 });
  const springLightY = useSpring(lightY, { stiffness: 120, damping: 20, mass: 0.8 });
  const springImageX = useSpring(imageDriftX, { stiffness: 140, damping: 18, mass: 0.8 });
  const springImageY = useSpring(imageDriftY, { stiffness: 140, damping: 18, mass: 0.8 });
  const cursorHalo = useMotionTemplate`radial-gradient(circle at ${springLightX}% ${springLightY}%, rgba(96, 165, 250, 0.36) 0%, rgba(59, 130, 246, 0.2) 24%, rgba(255,255,255,0.1) 44%, transparent 74%)`;

  useEffect(() => {
    if (shouldReduceMotion || typeof window === 'undefined') {
      setInteractiveEnabled(false);
      return undefined;
    }

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const syncState = () => setInteractiveEnabled(mediaQuery.matches);
    syncState();

    mediaQuery.addEventListener('change', syncState);
    return () => mediaQuery.removeEventListener('change', syncState);
  }, [shouldReduceMotion]);

  const handleShowcaseMove = (event) => {
    if (!interactiveEnabled || !showcaseRef.current) {
      return;
    }

    const rect = showcaseRef.current.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const relativeY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    const maxTilt = sonicMode ? 10 : 7.5;

    tiltY.set(Math.max(-maxTilt, Math.min(maxTilt, relativeX * maxTilt)));
    tiltX.set(Math.max(-maxTilt, Math.min(maxTilt, relativeY * -maxTilt)));
    lightX.set(((event.clientX - rect.left) / rect.width) * 100);
    lightY.set(((event.clientY - rect.top) / rect.height) * 100);
    imageDriftX.set(relativeX * (sonicMode ? 16 : 10));
    imageDriftY.set(relativeY * (sonicMode ? 12 : 8));
  };

  const resetShowcaseTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
    lightX.set(50);
    lightY.set(42);
    imageDriftX.set(0);
    imageDriftY.set(0);
  };

  const handleShowcaseToggle = () => {
    setSonicMode((current) => !current);

    if (shouldReduceMotion) {
      return;
    }

    burstControls.stop();
    void burstControls.start({
      rotateY: [0, 16, -10, 0],
      rotateX: [0, -12, 8, 0],
      rotateZ: [0, -4, 2, 0],
      y: [0, -10, 2, 0],
      scale: [1, 1.05, 0.98, 1],
      transition: {
        duration: 0.9,
        times: [0, 0.28, 0.68, 1],
        ease: [0.22, 1, 0.36, 1],
      },
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#f5f7fb] text-[#0f172a]">
      <motion.div
        className="absolute inset-0"
        animate={shouldReduceMotion ? undefined : { opacity: sonicMode ? 1 : 0.95 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          background: sonicMode
            ? 'radial-gradient(circle at 76% 24%, rgba(96,165,250,0.28), transparent 20%), radial-gradient(circle at 20% 18%, rgba(255,255,255,0.8), transparent 20%), linear-gradient(180deg, #f7f9fd 0%, #eef3fa 52%, #e6edf6 100%)'
            : 'radial-gradient(circle at 82% 18%, rgba(86,166,255,0.2), transparent 18%), radial-gradient(circle at 18% 18%, rgba(255,255,255,0.8), transparent 22%), linear-gradient(180deg, #f7f9fd 0%, #eff3f9 52%, #e7edf6 100%)',
        }}
      />
      <div className="absolute left-[-5rem] top-16 h-56 w-56 rounded-full bg-white/90 blur-[96px]" />
      <motion.div
        className="absolute right-[-7rem] top-6 h-72 w-72 rounded-full blur-[120px]"
        animate={shouldReduceMotion ? undefined : {
          scale: sonicMode ? [1, 1.16, 1] : [1, 1.06, 1],
          opacity: sonicMode ? [0.18, 0.34, 0.18] : [0.1, 0.2, 0.1],
        }}
        transition={shouldReduceMotion ? undefined : {
          duration: sonicMode ? 2.8 : 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ backgroundColor: 'rgba(86, 166, 255, 0.2)' }}
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-3rem)] max-w-7xl items-center gap-12 px-5 pb-14 pt-24 sm:px-6 sm:pt-28 md:px-10 lg:min-h-screen lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:gap-14 lg:px-12 xl:gap-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={revealGroup}
          className="max-w-[38rem]"
        >
          <motion.div variants={revealItem} className="mb-8 inline-flex items-center gap-3 rounded-full border border-[rgba(86,166,255,0.14)] bg-white/58 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#315dff] shadow-[0_16px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-[#56a6ff]" />
            Luxury electronics atelier
          </motion.div>

          <motion.div variants={revealItem}>
            <div className="mb-5 h-px w-24 bg-[linear-gradient(90deg,rgba(49,93,255,0),rgba(49,93,255,0.7),rgba(49,93,255,0))]" />
            <h1 className="font-display text-[clamp(3rem,17vw,7.2rem)] font-semibold uppercase leading-[0.84] tracking-[0.08em] text-[#08101d] [text-shadow:0_16px_40px_rgba(15,23,42,0.06)] sm:text-[clamp(3.5rem,12vw,7.2rem)]">
              Gadget69
            </h1>
          </motion.div>

          <motion.div variants={revealItem} className="mt-7 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#64748b]">
              Precision hardware. Quiet confidence.
            </p>
            <p className="max-w-[32rem] text-[1.05rem] leading-8 text-[#475569] md:text-[1.16rem]">
              A restrained luxury-tech storefront with glass surfaces, studio-lit product drama, and the kind of calm interaction design that lets the object do the talking.
            </p>
          </motion.div>

          <motion.div variants={revealItem} className="mt-7 flex flex-wrap items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em]">
            <span className="inline-flex items-center gap-2 text-[#0f172a]/70">
              <span className="h-2 w-2 rounded-full bg-[#56a6ff]" />
              Spatial feel
            </span>
            <span className="h-8 w-px bg-slate-300/70" />
            <span className="text-[#0f172a]/70">
              {sonicMode ? 'Immersion mode active' : 'Move your cursor across the product'}
            </span>
          </motion.div>

          <motion.div variants={revealItem} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#products" className="btn-primary group min-w-0 sm:min-w-[220px]">
              Explore Collection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#offers" className="btn-ghost group min-w-0 sm:min-w-[220px]">
              View Premium Picks
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.14, ease: 'easeOut' }}
          className="relative flex justify-center lg:justify-self-end lg:pr-6 xl:pr-10"
        >
          <motion.button
            type="button"
            ref={showcaseRef}
            onClick={handleShowcaseToggle}
            onMouseMove={handleShowcaseMove}
            onMouseLeave={resetShowcaseTilt}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.988 }}
            animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={shouldReduceMotion ? undefined : {
              duration: sonicMode ? 3 : 4.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={interactiveEnabled ? {
              rotateX: springTiltX,
              rotateY: springTiltY,
              transformPerspective: 1400,
            } : undefined}
            className="group relative block w-[min(82vw,390px)] max-w-full bg-transparent text-left isolate [transform-style:preserve-3d] sm:w-[250px] md:w-[300px] lg:w-[340px] xl:w-[390px]"
            aria-label="Toggle premium product showcase mode"
          >
            <motion.div
              className="absolute inset-[-8%] rounded-[38%] blur-[70px]"
              animate={shouldReduceMotion ? undefined : {
                opacity: sonicMode ? [0.2, 0.34, 0.2] : [0.12, 0.2, 0.12],
                scale: sonicMode ? [0.96, 1.08, 0.96] : [1, 1.04, 1],
              }}
              transition={shouldReduceMotion ? undefined : {
                duration: sonicMode ? 2.4 : 4.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.24) 0%, rgba(14,165,233,0.16) 38%, rgba(255,255,255,0.02) 78%, transparent 100%)',
              }}
            />

            <motion.div
              className="absolute inset-[-4%] z-0 rounded-[36%] blur-[64px]"
              style={{ background: cursorHalo }}
            />

            <motion.div
              className="absolute inset-x-[12%] bottom-4 h-12 rounded-full bg-[#0f172a]/16 blur-3xl"
              animate={shouldReduceMotion ? undefined : {
                scaleX: sonicMode ? [1, 0.88, 1] : [1, 0.94, 1],
                opacity: sonicMode ? [0.18, 0.3, 0.18] : [0.1, 0.16, 0.1],
              }}
              transition={shouldReduceMotion ? undefined : {
                duration: sonicMode ? 2.2 : 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <motion.div
              className="absolute right-4 top-4 z-30 rounded-full border border-[rgba(125,211,252,0.28)] bg-[rgba(255,255,255,0.68)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f172a] shadow-[0_18px_34px_rgba(15,23,42,0.08),0_0_22px_rgba(125,211,252,0.16)] backdrop-blur-xl"
              animate={shouldReduceMotion ? undefined : { y: [0, -4, 0] }}
              transition={shouldReduceMotion ? undefined : {
                duration: 2.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {sonicMode ? 'Immersion on' : 'Interactive object'}
            </motion.div>

            <div className="relative aspect-[9/10] w-full">
              <motion.div
                className="absolute inset-[10%] rounded-[2.6rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.08)_100%)] shadow-[0_28px_70px_rgba(15,23,42,0.1)] backdrop-blur-[28px]"
                animate={shouldReduceMotion ? undefined : {
                  borderColor: sonicMode ? ['rgba(255,255,255,0.6)', 'rgba(125,211,252,0.56)', 'rgba(255,255,255,0.6)'] : undefined,
                }}
                transition={shouldReduceMotion ? undefined : {
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {!assetLoaded ? (
                <motion.div
                  aria-hidden
                  className="absolute inset-[13%] rounded-[2.3rem] border border-white/60 bg-[linear-gradient(120deg,rgba(255,255,255,0.54)_0%,rgba(233,240,250,0.92)_50%,rgba(255,255,255,0.5)_100%)] shadow-[0_22px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                  animate={shouldReduceMotion ? undefined : { opacity: [0.42, 0.72, 0.42] }}
                  transition={shouldReduceMotion ? undefined : {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ) : null}

              <motion.div
                animate={burstControls}
                initial={false}
                className="relative z-20 h-full w-full [transform-style:preserve-3d]"
              >
                <motion.div
                  aria-hidden
                  initial={false}
                  animate={assetLoaded ? {
                    opacity: sonicMode ? 0.42 : 0.22,
                    scale: sonicMode ? 1.04 : 0.99,
                    x: sonicMode ? 10 : 4,
                    y: sonicMode ? 8 : 12,
                  } : {
                    opacity: 0,
                    scale: 0.92,
                    x: 0,
                    y: 0,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute inset-[10%] z-0"
                  style={{ x: springImageX, y: springImageY }}
                >
                  <img
                    src={HEADPHONES_IMAGE}
                    alt=""
                    className="h-full w-full object-contain opacity-80"
                    style={{ filter: 'blur(24px) saturate(1.28) brightness(1.04)' }}
                  />
                </motion.div>

                <motion.div
                  aria-hidden
                  className="absolute left-[18%] top-[24%] z-10 h-24 w-24 rounded-full blur-3xl"
                  animate={shouldReduceMotion ? undefined : {
                    opacity: sonicMode ? [0.2, 0.38, 0.2] : [0.12, 0.2, 0.12],
                    scale: sonicMode ? [0.9, 1.18, 0.9] : [0.96, 1.06, 0.96],
                  }}
                  transition={shouldReduceMotion ? undefined : {
                    duration: sonicMode ? 1.8 : 3.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ background: 'rgba(96, 165, 250, 0.42)' }}
                />

                <motion.div
                  aria-hidden
                  className="absolute bottom-[20%] right-[16%] z-10 h-20 w-20 rounded-full blur-3xl"
                  animate={shouldReduceMotion ? undefined : {
                    opacity: sonicMode ? [0.16, 0.3, 0.16] : [0.1, 0.18, 0.1],
                    scale: sonicMode ? [0.9, 1.12, 0.9] : [0.96, 1.04, 0.96],
                  }}
                  transition={shouldReduceMotion ? undefined : {
                    duration: sonicMode ? 2.1 : 3.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ background: 'rgba(125, 211, 252, 0.34)' }}
                />

                <motion.div
                  initial={false}
                  animate={assetLoaded
                    ? {
                      opacity: 1,
                      scale: 1,
                      y: sonicMode ? [0, -4, 0] : [0, -6, 0],
                      rotateZ: sonicMode ? [0, 1.2, 0, -1.2, 0] : [0, 0.8, 0, -0.8, 0],
                    }
                    : {
                      opacity: 0,
                      scale: 0.94,
                      y: 10,
                    }}
                  transition={assetLoaded
                    ? {
                      duration: sonicMode ? 3.6 : 5.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                    : {
                      duration: 0.65,
                      ease: 'easeOut',
                    }}
                  className="h-full w-full"
                  style={{ x: springImageX, y: springImageY }}
                >
                  <img
                    src={HEADPHONES_IMAGE}
                    alt="Gadget69 hero headphones presented as a premium studio-lit product object"
                    loading="eager"
                    fetchpriority="high"
                    onLoad={() => setAssetLoaded(true)}
                    onError={() => setAssetLoaded(true)}
                    className="pointer-events-none block h-full w-full object-contain"
                    style={{
                      filter: sonicMode
                        ? 'drop-shadow(0 40px 54px rgba(15,23,42,0.22)) drop-shadow(0 0 32px rgba(86,166,255,0.2))'
                        : 'drop-shadow(0 34px 48px rgba(15,23,42,0.18)) drop-shadow(0 0 20px rgba(86,166,255,0.12))',
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
