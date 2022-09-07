import { createContext, useCallback, useState } from "react";

type CustomContext = {
  currentUploads: string[];
  addToCurrentUploads: (uuid: string) => void;
  removeFromCurrentUploads: (uuid: string) => void;
}

export const CurrentUploadsContext = createContext<CustomContext>({
  currentUploads: [],
  addToCurrentUploads: () => {},
  removeFromCurrentUploads: () => {}
});

interface Props {
  children: React.ReactNode;
}

export function CurrentUploadsProvider (props: Props) {
  const { children } = props;

  const [currentUploads, setCurrentUploads] = useState<string[]>([]);
  
  const addToCurrentUploads = useCallback((uuid: string) => {
    setCurrentUploads(prevState => [...prevState, uuid]);
  }, []);

  const removeFromCurrentUploads = useCallback((uuid: string) => {
    setCurrentUploads(prevState => prevState.filter(upload => upload !== uuid));
  }, []);

  const value = { currentUploads, addToCurrentUploads, removeFromCurrentUploads }

  return (
    <CurrentUploadsContext.Provider value={value}>
      {children}
    </CurrentUploadsContext.Provider>
  )
}