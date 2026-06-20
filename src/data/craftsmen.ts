export interface Craftsman {
  id: string;
  name: string;
  specialty: string;
  location: string;
  years: string;
  bioShort: string;
  bioFull: string;
  image: string;
}

export const craftsmen: Craftsman[] = [
  {
    id: "1",
    name: "Abdul Rehman Khan",
    specialty: "Master Carpet Weaver",
    location: "Baramulla, Kashmir",
    years: "45+ years",
    bioShort:
      "Began weaving at age 9 under his father's guidance. His silk carpets have been exhibited in Paris, Tokyo, and New York.",
    bioFull:
      "Abdul began weaving at age 9 under his father's guidance in a small village outside Baramulla. His double-knotted silk carpets have been exhibited in Paris, Tokyo, and New York. Each carpet takes 8–24 months to complete, with patterns drawn entirely from memory — passed down through five generations of weavers.",
    image: "https://picsum.photos/seed/artisan1/600/800",
  },
  {
    id: "2",
    name: "Fatima Bano",
    specialty: "Pashmina Embroiderer (Sozni)",
    location: "Srinagar, Kashmir",
    years: "30+ years",
    bioShort:
      "One of only 200 remaining masters of Sozni — a needle art so fine the thread is invisible to the naked eye.",
    bioFull:
      "Fatima is one of only 200 remaining masters of Sozni embroidery — a needle art so fine the thread is invisible to the naked eye. She trained under her mother and grandmother, and her shawls are indistinguishable from heirloom pieces. A single shawl can take 2–3 years to embroider.",
    image: "https://picsum.photos/seed/artisan2/600/800",
  },
  {
    id: "3",
    name: "Mohammad Yusuf Waza",
    specialty: "Paper Maché Artist",
    location: "Old City, Srinagar",
    years: "35+ years",
    bioShort:
      "Hand-molds every piece from waste paper pulp; paints with squirrel-hair brushes so fine they hold a single hair.",
    bioFull:
      "Working from a workshop older than his grandfather, Yusuf hand-molds every piece from a pulp of waste paper and rice straw. His boxes are painted with Mughal floral motifs using squirrel-hair brushes so fine they hold a single hair. Each piece is finished with 20 layers of natural lacquer.",
    image: "https://picsum.photos/seed/artisan3/600/800",
  },
  {
    id: "4",
    name: "Gulshan Ara",
    specialty: "Namdah Felt Craftsperson",
    location: "Ganderbal, Kashmir",
    years: "20+ years",
    bioShort:
      "Revived the nearly-lost Namdah felt-making tradition in her village, training 30 women in the craft.",
    bioFull:
      "Gulshan revived the nearly-lost art of Namdah felt-making in her village, training 30 other women in the craft. Her floor coverings blend traditional Kashmiri motifs with contemporary color palettes sought by interior designers worldwide.",
    image: "https://picsum.photos/seed/artisan4/600/800",
  },
  {
    id: "5",
    name: "Bashir Ahmad Dar",
    specialty: "Walnut Wood Carver",
    location: "Haft Chinar, Srinagar",
    years: "50+ years",
    bioShort:
      "Six generations of walnut wood carvers. His lattice boxes use traditional joinery — no nails, no glue.",
    bioFull:
      "Bashir's family has carved walnut wood for six generations. His intricate lattice boxes and decorative screens require no nails or glue — only traditional joinery perfected over centuries of woodworking. The walnut wood he uses is aged for at least 10 years before carving begins.",
    image: "https://picsum.photos/seed/artisan5/600/800",
  },
  {
    id: "6",
    name: "Rafiqa Begum",
    specialty: "Kani Shawl Weaver",
    location: "Kanihama, Kashmir",
    years: "25+ years",
    bioShort:
      "Keeps alive the 400-year-old Kani tradition. A single shawl uses 240+ wooden spools and can take 18 months.",
    bioFull:
      "Kani shawls take up to 18 months to weave using small wooden spools (kanis) instead of a shuttle. Rafiqa is one of the few weavers keeping this 400-year-old tradition alive, and her work has been documented by the Indian government as a national heritage craft.",
    image: "https://picsum.photos/seed/artisan6/600/800",
  },
];

export function getCraftsmanById(id: string) {
  return craftsmen.find((c) => c.id === id);
}
