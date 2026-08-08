import { StateStorage } from 'zustand/middleware';
import { mmkv } from './mmkv';

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    mmkv.set(name, value);
  },
  getItem: name => mmkv.getString(name) ?? null,
  removeItem: name => {
    mmkv.remove(name);
  },
};
