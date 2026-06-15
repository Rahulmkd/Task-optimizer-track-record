"use client";

export function GlowBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary glow */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 animate-float"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Secondary glow */}
      <div
        className="absolute top-1/3 -right-40 w-80 h-80 rounded-full opacity-15 animate-float-delayed"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Tertiary glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 opacity-10 animate-float-slow"
        style={{
          background: "radial-gradient(ellipse, #10b981 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
