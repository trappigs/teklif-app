import json
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
except:
    print("Warning: .env.local not found.")

SUPABASE_URL = env_vars.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = env_vars.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("HATA: .env.local bilgileri eksik!")
    exit()

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# User provided URLs
urls = [
    "http://bereketlitopraklar.com.tr/alhan.jpg",
    "http://bereketlitopraklar.com.tr/asagimusalar.jpg",
    "http://bereketlitopraklar.com.tr/baliklidere.jpg",
    "http://bereketlitopraklar.com.tr/bardakci.jpg",
    "http://bereketlitopraklar.com.tr/begel.jpg",
    "http://bereketlitopraklar.com.tr/boyacik.jpg",
    "http://bereketlitopraklar.com.tr/buyukpinar.jpg",
    "http://bereketlitopraklar.com.tr/carsi.jpg",
    "http://bereketlitopraklar.com.tr/celikler.jpg",
    "http://bereketlitopraklar.com.tr/cesmealti.jpg",
    "http://bereketlitopraklar.com.tr/dagyenice.jpg",
    "http://bereketlitopraklar.com.tr/davutlar.jpg",
    "http://bereketlitopraklar.com.tr/demirkapi.jpg",
    "http://bereketlitopraklar.com.tr/derecikoren.webp",
    "http://bereketlitopraklar.com.tr/dinkciler.jpg",
    "http://bereketlitopraklar.com.tr/erdel.jpg",
    "http://bereketlitopraklar.com.tr/gedelek.jpg",
    "http://bereketlitopraklar.com.tr/gozlucayir.jpg",
    "http://bereketlitopraklar.com.tr/huduk.jpg",
    "http://bereketlitopraklar.com.tr/ibirler.jpeg",
    "http://bereketlitopraklar.com.tr/inkoy.jpg",
    "http://bereketlitopraklar.com.tr/karakoy.png",
    "http://bereketlitopraklar.com.tr/karsiyaka.jpg",
    "http://bereketlitopraklar.com.tr/katiralani.jpg",
    "http://bereketlitopraklar.com.tr/kayaeli.jpg",
    "http://bereketlitopraklar.com.tr/kayapa.jpg",
    "http://bereketlitopraklar.com.tr/kemaliye.jpg",
    "http://bereketlitopraklar.com.tr/killik.jpg",
    "http://bereketlitopraklar.com.tr/kinik.jpg",
    "http://bereketlitopraklar.com.tr/kirmizilar.jpg",
    "http://bereketlitopraklar.com.tr/kocasinan.jpg",
    "http://bereketlitopraklar.com.tr/kulakpinar.jpeg",
    "http://bereketlitopraklar.com.tr/kulalar.jpg",
    "http://bereketlitopraklar.com.tr/lalasahin.jpg",
    "http://bereketlitopraklar.com.tr/maltepe.jpg",
    "http://bereketlitopraklar.com.tr/mihaliccik.jpg",
    "http://bereketlitopraklar.com.tr/minnetler.png",
    "http://bereketlitopraklar.com.tr/muradiye.jpg",
    "http://bereketlitopraklar.com.tr/naipli.jpg",
    "http://bereketlitopraklar.com.tr/selimaga.jpg",
    "http://bereketlitopraklar.com.tr/seyitler.jpg",
    "http://bereketlitopraklar.com.tr/sove.jpg",
    "http://bereketlitopraklar.com.tr/Sultancayir1.jpg",
    "http://bereketlitopraklar.com.tr/tatlipinar.jpg",
    "http://bereketlitopraklar.com.tr/tepecik.jpg",
    "http://bereketlitopraklar.com.tr/toybelen.jpg",
    "http://bereketlitopraklar.com.tr/turplu.jpg",
    "http://bereketlitopraklar.com.tr/tutenli.jpg",
    "http://bereketlitopraklar.com.tr/umiteli.jpg",
    "http://bereketlitopraklar.com.tr/yesilyurt.jpg",
    "http://bereketlitopraklar.com.tr/yukarimusalar.jpg"
]

def turkish_to_slug(text):
    tr_map = str.maketrans("çğışüöÇĞİŞÜÖ", "cgisuocgisuo")
    return text.translate(tr_map).lower().replace(" ", "").replace("-", "")

def run():
    print("Arsalar güncelleniyor...")
    res = supabase.table('lands').select('*').execute()
    url_map = {u.split('/')[-1].split('.')[0].lower(): u for u in urls}
    
    count = 0
    for l in res.data:
        m_raw = l['location'].split(',')[0].strip()
        m_slug = turkish_to_slug(m_raw)
        m_url = url_map.get(m_slug)
        if m_slug == "sultancayir": m_url = "http://bereketlitopraklar.com.tr/Sultancayir1.jpg"
        
        supabase.table('lands').update({"image_url": m_url or ""}).eq('id', l['id']).execute()
        if m_url: count += 1
        print(f"{m_raw}: {'OK' if m_url else 'Gorsel Yok'}")
    
    print(f"Bitti. {count} gorsel güncellendi.")

if __name__ == "__main__":
    run()
