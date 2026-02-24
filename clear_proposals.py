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

def clear_proposals():
    print("Teklifler temizleniyor...")
    try:
        # In Supabase-py, we usually need a filter for safety. 
        # Since 'id' is text/custom in proposals, we can use neq('id', '') to match all.
        result = supabase.table('proposals').delete().neq('id', '').execute()
        
        print(f"✅ İşlem tamamlandı. {len(result.data)} teklif silindi.")
    except Exception as e:
        print(f"Hata oluştu: {e}")

if __name__ == "__main__":
    clear_proposals()
