'use client';
import React from 'react';
import {
  Map, MapPin, MapPinOff, Layers, Globe, Compass, Ruler, LocateFixed,
  Download, Filter, Search, Share2, ExternalLink, Maximize2, Info,
  ChevronDown, ChevronUp, ArrowRight, ArrowLeft, X, Plus, Minus, Mail
} from 'lucide-react';

/* Réécrit par rapport à la source Claude Design : celle-ci va chercher
   chaque icône par fetch() sur unpkg.com/lucide-static au runtime. Ici on
   utilise lucide-react avec des imports nommés — limités au vocabulaire
   du design system — pour rester léger, tree-shakable et fonctionner
   hors-ligne. L'API du composant ne change pas (name, size, color), donc
   le JSX porté depuis le kit (<Icon name="arrow-right" size={17} />)
   n'a rien à changer. */
const ICONS = {
  map: Map,
  'map-pin': MapPin,
  'map-pin-off': MapPinOff,
  layers: Layers,
  globe: Globe,
  compass: Compass,
  ruler: Ruler,
  'locate-fixed': LocateFixed,
  download: Download,
  filter: Filter,
  search: Search,
  'share-2': Share2,
  'external-link': ExternalLink,
  'maximize-2': Maximize2,
  info: Info,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  x: X,
  plus: Plus,
  minus: Minus,
  mail: Mail
};

export function Icon({ name, size = 18, color = 'currentColor', ...rest }) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp size={size} color={color} strokeWidth={1.75} aria-hidden="true" {...rest} />;
}
