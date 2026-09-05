import React from 'react';
import {
  Wallet,
  Home,
  User,
  Briefcase,
  GraduationCap,
  HeartPulse,
  ShoppingCart,
  Car,
  Plane,
  Gift,
  Baby,
  Dumbbell,
  Building2,
  Utensils
} from 'lucide-react';

// Registry ikon yang bisa dipilih pengguna untuk Sub-Saldo / Pos baru.
const REGISTRY = {
  Home,
  User,
  Wallet,
  Briefcase,
  GraduationCap,
  HeartPulse,
  ShoppingCart,
  Car,
  Building2,
  Utensils,
  Plane,
  Gift,
  Baby,
  Dumbbell
};

const LABELS = {
  Home: 'Rumah',
  User: 'Orang / Pribadi',
  Wallet: 'Dompet',
  Briefcase: 'Bisnis / Kerja',
  GraduationCap: 'Sekolah / Pendidikan',
  HeartPulse: 'Kesehatan',
  ShoppingCart: 'Belanja',
  Car: 'Kendaraan',
  Building2: 'Kantor / Usaha',
  Utensils: 'Makan',
  Plane: 'Liburan / Travel',
  Gift: 'Hadiah',
  Baby: 'Anak / Bayi',
  Dumbbell: 'Olahraga'
};

export const ACCOUNT_ICON_OPTIONS = Object.keys(REGISTRY).map((name) => ({
  name,
  label: LABELS[name] || name,
  Icon: REGISTRY[name]
}));

export const DEFAULT_ACCOUNT_ICON = 'Home';

export const getAccountIconComponent = (name) => REGISTRY[name] || Wallet;

export const AccountIcon = ({ name, ...props }) => {
  const Comp = getAccountIconComponent(name);
  return <Comp {...props} />;
};
