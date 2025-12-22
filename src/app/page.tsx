import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { RecentNews } from "@/components/home/RecentNews";
import { Partners } from "@/components/home/Partners";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <RecentNews />
      <Partners />
    </div>
  );
}
