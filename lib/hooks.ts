import { useState, useCallback } from 'react';

export function usePreviousState<T>(initialState: T): [
  T,
  (newState: T | ((prevState: T) => T)) => void,
  () => void,
  () => void,
  boolean,
  boolean
] {
  const [versions, setVersions] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getCurrentState = useCallback(() => versions[currentIndex], [versions, currentIndex]);

  const setNewVersion = useCallback((newState: T | ((prevState: T) => T)) => {
    const nextState = typeof newState === 'function'
      ? (newState as (prevState: T) => T)(versions[currentIndex])
      : newState;
    
    setVersions(prevVersions => {
      const newVersions = prevVersions.slice(0, currentIndex + 1);
      return [...newVersions, nextState];
    });
    setCurrentIndex(prevIndex => prevIndex + 1);
  }, [versions, currentIndex]);

  const goToPreviousVersion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  }, [currentIndex]);

  const goToNextVersion = useCallback(() => {
    if (currentIndex < versions.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  }, [versions.length, currentIndex]);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < versions.length - 1;

  return [
    getCurrentState(),
    setNewVersion,
    goToPreviousVersion,
    goToNextVersion,
    canGoBack,
    canGoForward
  ];
}