import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function LoadingScreen() {
  const containerRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.loader-circle', {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: 'linear',
      });
      gsap.from(logoRef.current, {
        opacity: 0.5,
        scale: 0.95,
        duration: 0.8,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        zIndex: 9999,
      }}
    >
      <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div 
          className="loader-circle"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: 'var(--accent-a)',
            borderBottomColor: 'var(--accent-b)',
          }}
        />
        <div 
          ref={logoRef}
          className="gradient-text section-title"
          style={{ margin: 0, fontSize: '2rem' }}
        >
          CSE
        </div>
      </div>
      <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.875rem' }}>
        Initializing...
      </p>
    </div>
  );
}
