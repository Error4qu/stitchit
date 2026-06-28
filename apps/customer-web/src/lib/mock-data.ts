export interface Fabric {
  id: string;
  name: string;
  type: 'Wool' | 'Cotton' | 'Silk' | 'Linen' | 'Cashmere';
  description: string;
  pricePerMeter: number;
  color: string; // hex value for swatch
  colorName: string;
  material: string;
  inStock: boolean;
}

export interface Style {
  id: string;
  name: string;
  category: 'shirt' | 'sherwani' | 'pants' | 'jacket' | 'dress' | 'kurta';
  description: string;
  basePrice: number;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
}

export const MOCK_FABRICS: Fabric[] = [
  {
    id: 'fab-1',
    name: 'Royal Blue Italian Wool',
    type: 'Wool',
    description: 'Super 150s virgin wool sourced from Biella, Italy. Unparalleled drape and subtle natural sheen, perfect for year-round bespoke suiting.',
    pricePerMeter: 120,
    color: '#1A3A5F',
    colorName: 'Blue',
    material: '100% Virgin Wool',
    inStock: true,
  },
  {
    id: 'fab-2',
    name: 'Charcoal Grey Cashmere',
    type: 'Cashmere',
    description: 'Ultra-luxurious pure cashmere with a buttery soft hand-feel. Superior insulation with featherlight weight, ideal for overcoats and unstructured jackets.',
    pricePerMeter: 180,
    color: '#2C3033',
    colorName: 'Grey',
    material: '100% Mongolian Cashmere',
    inStock: true,
  },
  {
    id: 'fab-3',
    name: 'Milano Crisp White Cotton',
    type: 'Cotton',
    description: 'Two-ply Egyptian cotton poplin with exceptional breathability and crisp finishing. The quintessential foundation for premium dress shirts.',
    pricePerMeter: 45,
    color: '#F4F6F7',
    colorName: 'White',
    material: '100% Egyptian Cotton',
    inStock: true,
  },
  {
    id: 'fab-4',
    name: 'Tuscan Olive Pure Linen',
    type: 'Linen',
    description: 'Garment-dyed pure linen woven in Prato. Features a slubby texture that develops an exquisite, relaxed character with age and wear.',
    pricePerMeter: 60,
    color: '#555E44',
    colorName: 'Green',
    material: '100% Organic Linen',
    inStock: true,
  },
  {
    id: 'fab-5',
    name: 'Venetian Crimson Silk',
    type: 'Silk',
    description: 'Heavyweight Mulberry silk spun with a luminous satin weave. Sensuous drape and deep, rich color depth for statement evening wear.',
    pricePerMeter: 150,
    color: '#7A1C1C',
    colorName: 'Red',
    material: '100% Mulberry Silk',
    inStock: true,
  },
  {
    id: 'fab-6',
    name: 'Midnight Camel Cashmere Blend',
    type: 'Cashmere',
    description: 'A sophisticated harmony of 70% merino wool and 30% cashmere. Balanced structure and supreme softness in a timeless dark shade.',
    pricePerMeter: 140,
    color: '#3B2F2F',
    colorName: 'Brown',
    material: '70% Wool, 30% Cashmere',
    inStock: true,
  },
  {
    id: 'fab-7',
    name: 'British Khaki Twill Cotton',
    type: 'Cotton',
    description: 'Dense, rugged diagonal twill weave offering excellent durability and clean crease retention for tailored trousers and chinos.',
    pricePerMeter: 50,
    color: '#C2B280',
    colorName: 'Beige',
    material: '100% Cotton Twill',
    inStock: true,
  },
  {
    id: 'fab-8',
    name: 'Verona Slate Wool Mohair',
    type: 'Wool',
    description: 'High-twist summer suiting fabric blending premium wool with lustrous mohair. Crease-resistant and exceptionally cool to wear.',
    pricePerMeter: 130,
    color: '#4A5568',
    colorName: 'Grey',
    material: '85% Wool, 15% Mohair',
    inStock: true,
  },
];

export const MOCK_STYLES: Style[] = [
  {
    id: 'sty-1',
    name: 'The Classic Bespoke Shirt',
    category: 'shirt',
    description: 'Tailored to your precise torso measurements with single-needle stitching, split yoke, and mother-of-pearl buttons.',
    basePrice: 150,
    imageUrl: '/images/styles/classic-shirt.jpg',
  },
  {
    id: 'sty-2',
    name: 'Royal Heritage Sherwani',
    category: 'sherwani',
    description: 'Regal silhouette featuring a structured front, full satin lining, padded shoulders, and traditional button stance.',
    basePrice: 350,
    imageUrl: '/images/styles/sherwani.jpg',
  },
  {
    id: 'sty-3',
    name: 'Savile Row Pleated Trousers',
    category: 'pants',
    description: 'High-waisted double pleated trousers with side tab adjusters, curtain waistband, and a flattering taper.',
    basePrice: 180,
    imageUrl: '/images/styles/trousers.jpg',
  },
  {
    id: 'sty-4',
    name: 'Unstructured Neapolitan Jacket',
    category: 'jacket',
    description: 'Lightweight, spalla camicia (shirt-style) natural shoulders with patch pockets and double side vents.',
    basePrice: 400,
    imageUrl: '/images/styles/jacket.jpg',
  },
  {
    id: 'sty-5',
    name: 'Mayfair Evening Dress',
    category: 'dress',
    description: 'Elegantly draped evening dress featuring clean princess seams, concealed back zip, and full silk lining.',
    basePrice: 380,
    imageUrl: '/images/styles/dress.jpg',
  },
  {
    id: 'sty-6',
    name: 'Classic Linen Kurta',
    category: 'kurta',
    description: 'Relaxed yet elegant traditional tunic featuring a band collar, half-placket, and side gussets for ultimate comfort.',
    basePrice: 160,
    imageUrl: '/images/styles/kurta.jpg',
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Arthur Pendelton',
    role: 'Managing Director, Horizon Capital',
    comment: 'The convenience of having a master tailor take my measurements in my office is unmatched. The Italian wool drape is absolutely flawless.',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Elena Rostova',
    role: 'Principal Architect, Studio V',
    comment: 'As a designer, I am incredibly particular about stitching tolerances and fabric alignment. StitchIt exceeded my wildest expectations.',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Vikram Mehta',
    role: 'Founder, Apex Tech',
    comment: 'I ordered a bespoke Sherwani for my wedding. The structure, fit, and attention to detail made me feel like royalty on my big day.',
    rating: 5,
  },
  {
    id: 'test-4',
    name: 'Sophia Lawrence',
    role: 'Gallery Director',
    comment: 'Finding clothes that fit perfectly off the rack was always a struggle. StitchIt’s custom tailoring service changed my entire wardrobe.',
    rating: 5,
  },
];

export const CUSTOMIZATION_OPTIONS = {
  collar: [
    { id: 'col-1', name: 'Spread Collar', desc: 'Classic and versatile, perfect for ties' },
    { id: 'col-2', name: 'Button-Down', desc: 'Casual, sporty American classic' },
    { id: 'col-3', name: 'Mandarin Collar', desc: 'Sleek, modern stand-up band' },
    { id: 'col-4', name: 'Classic Point', desc: 'Traditional sharp, narrow points' },
  ],
  sleeve: [
    { id: 'slv-1', name: 'Full Length', desc: 'Traditional formal cuff finish' },
    { id: 'slv-2', name: 'Three-Quarter', desc: 'Chic, elevated mid-forearm length' },
    { id: 'slv-3', name: 'Half Sleeve', desc: 'Crisp summer-ready short sleeve' },
    { id: 'slv-4', name: 'Rolled Sleeve', desc: 'Permanent stitched-down casual roll' },
  ],
  fit: [
    { id: 'fit-1', name: 'Tailored Fit', desc: 'Sharp, contoured body-flattering cut' },
    { id: 'fit-2', name: 'Slim Fit', desc: 'Tapered closely to the natural waist' },
    { id: 'fit-3', name: 'Regular Fit', desc: 'Comfortable chest with classic straight drape' },
    { id: 'fit-4', name: 'Relaxed Fit', desc: 'Generous ease for effortless draping' },
  ],
};
