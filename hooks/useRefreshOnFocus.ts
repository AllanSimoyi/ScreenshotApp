import React from 'react';
import { useFocusEffect } from '@react-navigation/native';

type Refetch = () => Promise<void>

export function useRefreshOnFocus (refetch: Refetch) {
  const enabledRef = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (enabledRef.current) {
        refetch();
      } else {
        enabledRef.current = true;
      }
    }, [refetch])
  );
}
