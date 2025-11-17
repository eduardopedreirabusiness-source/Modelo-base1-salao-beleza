import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ServicesDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<any>({
    loading: true,
    error: null,
    data: null,
    count: 0,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    runDiagnostic();
  }, []);

  const runDiagnostic = async () => {
    const startTime = Date.now();

    try {
      console.log('[DIAGNOSTIC] Starting services fetch...');

      const { data, error, count } = await supabase
        .from('services')
        .select('*', { count: 'exact' })
        .order('category', { ascending: true })
        .order('price', { ascending: true });

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('[DIAGNOSTIC] Fetch completed in', duration, 'ms');
      console.log('[DIAGNOSTIC] Data:', data);
      console.log('[DIAGNOSTIC] Error:', error);
      console.log('[DIAGNOSTIC] Count:', count);

      setDiagnostics({
        loading: false,
        error: error,
        data: data,
        count: count || (data?.length ?? 0),
        duration: duration,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('[DIAGNOSTIC] Exception:', err);
      setDiagnostics({
        loading: false,
        error: err.message || 'Unknown error',
        data: null,
        count: 0,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #f43f5e',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '400px',
      maxHeight: '500px',
      overflow: 'auto',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'monospace',
    }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#f43f5e', fontSize: '14px', fontWeight: 'bold' }}>
        Services Diagnostic
      </h3>

      <div style={{ marginBottom: '8px' }}>
        <strong>Status:</strong> {diagnostics.loading ? '🔄 Loading...' : '✓ Complete'}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Services Count:</strong> {diagnostics.count}
      </div>

      {diagnostics.duration && (
        <div style={{ marginBottom: '8px' }}>
          <strong>Fetch Duration:</strong> {diagnostics.duration}ms
        </div>
      )}

      {diagnostics.error && (
        <div style={{ marginBottom: '8px', color: 'red' }}>
          <strong>Error:</strong>
          <pre style={{ margin: '4px 0', whiteSpace: 'pre-wrap', fontSize: '11px' }}>
            {JSON.stringify(diagnostics.error, null, 2)}
          </pre>
        </div>
      )}

      {diagnostics.data && (
        <div style={{ marginBottom: '8px' }}>
          <strong>Services Data:</strong>
          <pre style={{
            margin: '4px 0',
            whiteSpace: 'pre-wrap',
            fontSize: '11px',
            maxHeight: '200px',
            overflow: 'auto',
            background: '#f3f4f6',
            padding: '8px',
            borderRadius: '4px',
          }}>
            {JSON.stringify(diagnostics.data, null, 2)}
          </pre>
        </div>
      )}

      <button
        onClick={runDiagnostic}
        style={{
          marginTop: '8px',
          padding: '8px 16px',
          background: '#f43f5e',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        🔄 Run Again
      </button>

      <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>
        Last run: {new Date(diagnostics.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}
