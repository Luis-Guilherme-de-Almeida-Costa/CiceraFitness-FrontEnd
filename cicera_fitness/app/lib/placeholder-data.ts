import { Product, CartItem } from "@/app/lib/definitions";

const CATEGORIES = [
  { name: "Leggings", img: "https://images.unsplash.com/photo-1531520563951-4c0e3d3fcacc?w=400&h=500&fit=crop&auto=format", count: 48 },
  { name: "Tops", img: "https://images.unsplash.com/photo-1683848644078-f339179c4ff6?w=400&h=500&fit=crop&auto=format", count: 36 },
  { name: "Shorts", img: "https://images.unsplash.com/photo-1683848644235-7ac932a8aaea?w=400&h=500&fit=crop&auto=format", count: 24 },
  { name: "Conjuntos", img: "https://images.unsplash.com/photo-1645810798586-08e892108d67?w=400&h=500&fit=crop&auto=format", count: 30 },
  { name: "Camisetas", img: "https://images.unsplash.com/photo-1649888381057-d5d03c105f82?w=400&h=500&fit=crop&auto=format", count: 22 },
  { name: "Acessórios", img: "https://images.unsplash.com/photo-1628258514268-391b356c6d07?w=400&h=500&fit=crop&auto=format", count: 15 },
];

const PRODUCTS: Product[] = [
  {
    id: 1, name: "Legging Power Sculpt", price: 189.90, originalPrice: 249.90,
    discount: 24, rating: 4.9, reviews: 312, badge: "Mais Vendido", category: "Leggings",
    img: "https://images.unsplash.com/photo-1531520563951-4c0e3d3fcacc?w=700&h=900&fit=crop&auto=format",
    imgs: [
      "https://images.unsplash.com/photo-1531520563951-4c0e3d3fcacc?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1649888317149-05d953c9fef8?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1584863495140-a320b13a11a8?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1628258514268-391b356c6d07?w=700&h=900&fit=crop&auto=format",
    ],
    sizes: ["P", "M", "G", "GG"], colors: ["#121212", "#2B2B2B", "#FFD400"],
    sku: "CF-LEG-001", stock: 8,
    description: "A Legging Power Sculpt foi desenvolvida com tecnologia de compressão progressiva que modela e sustenta, oferecendo suporte ideal para treinos intensos. O tecido sculpting de alta performance garante conforto superior e liberdade total de movimento.",
  },
  {
    id: 2, name: "Top Energize X", price: 119.90, originalPrice: 159.90,
    discount: 25, rating: 4.8, reviews: 198, badge: "Novidade", category: "Tops",
    img: "https://images.unsplash.com/photo-1683848644078-f339179c4ff6?w=700&h=900&fit=crop&auto=format",
    imgs: [
      "https://images.unsplash.com/photo-1683848644078-f339179c4ff6?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1683848644087-c3cb69b77d4f?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1645810798586-08e892108d67?w=700&h=900&fit=crop&auto=format",
    ],
    sizes: ["P", "M", "G"], colors: ["#121212", "#ffffff"],
    sku: "CF-TOP-002", stock: 14,
    description: "Top de alta performance com suporte médio, ideal para yoga, pilates e treinos leves. Alças reguláveis e bojo removível para mais versatilidade.",
  },
  {
    id: 3, name: "Conjunto Fierce", price: 279.90, originalPrice: 389.90,
    discount: 28, rating: 5.0, reviews: 87, badge: "Destaque", category: "Conjuntos",
    img: "https://images.unsplash.com/photo-1645810798586-08e892108d67?w=700&h=900&fit=crop&auto=format",
    imgs: [
      "https://images.unsplash.com/photo-1645810798586-08e892108d67?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1649888381057-d5d03c105f82?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1531520563951-4c0e3d3fcacc?w=700&h=900&fit=crop&auto=format",
    ],
    sizes: ["P", "M", "G", "GG", "XGG"], colors: ["#121212", "#FFD400"],
    sku: "CF-CON-003", stock: 3,
    description: "Conjunto completo top + legging para quem quer arrasar do treino ao street style. Tecido premium com proteção UV50+ e secagem ultra-rápida.",
  },
  {
    id: 4, name: "Short Run & Go", price: 99.90, originalPrice: 139.90,
    discount: 29, rating: 4.7, reviews: 256, badge: null, category: "Shorts",
    img: "https://images.unsplash.com/photo-1683848644235-7ac932a8aaea?w=700&h=900&fit=crop&auto=format",
    imgs: [
      "https://images.unsplash.com/photo-1683848644235-7ac932a8aaea?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1770177264833-3207a54a487f?w=700&h=900&fit=crop&auto=format",
    ],
    sizes: ["P", "M", "G"], colors: ["#121212", "#2B2B2B"],
    sku: "CF-SHO-004", stock: 21,
    description: "Short leve e confortável, perfeito para corrida, ciclismo e crossfit. Elástico de alta fixação e bolso traseiro com zíper.",
  },
  {
    id: 5, name: "Legging Flow Yoga", price: 159.90, originalPrice: 199.90,
    discount: 20, rating: 4.8, reviews: 174, badge: null, category: "Leggings",
    img: "https://images.unsplash.com/photo-1649888317149-05d953c9fef8?w=700&h=900&fit=crop&auto=format",
    imgs: [
      "https://images.unsplash.com/photo-1649888317149-05d953c9fef8?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1649888381057-d5d03c105f82?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1628258514268-391b356c6d07?w=700&h=900&fit=crop&auto=format",
    ],
    sizes: ["P", "M", "G", "GG"], colors: ["#121212", "#6B7280"],
    sku: "CF-LEG-005", stock: 19,
    description: "Legging de cintura alta com tecido ultra-macio para yoga e pilates. Sem costura lateral para máximo conforto durante posturas longas.",
  },
  {
    id: 6, name: "Jaqueta Wind Pro", price: 229.90, originalPrice: 299.90,
    discount: 23, rating: 4.6, reviews: 92, badge: "Lançamento", category: "Jaquetas",
    img: "https://images.unsplash.com/photo-1619795811317-0e25ba7eb07d?w=700&h=900&fit=crop&auto=format",
    imgs: [
      "https://images.unsplash.com/photo-1619795811317-0e25ba7eb07d?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1603455778956-d71832eafa4e?w=700&h=900&fit=crop&auto=format",
    ],
    sizes: ["P", "M", "G", "GG"], colors: ["#121212", "#2B2B2B", "#ffffff"],
    sku: "CF-JAC-006", stock: 7,
    description: "Jaqueta corta-vento com forro térmico leve, ideal para treinos ao ar livre. Tecnologia Wind Block e bolsos laterais com zíper.",
  },
  {
    id: 7, name: "Top Vital Strappy", price: 109.90, originalPrice: 149.90,
    discount: 27, rating: 4.9, reviews: 143, badge: null, category: "Tops",
    img: "https://images.unsplash.com/photo-1628258514268-391b356c6d07?w=700&h=900&fit=crop&auto=format",
    imgs: [
      "https://images.unsplash.com/photo-1628258514268-391b356c6d07?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1683848644078-f339179c4ff6?w=700&h=900&fit=crop&auto=format",
    ],
    sizes: ["P", "M", "G"], colors: ["#121212", "#FFD400"],
    sku: "CF-TOP-007", stock: 12,
    description: "Top strappy com design moderno e suporte alto para treinos de alta intensidade. Alças cruzadas nas costas para máxima fixação.",
  },
  {
    id: 8, name: "Conjunto Bold Move", price: 299.90, originalPrice: 419.90,
    discount: 29, rating: 4.8, reviews: 61, badge: "Promoção", category: "Conjuntos",
    img: "https://images.unsplash.com/photo-1649888381057-d5d03c105f82?w=700&h=900&fit=crop&auto=format",
    imgs: [
      "https://images.unsplash.com/photo-1649888381057-d5d03c105f82?w=700&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1645810798586-08e892108d67?w=700&h=900&fit=crop&auto=format",
    ],
    sizes: ["P", "M", "G", "GG"], colors: ["#121212"],
    sku: "CF-CON-008", stock: 0,
    description: "Conjunto bold com estampa exclusiva da coleção verão 2025. Tecido respirável com tecnologia anti-odor e proteção UV50+.",
  },
];

const NEW_ARRIVALS: Product[] = [
  { id: 101, name: "Legging Ribbed Edition", price: 179.90, originalPrice: 219.90, discount: 18, rating: 4.7, reviews: 23, badge: "Novo", img: "https://images.unsplash.com/photo-1584863495140-a320b13a11a8?w=400&h=520&fit=crop&auto=format", sizes: ["P","M","G","GG"], colors: ["#121212"], category: "Leggings", sku: "CF-LEG-101", stock: 10 },
  { id: 102, name: "Top Mesh Cutout", price: 129.90, originalPrice: 169.90, discount: 24, rating: 4.8, reviews: 17, badge: "Novo", img: "https://images.unsplash.com/photo-1770177264833-3207a54a487f?w=400&h=520&fit=crop&auto=format", sizes: ["P","M","G"], colors: ["#121212","#FFD400"], category: "Tops", sku: "CF-TOP-102", stock: 6 },
  { id: 103, name: "Short Bike Compressor", price: 109.90, originalPrice: 149.90, discount: 27, rating: 4.6, reviews: 11, badge: "Novo", img: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=400&h=520&fit=crop&auto=format", sizes: ["P","M","G","GG"], colors: ["#121212"], category: "Shorts", sku: "CF-SHO-103", stock: 15 },
  { id: 104, name: "Conjunto Minimal", price: 259.90, originalPrice: 339.90, discount: 24, rating: 4.9, reviews: 8, badge: "Novo", img: "https://images.unsplash.com/photo-1631366993517-3b971222117d?w=400&h=520&fit=crop&auto=format", sizes: ["P","M","G","GG"], colors: ["#121212","#2B2B2B"], category: "Conjuntos", sku: "CF-CON-104", stock: 4 },
  { id: 105, name: "Legging Ultra Shine", price: 199.90, originalPrice: 259.90, discount: 23, rating: 4.8, reviews: 29, badge: "Novo", img: "https://images.unsplash.com/photo-1603455778956-d71832eafa4e?w=400&h=520&fit=crop&auto=format", sizes: ["P","M","G"], colors: ["#121212","#6B7280"], category: "Leggings", sku: "CF-LEG-105", stock: 9 },
];

const TESTIMONIALS = [
  { name: "Rafaela M.", city: "São Paulo, SP", rating: 5, text: "Comprei a legging Power Sculpt e não largo mais. A qualidade é incrível, sustenta tudo e não deforma nem depois de mil lavagens. Virei fã!", avatar: "R" },
  { name: "Bianca T.", city: "Rio de Janeiro, RJ", rating: 5, text: "Entrega super rápida e a roupa chegou melhor do que esperava. O tecido é premium de verdade. Já fiz o segundo pedido!", avatar: "B" },
  { name: "Camila S.", city: "Belo Horizonte, MG", rating: 5, text: "O conjunto Fierce é lindo! Usei na academia e fui parada várias vezes. Preço justo para a qualidade. Recomendo muito!", avatar: "C" },
  { name: "Juliana P.", city: "Curitiba, PR", rating: 4, text: "Atendimento excelente, tive uma dúvida no tamanho e me responderam na hora. A blusa ficou perfeita. Voltarei sempre.", avatar: "J" },
];

const INSTAGRAM_IMGS = [
  "https://images.unsplash.com/photo-1649888317149-05d953c9fef8?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1683848644235-7ac932a8aaea?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1603455778956-d71832eafa4e?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1645810798586-08e892108d67?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1584863495140-a320b13a11a8?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1628258514268-391b356c6d07?w=300&h=300&fit=crop&auto=format",
];

const PRODUCT_REVIEWS = [
  { name: "Letícia A.", date: "12 jun 2025", rating: 5, text: "Simplesmente perfeita! O tecido é de altíssima qualidade, não transparece e sustenta muito bem. Já usei em 3 treinos seguidos e continua nova. Super recomendo!", verified: true, helpful: 24, photo: "https://images.unsplash.com/photo-1531520563951-4c0e3d3fcacc?w=80&h=80&fit=crop&auto=format" },
  { name: "Fernanda C.", date: "28 mai 2025", rating: 5, text: "Comprei o tamanho M e ficou perfeito. A cintura alta dá um suporte incrível. Não desce durante o treino, mesmo nos exercícios mais intensos. Amei!", verified: true, helpful: 18, photo: null },
  { name: "Priscila M.", date: "5 mai 2025", rating: 4, text: "Produto excelente, só achei que o amarelo poderia ser um pouco mais vibrante na foto real. De resto, qualidade impecável e entrega antes do prazo.", verified: true, helpful: 7, photo: null },
  { name: "Amanda R.", date: "20 abr 2025", rating: 5, text: "Melhor legging que já tive. O modelado é incrível, deixa o corpo todo bem definido. O tecido não transparece nem um pouco. Já indiquei para todas as amigas!", verified: false, helpful: 31, photo: "https://images.unsplash.com/photo-1649888317149-05d953c9fef8?w=80&h=80&fit=crop&auto=format" },
];

const INITIAL_CART: CartItem[] = [
  { cartId: "ci-1", product: PRODUCTS[0], size: "M", color: "#121212", qty: 1 },
  { cartId: "ci-2", product: PRODUCTS[2], size: "G", color: "#FFD400", qty: 2 },
  { cartId: "ci-3", product: PRODUCTS[3], size: "P", color: "#121212", qty: 1 },
];

const MOCK_USER = {
  firstName: "Ana", lastName: "Silva", email: "ana.silva@email.com",
  phone: "(11) 98765-4321", cpf: "123.456.789-00", dob: "1994-03-15",
  gender: "Feminino", memberSince: "Janeiro de 2024", loyalty: "Gold Member",
  avatar: null as string | null,
};

const MOCK_ORDERS = [
  { id: "#CF-2025-8821", date: "10 jul 2025", status: "Entregue", items: 3, total: 389.70, img: "https://images.unsplash.com/photo-1531520563951-4c0e3d3fcacc?w=80&h=80&fit=crop&auto=format" },
  { id: "#CF-2025-7743", date: "28 jun 2025", status: "Em trânsito", items: 1, total: 189.90, img: "https://images.unsplash.com/photo-1683848644078-f339179c4ff6?w=80&h=80&fit=crop&auto=format" },
  { id: "#CF-2025-6612", date: "14 jun 2025", status: "Entregue", items: 2, total: 279.80, img: "https://images.unsplash.com/photo-1645810798586-08e892108d67?w=80&h=80&fit=crop&auto=format" },
  { id: "#CF-2025-5504", date: "02 mai 2025", status: "Cancelado", items: 1, total: 109.90, img: "https://images.unsplash.com/photo-1628258514268-391b356c6d07?w=80&h=80&fit=crop&auto=format" },
];

const MOCK_ADDRESSES = [
  { id: 1, nickname: "Casa", name: "Ana Silva", street: "Rua das Flores, 142, Apto 31", city: "São Paulo", state: "SP", zip: "01310-100", isDefault: true },
  { id: 2, nickname: "Trabalho", name: "Ana Silva", street: "Av. Paulista, 1000, 8º andar", city: "São Paulo", state: "SP", zip: "01310-200", isDefault: false },
];

const MOCK_PAYMENTS = [
  { id: 1, type: "Visa", last4: "4242", expiry: "08/27", isDefault: true, color: "#1A1F71" },
  { id: 2, type: "Mastercard", last4: "8851", expiry: "12/26", isDefault: false, color: "#EB001B" },
  { id: 3, type: "PIX", last4: null, expiry: null, isDefault: false, color: "#32BCAD" },
];

const MOCK_COUPONS = [
  { code: "GOLD20", discount: "20% OFF", expiry: "31 ago 2025", desc: "Exclusivo para membros Gold" },
  { code: "FRETE0", discount: "Frete Grátis", expiry: "15 ago 2025", desc: "Em qualquer pedido acima de R$99" },
];

const COLOR_LABELS: Record<string, string> = {
  "#121212": "Preto", "#2B2B2B": "Grafite", "#FFD400": "Amarelo",
  "#ffffff": "Branco", "#6B7280": "Cinza",
};

const COUPONS: Record<string, number> = {
  "CICERA10": 10, "FITNESS20": 20, "PROMO15": 15,
};
export { CATEGORIES, PRODUCTS, NEW_ARRIVALS, TESTIMONIALS, INSTAGRAM_IMGS, PRODUCT_REVIEWS, MOCK_USER, MOCK_ORDERS, MOCK_ADDRESSES, MOCK_PAYMENTS, MOCK_COUPONS, INITIAL_CART, COLOR_LABELS, COUPONS };