'use server';

import { supabase } from '@/lib/supabase';
import { Land, Proposal, Settings, User } from '@/types';

// --- User & Profile Actions ---

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('users').select('*');
  if (error) console.error('getUsers error:', error);
  return (data as User[]) || [];
}

export async function getUserProfile(username: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();
  
  if (error) return null;
  return data as User;
}

export async function saveUserProfile(username: string, profile: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(profile)
    .eq('username', username)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Map User profile to Settings
export async function getSettings(username: string): Promise<Settings> {
  const user = await getUserProfile(username);
  if (user) {
    return {
      senderName: user.name,
      senderTitle: user.title,
      senderPhone: user.phone,
      senderImage: user.image
    };
  }
  return {
    senderName: "Ahmet Yılmaz",
    senderTitle: "Gayrimenkul Yatırım Uzmanı",
    senderPhone: "+90 (555) 123 45 67",
    senderImage: ""
  };
}

export async function saveSettings(username: string, settings: Settings) {
  return await saveUserProfile(username, {
    name: settings.senderName,
    title: settings.senderTitle,
    phone: settings.senderPhone,
    image: settings.senderImage
  });
}

// --- Land Actions ---

export async function getLands(search?: string, limit?: number): Promise<Land[]> {
  let query = supabase.from('lands').select('*').order('id', { ascending: false });

  if (search) {
    // Basic text search on title or location (case-insensitive via ilike)
    query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('getLands error:', error);
    return [];
  }

  // Map database fields (snake_case) to typescript interface (camelCase) if needed
  // Since we defined the table simply, let's assume they match for now or map manually.
  // Actually, in the SQL schema I used snake_case (image_url). 
  // We need to map `image_url` to `imageUrl` etc.
  
  return data.map((item: any) => ({
    ...item,
    imageUrl: item.image_url, // Map image_url -> imageUrl
    // others match (title, location, size, price, description, features, ada, parsel)
  }));
}

export async function addLand(land: Omit<Land, 'id'>) {
  // Convert camelCase to snake_case for DB
  const dbLand = {
    title: land.title,
    location: land.location,
    size: land.size,
    price: land.price,
    image_url: land.imageUrl,
    description: land.description,
    features: land.features,
    ada: land.ada,
    parsel: land.parsel
  };

  const { data, error } = await supabase.from('lands').insert(dbLand).select().single();
  
  if (error) throw new Error(error.message);
  return { ...data, imageUrl: data.image_url };
}

export async function updateLand(land: Land) {
  const dbLand = {
    title: land.title,
    location: land.location,
    size: land.size,
    price: land.price,
    image_url: land.imageUrl,
    description: land.description,
    features: land.features,
    ada: land.ada,
    parsel: land.parsel
  };

  const { data, error } = await supabase
    .from('lands')
    .update(dbLand)
    .eq('id', land.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { ...data, imageUrl: data.image_url };
}

export async function deleteLand(id: number) {
  const { error } = await supabase.from('lands').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

// --- Proposal Actions ---

export async function getProposals(username?: string): Promise<Proposal[]> {
  let query = supabase.from('proposals').select('*').order('created_at', { ascending: false });

  const { data, error } = await query;
  
  if (error) {
    console.error('getProposals error:', error);
    return [];
  }

  let proposals: Proposal[] = data.map((item: any) => ({
    id: item.id,
    customerName: item.customer_name,
    senderName: item.sender_name,
    senderTitle: item.sender_title,
    senderPhone: item.sender_phone,
    senderImage: item.sender_image,
    validUntil: item.valid_until,
    createdAt: item.created_at,
    createdBy: item.created_by,
    items: item.items, // JSONB comes as object/array automatically
    globalNotes: item.global_notes
  }));

  // Filtering Logic (Client-side logic applied here or could be in DB query)
  // Super users who can see everything
  const superUsers = ['admin', 'bilal', 'furkan'];

  // If username is provided and NOT a super user, filter by their username
  if (username && !superUsers.includes(username.toLocaleLowerCase('tr-TR'))) {
    proposals = proposals.filter(p => p.createdBy === username);
  }

  return proposals;
}

export async function saveProposal(data: Omit<Proposal, 'id' | 'createdAt'>) {
  const id = Math.random().toString(36).substring(2, 10);
  
  const dbProposal = {
    id: id,
    customer_name: data.customerName,
    sender_name: data.senderName,
    sender_title: data.senderTitle,
    sender_phone: data.senderPhone,
    sender_image: data.senderImage,
    valid_until: data.validUntil,
    created_by: data.createdBy,
    items: data.items, // JSONB
    global_notes: data.globalNotes,
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from('proposals').insert(dbProposal);

  if (error) throw new Error(error.message);
  return id;
}

export async function getProposal(id: string): Promise<Proposal | null> {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;

  // Map back to camelCase
  return {
    id: data.id,
    customerName: data.customer_name,
    senderName: data.sender_name,
    senderTitle: data.sender_title,
    senderPhone: data.sender_phone,
    senderImage: data.sender_image,
    validUntil: data.valid_until,
    createdAt: data.created_at,
    createdBy: data.created_by,
    items: data.items,
    globalNotes: data.global_notes
  };
}