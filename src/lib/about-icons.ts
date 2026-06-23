import type { AboutIcon } from "@/lib/site-content";
import { Shield, Users, Truck, Sparkles, Heart, Hand, Leaf } from "lucide-react";

export const aboutIconMap: Record<AboutIcon, typeof Shield> = {
  shield: Shield,
  users: Users,
  truck: Truck,
  sparkles: Sparkles,
  heart: Heart,
  hand: Hand,
  leaf: Leaf,
};

export const aboutIconOptions: { value: AboutIcon; label: string }[] = [
  { value: "shield", label: "Shield" },
  { value: "users", label: "Users" },
  { value: "truck", label: "Truck" },
  { value: "sparkles", label: "Sparkles" },
  { value: "heart", label: "Heart" },
  { value: "hand", label: "Hand" },
  { value: "leaf", label: "Leaf" },
];
