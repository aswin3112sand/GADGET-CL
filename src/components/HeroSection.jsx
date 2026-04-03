import { useLayoutEffect, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Star, Truck, Zap } from 'lucide-react';

const floatingProducts = [
  {
    name: 'Nova X Pro',
    price: 'Rs. 49,999',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=90',
    top: '14%',
    left: '5%',
    delay: 0,
  },
  {
    name: 'Pulse Ultra',
    price: 'Rs. 18,999',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=90',
    top: '10%',
    right: '5%',
    delay: 0.45,
  },
  {
    name: 'SonicBuds Air',
    price: 'Rs. 12,999',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=90',
    bottom: '19%',
    left: '4%',
    delay: 0.9,
  },
  {
    name: 'TitanBook X14',
    price: 'Rs. 89,999',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&q=90',
    bottom: '16%',
    right: '4%',
    delay: 1.35,
  },
];

const trustBadges = [
  { icon: Shield, label: '100% Genuine' },
  { icon: Truck, label: 'Free Delivery' },
  { icon: Star, label: '4.8 Rated' },
  { icon: Zap, label: '24h Shipping' },
];

const HeroSection = () => {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const badgeGlowRef = useRef(null);
  const badgeLightRef = useRef(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);

  const smoothRotateX = useSpring(rotateX, { stiffness: 120, damping: 18, mass: 0.4 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 120, damping: 18, mass: 0.4 });
  const smoothPointerX = useSpring(pointerX, { stiffness: 140, damping: 22, mass: 0.35 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 140, damping: 22, mass: 0.35 });

  const deepLayerX = useTransform(smoothRotateY, [-14, 14], [30, -30]);
  const deepLayerY = useTransform(smoothRotateX, [-14, 14], [-22, 22]);
  const shallowLayerX = useTransform(smoothRotateY, [-14, 14], [16, -16]);
  const shallowLayerY = useTransform(smoothRotateX, [-14, 14], [-12, 12]);
  const spotlight = useMotionTemplate`radial-gradient(circle at ${smoothPointerX}% ${smoothPointerY}%, rgba(103, 232, 249, 0.18), transparent 18%), radial-gradient(circle at ${smoothPointerX}% ${smoothPointerY}%, rgba(244, 114, 182, 0.1), transparent 34%)`;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const badge = badgeRef.current;
    const badgeGlow = badgeGlowRef.current;
    const badgeLight = badgeLightRef.current;

    if (!section || !badge || !badgeGlow || !badgeLight) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(badge, {
        xPercent: -50,
        yPercent: -50,
        transformPerspective: 1000,
        transformOrigin: 'center center',
      });

      gsap.fromTo(
        badge,
        { opacity: 0, scale: 0.84, y: 28, filter: 'blur(10px)' },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.05,
          ease: 'power3.out',
        }
      );

      gsap.to(badgeGlow, {
        scale: 1.18,
        opacity: 0.82,
        duration: 2.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      gsap.to(badgeLight, {
        rotation: 360,
        duration: 16,
        ease: 'none',
        repeat: -1,
      });

      const moveX = gsap.quickTo(badge, 'x', { duration: 0.55, ease: 'power3.out' });
      const moveY = gsap.quickTo(badge, 'y', { duration: 0.55, ease: 'power3.out' });
      const tiltX = gsap.quickTo(badge, 'rotationX', { duration: 0.5, ease: 'power3.out' });
      const tiltY = gsap.quickTo(badge, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      const scaleTo = gsap.quickTo(badge, 'scale', { duration: 0.45, ease: 'power2.out' });
      const glowX = gsap.quickTo(badgeGlow, 'x', { duration: 0.5, ease: 'power3.out' });
      const glowY = gsap.quickTo(badgeGlow, 'y', { duration: 0.5, ease: 'power3.out' });
      const lightX = gsap.quickTo(badgeLight, 'x', { duration: 0.42, ease: 'power3.out' });
      const lightY = gsap.quickTo(badgeLight, 'y', { duration: 0.42, ease: 'power3.out' });
      const lightOpacity = gsap.quickTo(badgeLight, 'opacity', { duration: 0.38, ease: 'power2.out' });

      const handlePointerMove = (event) => {
        const rect = section.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const centerX = (x - 0.5) * 42;
        const centerY = (y - 0.5) * 30;

        moveX(centerX);
        moveY(centerY);
        tiltX((0.5 - y) * 22);
        tiltY((x - 0.5) * 28);
        scaleTo(1.04);
        glowX(centerX * 0.9);
        glowY(centerY * 0.9);
        lightX(centerX * 1.2);
        lightY(centerY * 1.2);
        lightOpacity(0.92);
      };

      const resetPointer = () => {
        moveX(0);
        moveY(0);
        tiltX(0);
        tiltY(0);
        scaleTo(1);
        glowX(0);
        glowY(0);
        lightX(0);
        lightY(0);
        lightOpacity(0.55);
      };

      const handleScroll = () => {
        const offset = Math.min(window.scrollY * 0.12, 72);
        gsap.to(badge, {
          y: offset,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      section.addEventListener('mousemove', handlePointerMove);
      section.addEventListener('mouseleave', resetPointer);
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        section.removeEventListener('mousemove', handlePointerMove);
        section.removeEventListener('mouseleave', resetPointer);
        window.removeEventListener('scroll', handleScroll);
      };
    }, section);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const centeredX = x - 0.5;
    const centeredY = y - 0.5;

    rotateY.set(centeredX * 14);
    rotateX.set(centeredY * -12);
    pointerX.set(x * 100);
    pointerY.set(y * 100);
  };

  const resetMouse = () => {
    rotateX.set(0);
    rotateY.set(0);
    pointerX.set(50);
    pointerY.set(50);
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark-400"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMouse}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ filter: 'contrast(1.18) saturate(1.16) brightness(0.86)' }}
      >
        <source src="/hero-gadget-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,12,0.18)_0%,rgba(3,6,12,0.42)_52%,rgba(5,7,15,0.76)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.18),transparent_20%),radial-gradient(circle_at_82%_22%,rgba(236,72,153,0.14),transparent_18%),radial-gradient(circle_at_50%_82%,rgba(34,211,238,0.1),transparent_24%)]" />
      <motion.div className="pointer-events-none absolute inset-0" style={{ backgroundImage: spotlight }} />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {floatingProducts.map((product, index) => (
        <motion.div
          key={product.name}
          initial={{ opacity: 0, scale: 0.84 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: product.delay + 0.5, duration: 0.55 }}
          className="absolute z-[2] hidden xl:block"
          style={{
            top: product.top,
            left: product.left,
            right: product.right,
            bottom: product.bottom,
            x: index % 2 === 0 ? shallowLayerX : deepLayerX,
            y: index % 2 === 0 ? shallowLayerY : deepLayerY,
          }}
        >
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{
              duration: 4.2 + index,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: product.delay,
            }}
            className="w-44 rounded-2xl border border-white/12 bg-slate-950/42 p-3 backdrop-blur-xl shadow-[0_24px_70px_rgba(0,0,0,0.38)]"
          >
            <img
              src={product.img}
              alt={product.name}
              className="mb-2 h-28 w-full rounded-xl object-cover"
            />
            <p className="truncate text-xs font-semibold text-white">{product.name}</p>
            <p className="text-sm font-bold text-cyan-300">{product.price}</p>
          </motion.div>
        </motion.div>
      ))}

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[5]">
        <div
          ref={badgeGlowRef}
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/18 blur-[70px]"
        />
        <div
          ref={badgeRef}
          className="absolute left-1/2 top-1/2 w-[min(46vw,280px)] overflow-hidden rounded-[1.75rem] border border-white/16 bg-slate-950/34 px-6 py-5 text-center shadow-[0_30px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl"
        >
          <div className="absolute inset-[1px] rounded-[1.6rem] bg-[linear-gradient(145deg,rgba(15,23,42,0.68),rgba(2,6,23,0.2),rgba(8,47,73,0.45))]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_28%,transparent_72%,rgba(103,232,249,0.12))]" />
          <div
            ref={badgeLightRef}
            className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.32),rgba(125,211,252,0.08)_42%,transparent_72%)] opacity-55 blur-2xl"
          />
          <div className="relative">
            <div className="mx-auto mb-3 h-px w-16 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
            <p className="font-display text-[clamp(1.3rem,3vw,2.05rem)] font-black tracking-[0.34em] text-white">
              Gadget_69
            </p>
            <p className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-cyan-300/78">
              immersive motion
            </p>
          </div>
        </div>
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-[64vh] text-center md:px-8"
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformPerspective: 1400,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/products" className="btn-primary flex items-center gap-2 px-8 py-4 text-base">
            Explore Collection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-5"
        >
          {trustBadges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/36 px-4 py-2 text-sm text-white/72 backdrop-blur-md"
            >
              <Icon className="h-3.5 w-3.5 text-cyan-300" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-400 to-transparent" />
    </section>
  );
};

export default HeroSection;
