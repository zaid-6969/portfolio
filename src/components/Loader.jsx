const Loader = ({ fullScreen = false }) => {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: fullScreen ? "100vh" : 300, gap: 16,
    }}>
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)",
          animation: "spin 0.8s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: 8,
          borderRadius: "50%",
          border: "2px solid var(--border)",
          borderBottomColor: "var(--accent-light)",
          animation: "spin 1.2s linear infinite reverse",
        }} />
      </div>
      <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Loading...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Loader;