import { useEffect } from 'react';
import { AppState } from 'react-native';

type OnChange = (status: string) => void

export function useAppState (onChange: OnChange) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onChange);
    return () => {
      subscription.remove();
      // AppState.removeEventListener('change', onChange);
    };
  }, [onChange]);
}
