// Berkshire Hathaway, by far the biggest and most varied house.
//
// Subsidiaries are wholly owned; public
// holdings use the 13F stake from that project via `via.stake`.
// See js/data/companies.js for the line field reference.

export const BERKSHIRE = {
  name: 'Berkshire Hathaway', color: '#3b5b92',
  lines: [
    // Wholly owned operating businesses
    { name: 'BNSF freight', unit: 'railcar', perYear: 9.8e6, profitPerUnit: 520, sprite: 'container', tint: '#e07a2c' },
    { name: 'GEICO auto policies', unit: 'policy', units: 'policies', perYear: 2.4e7, profitPerUnit: 220, sprite: 'policy' },
    { name: 'BHE electricity', unit: 'MWh', units: 'MWh', perYear: 1.35e8, profitPerUnit: 20, sprite: 'bolt' },
    { name: 'Pilot fuel', unit: 'gallon', perYear: 1.2e10, profitPerUnit: 0.1, sprite: 'fuel', tint: '#d23b2e' },
    { name: 'Clayton homes', unit: 'home', perYear: 5.0e4, profitPerUnit: 25000, sprite: 'house' },
    { name: 'Forest River RVs', unit: 'RV', perYear: 1.0e5, profitPerUnit: 6000, sprite: 'rv', tint: '#6b8fb8' },
    { name: 'Duracell batteries', unit: 'battery', units: 'batteries', perYear: 3.0e9, profitPerUnit: 0.06, sprite: 'battery' },
    { name: 'Benjamin Moore paint', unit: 'gallon', perYear: 1.0e8, profitPerUnit: 2, sprite: 'paint', tint: '#3a7bd5' },
    { name: 'Dairy Queen Blizzards', unit: 'Blizzard', perYear: 1.5e8, profitPerUnit: 0.25, sprite: 'blizzard', tint: '#d23b2e' },
    { name: 'Fruit of the Loom', unit: 'garment', perYear: 5.0e8, profitPerUnit: 0.1, sprite: 'shirt' },
    { name: 'Brooks running shoes', unit: 'pair', perYear: 1.0e7, profitPerUnit: 12, sprite: 'shoe', tint: '#2e6fd6' },
    { name: "See's Candies", unit: 'pound', perYear: 3.0e7, profitPerUnit: 4, sprite: 'candy' },

    // Look-through: Berkshire's slice of public companies it holds
    { name: 'Apple iPhones', unit: 'iPhone', perYear: 2.3e8, profitPerUnit: 260, sprite: 'phone', via: { name: 'Apple', stake: 0.016 } },
    { name: 'Coca-Cola drinks', unit: 'serving', perYear: 8.0e11, profitPerUnit: 0.015, sprite: 'soda', via: { name: 'Coca-Cola', stake: 0.093 } },
    { name: 'Chevron oil & gas', unit: 'barrel', perYear: 1.2e9, profitPerUnit: 12.5, sprite: 'barrel', tint: '#2f6fb5', via: { name: 'Chevron', stake: 0.062 } },
    { name: 'Occidental oil & gas', unit: 'barrel', perYear: 5.1e8, profitPerUnit: 5, sprite: 'barrel', tint: '#c8423a', via: { name: 'Occidental', stake: 0.2689 } },
    { name: 'Heinz ketchup', unit: 'bottle', perYear: 6.5e8, profitPerUnit: 0.3, sprite: 'ketchup', via: { name: 'Kraft Heinz', stake: 0.269 } },
  ],
};
