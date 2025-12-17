
import React, { useContext } from 'react';
import type { Module } from './context/AppContext';
import { AppContext } from './context/AppContext';
import { AICopilotIcon } from './Icons';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface MobileBottomNavProps {
  activeModule: Module;
  onNavigate: (module: Module) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeModule, onNavigate }) => {
  return null;
};

export default MobileBottomNav;
