import pandas as pd
import json
import os
import random

# File paths
excel_path = 'satis-list.xlsx'
json_path = os.path.join('data', 'lands.json')

# Random nature images for variety
images = [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2664&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516216628259-2225250e87ea?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2574&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2664&auto=format&fit=crop"
]

def process_data():
    # Read Excel
    try:
        df = pd.read_excel(excel_path)
    except Exception as e:
        print(f"Error reading Excel: {e}")
        return

    # Normalize column names (strip spaces)
    df.columns = df.columns.str.strip()

    # Drop duplicates based on Region (City, District, Neighborhood)
    # This ensures only one portfolio item per region as requested
    unique_df = df.drop_duplicates(subset=['İL', 'İLÇE', 'MAHALLE']).copy()
    
    # Read existing JSON to handle IDs correctly
    existing_lands = []
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            try:
                existing_lands = json.load(f)
            except:
                existing_lands = []

    # Determine start ID
    next_id = 1
    if existing_lands:
        next_id = max(l['id'] for l in existing_lands) + 1

    new_lands = []
    
    for index, row in unique_df.iterrows():
        # Handle NaN values
        city = str(row['İL']) if pd.notna(row['İL']) else ""
        district = str(row['İLÇE']) if pd.notna(row['İLÇE']) else ""
        neighborhood = str(row['MAHALLE']) if pd.notna(row['MAHALLE']) else ""
        size_val = row['ALAN'] if pd.notna(row['ALAN']) else 0
        ada = str(int(row['ADA'])) if pd.notna(row['ADA']) else ""
        parsel = str(int(row['PARSEL'])) if pd.notna(row['PARSEL']) else ""

        # Estimate price (since not in excel) -> Size * 1500 TL base rate
        estimated_price = int(size_val * 1500)
        
        # Round price to nearest thousand for cleaner look
        estimated_price = round(estimated_price / 1000) * 1000

        land = {
            "id": next_id,
            "title": f"Yatırımlık Fırsat - {district}",
            "location": f"{neighborhood}, {district}, {city}",
            "size": f"{size_val:,.0f} m²".replace(",", "."),
            "price": estimated_price,
            "imageUrl": random.choice(images),
            "description": f"{city} {district} {neighborhood} mevkiinde, {size_val} m² büyüklüğünde, geleceği parlak, yatırıma uygun arazi.",
            "features": ["Müstakil Tapu", "Yola Yakın", "Doğa Manzaralı", "Yatırımlık"],
            "ada": ada,
            "parsel": parsel
        }
        
        new_lands.append(land)
        next_id += 1

    # Merge lists (Keep existing manual entries, add new excel imports)
    # Check if we should avoid duplicates with existing items by title/location?
    # For now, we assume user wants to ADD these.
    
    final_list = existing_lands + new_lands

    # Write back to JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, ensure_ascii=False, indent=2)

    print(f"Başarıyla eklendi: {len(new_lands)} yeni bölge portföye dahil edildi.")

if __name__ == "__main__":
    process_data()
