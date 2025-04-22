import { Metadata } from 'next';
import Header from "./components/client/Header";
import HomeDisplay from "./components/client/HomeDisplay";
import BentoGrids from "./components/client/bentoGrids";
import Conveyor from "./components/client/ConveyorBanner";

export const metadata: Metadata = {
  title: 'NuVault - Track, Sell, and Grow Your Collection',
  description: 'A platform for managing and growing your collection of collectibles, from trading cards to luxury watches.',
};

const COLLECTIBLES_WORDS: string[][] = [
  ["Beckett"],
  ["Pokémon"],
  ["Tissot"],
  ["Rolex"],
  ["CCG"],
  ["Vintage"],
  ["Graded"],
  ["Trading Cards"],
  ["Watches"],
  ["Memorabilia"],
  ["Limited Edition"],
  ["Rare"],
  ["Collectibles"],
  ["PSA"],
  ["BGS"],
  ["MTG"],
  ["Sports Cards"],
  ["Autographs"],
  ["Luxury"],
  ["Omega"],
  ["Stocks"],
  ["Assets"],
  ["Crypto"],
  ["NFT"]
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      <div className="w-full">
        <HomeDisplay />
        <BentoGrids />
        <Conveyor words={COLLECTIBLES_WORDS} />
      </div>
    </main>
  );
}
