export default function Footer() {
  return (
    <footer className="bg-stone-50 text-stone-500 py-8 border-t border-stone-200">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xl font-serif font-bold text-brand-dark">
          <span className="text-brand">Bereketli</span>Topraklar
        </div>
        <div className="text-xs">
          &copy; {new Date().getFullYear()} Bereketli Topraklar Gayrimenkul Yatırım & Danışmanlık. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
