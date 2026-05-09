import { useState, useEffect } from 'react';

export interface AppState {
  userId: string | null;
  role: string | null;
  fullName: string | null;
  profilePhotoUrl: string | null;
}

type Listener = (state: AppState) => void;

class AppStateManager {
  private static instance: AppStateManager;
  private state: AppState;
  private listeners: Set<Listener> = new Set();

  private constructor() {
    // Initialize from sessionStorage or default
    const storedState = sessionStorage.getItem('appState');
    if (storedState) {
      try {
        this.state = JSON.parse(storedState);
      } catch (e) {
        this.state = this.getDefaultState();
      }
    } else {
      this.state = this.getDefaultState();
    }
  }

  private getDefaultState(): AppState {
    return {
      userId: null,
      role: null,
      fullName: null,
      profilePhotoUrl: null,
    };
  }

  public static getInstance(): AppStateManager {
    if (!AppStateManager.instance) {
      AppStateManager.instance = new AppStateManager();
    }
    return AppStateManager.instance;
  }

  public getState(): AppState {
    return this.state;
  }

  public setState(newState: Partial<AppState>) {
    this.state = { ...this.state, ...newState };
    sessionStorage.setItem('appState', JSON.stringify(this.state));
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export const appStateManager = AppStateManager.getInstance();

export function useAppState(): AppState {
  const [state, setState] = useState<AppState>(appStateManager.getState());

  useEffect(() => {
    const unsubscribe = appStateManager.subscribe(setState);
    return () => unsubscribe();
  }, []);

  return state;
}
