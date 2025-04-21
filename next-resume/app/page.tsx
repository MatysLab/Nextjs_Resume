import Header from "./components/Header";
import HomeDisplay from "./components/HomeDisplay";
import BentoGrids from "./components/bentoGrids";
import Conveyor from "./components/ConveyorBanner";
import Link from "next/link";

const collectiblesWords = [
    "Beckett ",
    "Pokémon ",
    "Tissot ",
    "Rolex ",
    "CCG ",
    "Vintage ",
    "Graded ",
    "Trading Cards ",
    "Watches ",
    "Memorabilia ",
    "Limited Edition ",
    "Rare ",
    "Collectibles ",
    "PSA ",
    "BGS ",
    "MTG ",
    "Sports Cards ",
    "Autographs ",
    "Luxury ",
    "Omega ",
    "Stocks ",
    "Assets",
    "Crypto ",
    "NFT  "
];



export default function Home() {
  return (
    <main>
        <div>
            <Header/>
            <HomeDisplay/>
            <Conveyor words={[collectiblesWords]} speed={60} spacing={2} direction="right"/>
            <BentoGrids/>
        </div>
    </main>
  );
}
