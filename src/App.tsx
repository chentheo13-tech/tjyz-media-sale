import { useState } from "react";
import type { CategoryId, Product } from "@/data/products";
import { productById } from "@/data/products";
import { BootLoader } from "@/components/layout/BootLoader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GrainOverlay } from "@/components/layout/GrainOverlay";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { BackToTop } from "@/components/layout/BackToTop";
import { Hero } from "@/components/sections/Hero";
import { FilmstripMarquee } from "@/components/sections/FilmstripMarquee";
import { ExhibitionGrid } from "@/components/product/ExhibitionGrid";
import { ProductDetailModal } from "@/components/product/ProductDetailModal";
import { JacketLookbook } from "@/components/product/spotlights/JacketLookbook";
import { PostcardShowcase } from "@/components/product/spotlights/PostcardShowcase";
import { LetterPaperStrip } from "@/components/product/spotlights/LetterPaperStrip";
import { LampSpotlight } from "@/components/product/spotlights/LampSpotlight";
import { CalendarSpotlight } from "@/components/product/spotlights/CalendarSpotlight";
import { AboutSale } from "@/components/sections/AboutSale";
import { AboutUs } from "@/components/sections/AboutUs";
import { XmtiEntry } from "@/components/sections/XmtiEntry";
import { CollabComingSoon } from "@/components/sections/CollabComingSoon";

export default function App() {
  const [booted, setBooted] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cat, setCat] = useState<CategoryId | "all">("all");

  const jacket = productById("jacket");
  const lamp = productById("night-light");
  const calendar = productById("calendar");

  /* Lookbook 仅在「全部 / 校园穿戴」时渲染，避免分类切换后的长空白 */
  const showLookbook = cat === "all" || cat === "apparel";

  return (
    <>
      <BootLoader onDone={() => setBooted(true)} />
      <GrainOverlay />
      <CustomCursor />
      <Navbar booted={booted} />

      <main>
        <Hero booted={booted} />
        <FilmstripMarquee />
        <ExhibitionGrid cat={cat} onCatChange={setCat} onOpen={setSelected} />
        {showLookbook && jacket && <JacketLookbook product={jacket} onOpen={setSelected} />}
        <PostcardShowcase onOpen={setSelected} />
        <LetterPaperStrip onOpen={setSelected} />
        {lamp && <LampSpotlight product={lamp} onOpen={setSelected} />}
        {calendar && <CalendarSpotlight product={calendar} onOpen={setSelected} />}
        <AboutSale />
        <AboutUs />
        <XmtiEntry />
        <CollabComingSoon />
      </main>

      <Footer />
      <BackToTop />
      <ProductDetailModal
        product={selected}
        onClose={() => setSelected(null)}
        onSwitch={setSelected}
      />
    </>
  );
}
