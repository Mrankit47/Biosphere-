export default function HumanBodyPage() {
  return (
    <section
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          color: "#39FF14",
          textShadow: "0 0 30px rgba(57,255,20,0.3)",
        }}
      >
        🫀 Human Body
      </h1>
      <p style={{ color: "#C8F5C8", opacity: 0.7 }}>
        Explore human anatomy — coming soon
      </p>
    </section>
  );
}
