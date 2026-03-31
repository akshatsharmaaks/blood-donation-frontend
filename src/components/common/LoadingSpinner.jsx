export default function LoadingSpinner({ size = 36 }) {
  return (
    <div style={{ display:'flex', justifyContent:'center',
      alignItems:'center', padding:'2rem' }}>
      <div style={{
        width: size, height: size,
        border: '3px solid #fee2e2',
        borderTop: '3px solid #e53e3e',
        borderRadius: '50%',
        animation: 'spin .7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}