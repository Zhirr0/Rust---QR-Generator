import { create } from 'zustand'

export type ErrorLevel = 'L' | 'M' | 'Q' | 'H'

interface QRStore {
  text: string
  errorLevel: ErrorLevel
  size: number
  svg: string | null
  isLoading: boolean
  setText: (text: string) => void
  setErrorLevel: (level: ErrorLevel) => void
  setSize: (size: number) => void
  setSvg: (svg: string | null) => void
  setIsLoading: (loading: boolean) => void
}

export const useQRStore = create<QRStore>((set) => ({
  text: '',
  errorLevel: 'M',
  size: 256,
  svg: null,
  isLoading: false,
  setText: (text) => set({ text }),
  setErrorLevel: (errorLevel) => set({ errorLevel }),
  setSize: (size) => set({ size }),
  setSvg: (svg) => set({ svg }),
  setIsLoading: (isLoading) => set({ isLoading }),
}))