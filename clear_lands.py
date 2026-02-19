import os
from supabase import create_client, Client

# Manual Env Load
env_vars = {}
try:
    with open('.env.local', 'r') as f:
        for line in f:
            if '=' in line:
                key, value = line.strip().split('=', 1)
                env_vars[key] = value
except Exception as e:
    print(f"Error: .env.local not found or readable: {e}")
    exit(1)

SUPABASE_URL = env_vars.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = env_vars.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("HATA: .env.local bilgileri eksik!")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def clear_portfolyo():
    print("Portföy bilgileri temizleniyor...")
    try:
        # Update all records (neq('id', -1) is a common way to target all if 'id' is always >= 0)
        # Using a bulk update setting the requested fields to empty or zero
        update_data = {
            "price": 0,
            "size": "",
            "ada": "",
            "parsel": "",
            "description": ""
        }
        
        # In Supabase-py, we usually need a filter for safety, neq('id', -1) works for all IDs.
        result = supabase.table('lands').update(update_data).neq('id', -1).execute()
        
        print(f"✅ İşlem tamamlandı. {len(result.data)} kayıt güncellendi.")
    except Exception as e:
        print(f"Hata oluştu: {e}")

if __name__ == "__main__":
    clear_portfolyo()
