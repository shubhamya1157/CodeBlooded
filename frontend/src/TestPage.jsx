export default function TestPage() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '1rem',
        }}>
          CampusConnect Running! ✅
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#d1d5db',
        }}>
          React is working correctly
        </p>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginTop: '1rem',
        }}>
          If you see this, the issue is with your components. Check browser console for errors.
        </p>
      </div>
    </div>
  );
}
