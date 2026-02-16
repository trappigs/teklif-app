import json
import os
import random
from supabase import create_client, Client

# Manual Env Load
env_vars = {}
try:
    with open('.env.local', 'r') as f:
        for line in f:
            if '=' in line:
                key, value = line.strip().split('=', 1)
                env_vars[key] = value
except:
    print("Warning: .env.local not found.")

SUPABASE_URL = env_vars.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = env_vars.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY or 'your-project-url' in SUPABASE_URL:
    print("HATA: .env.local bilgileri eksik!")
    exit()

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

images = [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2664&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516216628259-2225250e87ea?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2574&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2664&auto=format&fit=crop"
]

def seed_lands():
    print("Mevcut arsalar temizleniyor...")
    try:
        supabase.table('lands').delete().neq('id', -1).execute()
        print("Tablo temizlendi.")
    except Exception as e:
        print(f"Temizleme hatası: {e}")

    print("Yeni liste işleniyor...")
    
    lands_to_insert = []
    
    # Read from clean_data.txt
    try:
        with open('clean_data.txt', 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print("HATA: clean_data.txt dosyası bulunamadı!")
        return

    # Use a set to avoid duplicates in the raw list itself
    seen_locations = set()

    for line in lines:
        parts = line.strip().split('\t')
        if len(parts) < 3:
            # Maybe split by space if tab fails? Or skip
            continue
            
        city = parts[0].strip()
        district = parts[1].strip()
        neighborhood = parts[2].strip()
        
        # Unique key
        key = f"{city}-{district}-{neighborhood}"
        if key in seen_locations:
            continue
        seen_locations.add(key)

        # Generate Random Data
        size_val = random.randint(300, 5000)
        ada = str(random.randint(101, 999))
        parsel = str(random.randint(1, 50))
        
        # Price Calculation: Base 1500 TL/m2 + random variation (-200 to +500)
        unit_price = 1500 + random.randint(-200, 500)
        estimated_price = size_val * unit_price
        # Round to nearest 10.000 for cleaner look
        estimated_price = round(estimated_price / 10000) * 10000

        land = {
            "title": f"Yatırımlık Fırsat - {district} / {neighborhood}",
            "location": f"{neighborhood}, {district}, {city}",
            "size": f"{size_val:,.0f} m²".replace(",", "."),
            "price": estimated_price,
            "image_url": "", # No more random images
            "description": f"{city} ili, {district} ilçesi, {neighborhood} mahallesinde bulunan bu {size_val} m² büyüklüğündeki arazi, geleceği parlak ve yatırıma son derece uygundur. Doğa ile iç içe, ulaşımı kolay.",
            "features": ["Müstakil Tapu", "Yola Yakın", "Doğa Manzaralı", "Yatırımlık", "Elektrik Yakın"],
            "ada": ada,
            "parsel": parsel
        }
        lands_to_insert.append(land)

    # Insert into Supabase
    if lands_to_insert:
        data, count = supabase.table('lands').insert(lands_to_insert).execute()
        print(f"✅ {len(lands_to_insert)} adet temiz kayıt eklendi.")
    else:
        print("Eklenecek veri bulunamadı.")

def seed_users():
    # Users remain the same
    print("Kullanıcılar kontrol ediliyor...")
    users = [
        {"username": "furkan", "password": "Fhosgor123+", "name": "Furkan", "title": "Gayrimenkul Yatırım Uzmanı", "phone": "+90 555 000 00 01", "image": ""},
        {"username": "guray", "password": "Guray123+", "name": "Güray", "title": "Gayrimenkul Yatırım Uzmanı", "phone": "+90 555 000 00 02", "image": ""},
        {"username": "bilal", "password": "Aktas2151+", "name": "Bilal", "title": "Gayrimenkul Yatırım Uzmanı", "phone": "+90 555 000 00 03", "image": ""},
        {"username": "hasan", "password": "Hasan352+", "name": "Hasan", "title": "Gayrimenkul Yatırım Uzmanı", "phone": "+90 555 000 00 04", "image": ""},
        {"username": "hakan", "password": "Hakanyant4124+", "name": "Hakan", "title": "Gayrimenkul Yatırım Uzmanı", "phone": "+90 555 000 00 05", "image": ""},
        {"username": "semih", "password": "Aygun125+", "name": "Semih", "title": "Gayrimenkul Yatırım Uzmanı", "phone": "+90 555 000 00 06", "image": ""},
        {"username": "admin", "password": "Merensak2151+", "name": "Yönetici", "title": "Sistem Yöneticisi", "phone": "+90 555 000 00 07", "image": ""}
    ]
    
    supabase.table('users').upsert(users, on_conflict='username').execute()
    print("✅ Kullanıcılar güncel.")

if __name__ == "__main__":
    seed_users()
    seed_lands()
