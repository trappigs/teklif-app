export interface Land {
  id: number;
  title: string;
  location: string;
  size: string;
  price: number;
  imageUrl: string;
  description: string;
  features: string[];
  ada?: string;
  parsel?: string;
}

export interface ProposalItem {
  land: Land;
  offerPrice: number; // For backward compatibility if needed, but mainly we use options
  cashPrice: number;
  ada: string;
  parsel: string;
  area: string;
  option1: {
    price: number;
    downPayment: number;
    installmentCount: number;
  };
  option2: {
    price: number;
    downPayment: number;
    installmentCount: number;
  };
}

export interface Proposal {
  id: string;
  customerName: string;
  senderName?: string;
  senderTitle?: string;
  senderPhone?: string;
  senderImage?: string;
  validUntil: string;
  createdAt: string;
  createdBy: string; // Username of the creator
  items: ProposalItem[];
  globalNotes?: string;
}

export interface User {
  username: string;
  password?: string; // Only for auth, removed in client
  name: string;
  title: string;
  phone: string;
  image: string;
}

export interface Settings {
  senderName: string;
  senderTitle: string;
  senderPhone: string;
  senderImage?: string;
}
