(function seedCatalog() {
  window.PokedexSeed = [
    {
      id: 1,
      name: "Bulbasaur",
      species: "Seed Pokemon",
      types: ["grass", "poison"],
      price: 39.9,
      stock: 7,
      rarity: "starter",
      region: "Kanto",
      featured: true,
      description:
        "Ideal para treinadores que querem um parceiro equilibrado e forte desde o primeiro ginásio.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      stats: { hp: 45, attack: 49, defense: 49, speed: 45 },
    },
    {
      id: 4,
      name: "Charmander",
      species: "Lizard Pokemon",
      types: ["fire"],
      price: 44.9,
      stock: 5,
      rarity: "starter",
      region: "Kanto",
      featured: true,
      description:
        "Quente, competitivo e excelente para composições agressivas no marketplace.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
      stats: { hp: 39, attack: 52, defense: 43, speed: 65 },
    },
    {
      id: 7,
      name: "Squirtle",
      species: "Tiny Turtle Pokemon",
      types: ["water"],
      price: 41.5,
      stock: 6,
      rarity: "starter",
      region: "Kanto",
      featured: true,
      description:
        "Defesa sólida e ótima escolha para jogadores que valorizam consistência.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
      stats: { hp: 44, attack: 48, defense: 65, speed: 43 },
    },
    {
      id: 25,
      name: "Pikachu",
      species: "Mouse Pokemon",
      types: ["electric"],
      price: 78.9,
      stock: 4,
      rarity: "popular",
      region: "Kanto",
      featured: true,
      description:
        "O item mais desejado da vitrine, com alto valor de revenda e ótima presença visual.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
      stats: { hp: 35, attack: 55, defense: 40, speed: 90 },
    },
    {
      id: 39,
      name: "Jigglypuff",
      species: "Balloon Pokemon",
      types: ["normal", "fairy"],
      price: 26.4,
      stock: 12,
      rarity: "common",
      region: "Kanto",
      featured: false,
      description:
        "Compacto, carismático e perfeito para coleções temáticas e presentes.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
      stats: { hp: 115, attack: 45, defense: 20, speed: 20 },
    },
    {
      id: 52,
      name: "Meowth",
      species: "Scratch Cat Pokemon",
      types: ["normal"],
      price: 29.9,
      stock: 9,
      rarity: "common",
      region: "Kanto",
      featured: false,
      description:
        "Favorito entre traders por ser barato, ágil e fácil de combinar em kits.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png",
      stats: { hp: 40, attack: 45, defense: 35, speed: 90 },
    },
    {
      id: 54,
      name: "Psyduck",
      species: "Duck Pokemon",
      types: ["water"],
      price: 34.2,
      stock: 8,
      rarity: "common",
      region: "Kanto",
      featured: false,
      description:
        "Visual icônico e comportamento imprevisível, ideal para coleções divertidas.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png",
      stats: { hp: 50, attack: 52, defense: 48, speed: 55 },
    },
    {
      id: 92,
      name: "Gastly",
      species: "Gas Pokemon",
      types: ["ghost", "poison"],
      price: 58.7,
      stock: 3,
      rarity: "rare",
      region: "Kanto",
      featured: true,
      description:
        "Modelo raro com alta procura por jogadores que montam times noturnos.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png",
      stats: { hp: 30, attack: 35, defense: 30, speed: 80 },
    },
    {
      id: 133,
      name: "Eevee",
      species: "Evolution Pokemon",
      types: ["normal"],
      price: 82.5,
      stock: 4,
      rarity: "popular",
      region: "Kanto",
      featured: true,
      description:
        "Extremamente versátil e sempre entre os mais favoritados do catálogo.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
      stats: { hp: 55, attack: 55, defense: 50, speed: 55 },
    },
    {
      id: 143,
      name: "Snorlax",
      species: "Sleeping Pokemon",
      types: ["normal"],
      price: 94.3,
      stock: 2,
      rarity: "rare",
      region: "Kanto",
      featured: true,
      description:
        "Peça premium para compradores que procuram status e resistência bruta.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
      stats: { hp: 160, attack: 110, defense: 65, speed: 30 },
    },
    {
      id: 152,
      name: "Chikorita",
      species: "Leaf Pokemon",
      types: ["grass"],
      price: 37.6,
      stock: 8,
      rarity: "starter",
      region: "Johto",
      featured: false,
      description:
        "Suporte consistente com apelo nostálgico para treinadores clássicos.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png",
      stats: { hp: 45, attack: 49, defense: 65, speed: 45 },
    },
    {
      id: 155,
      name: "Cyndaquil",
      species: "Fire Mouse Pokemon",
      types: ["fire"],
      price: 43.1,
      stock: 5,
      rarity: "starter",
      region: "Johto",
      featured: false,
      description:
        "Entrada segura para quem quer um Pokémon de fogo com ótimo custo-benefício.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/155.png",
      stats: { hp: 39, attack: 52, defense: 43, speed: 65 },
    },
    {
      id: 158,
      name: "Totodile",
      species: "Big Jaw Pokemon",
      types: ["water"],
      price: 45.8,
      stock: 6,
      rarity: "starter",
      region: "Johto",
      featured: false,
      description:
        "Agressivo e carismático, ótimo para carrinhos com foco em ataque físico.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png",
      stats: { hp: 50, attack: 65, defense: 64, speed: 43 },
    },
    {
      id: 172,
      name: "Pichu",
      species: "Tiny Mouse Pokemon",
      types: ["electric"],
      price: 31.5,
      stock: 10,
      rarity: "common",
      region: "Johto",
      featured: false,
      description:
        "Produto de entrada com alto apelo para iniciantes e colecionadores casuais.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png",
      stats: { hp: 20, attack: 40, defense: 15, speed: 60 },
    },
    {
      id: 175,
      name: "Togepi",
      species: "Spike Ball Pokemon",
      types: ["fairy"],
      price: 52.9,
      stock: 4,
      rarity: "rare",
      region: "Johto",
      featured: false,
      description:
        "Uma peça delicada e disputada, muito buscada para coleções premium.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png",
      stats: { hp: 35, attack: 20, defense: 65, speed: 20 },
    },
    {
      id: 196,
      name: "Espeon",
      species: "Sun Pokemon",
      types: ["psychic"],
      price: 112.4,
      stock: 2,
      rarity: "epic",
      region: "Johto",
      featured: true,
      description:
        "Produto de alto valor para vitrines premium e compradores exigentes.",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png",
      stats: { hp: 65, attack: 65, defense: 60, speed: 110 },
    },
  ];
})();
