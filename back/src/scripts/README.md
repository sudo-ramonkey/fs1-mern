# Product Generation Script

This script generates a large number of realistic products for your music store database based on the defined schemas.

## What it generates

The script creates:
- **100+ Instruments** (electric guitars, acoustic guitars, basses)
- **100+ Equipment** (amplifiers, effects pedals)
- **130+ Accessories** (strings, picks, cases, cables, etc.)

All products include:
- Realistic names and descriptions
- Proper categorization and subcategorization
- Stock levels
- Image URLs (sample Unsplash images)
- Detailed specifications based on product type
- Random but realistic pricing

## Features

- ✅ **Image Support**: The `imagenes` field is already supported in your schemas and populated with sample URLs
- ✅ **Realistic Data**: Products use real brand names and model variations
- ✅ **Proper Schema Compliance**: All generated products follow your discriminator pattern
- ✅ **Variety**: Multiple categories, brands, and specifications
- ✅ **Stock Management**: Random stock levels for testing

## Usage

### Method 1: Using npm script (Recommended)
```bash
cd fs1-mern/back
npm run generate-products
```

### Method 2: Direct execution
```bash
cd fs1-mern/back
node src/scripts/generateProducts.js
```

### Method 3: Using the runner script
```bash
cd fs1-mern/back
node src/scripts/run-generator.js
```

## Configuration

### Environment Variables
Make sure you have your MongoDB connection string in your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/your-database-name
```

### Customization
You can modify the script to:
- Change the number of products generated (edit the loop counts)
- Add new product variations (edit the data arrays)
- Modify price ranges
- Add more brands or categories

## Generated Product Types

### Instruments
- **Electric Guitars**: Stratocasters, Telecasters, Les Pauls, SGs, etc.
- **Acoustic Guitars**: Dreadnoughts, Folk, Classical guitars
- **Basses**: Jazz Bass, Precision Bass, Active Bass variants

### Equipment
- **Amplifiers**: Combo, Head, Cabinet variants with different technologies
- **Effects**: Distortion, Delay, Reverb, Modulation, and Multi-effects

### Accessories
- **Strings**: Different gauges for acoustic and electric guitars
- **Hardware**: Stands, tuners, cables, capos, picks
- **Cases**: Gig bags, hard cases, soft cases
- **Tools**: Cleaning supplies, maintenance tools

## Sample Generated Data

### Electric Guitar Example
```json
{
  "nombre": "Player Stratocaster",
  "marca": "Fender",
  "precio": 15999,
  "tipo": "Instrumento",
  "categoria": "Electrico",
  "tipoInstrumento": "Guitarra",
  "categoriaProducto": "Guitarras Electricas",
  "subcategoriaInstrumento": "Stratocaster",
  "imagenes": ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500"],
  "especificacionesGuitarra": {
    "tipoPastillas": "Single-coil",
    "cantidadTrastes": 22,
    "configuracionPastillas": "SSS"
  }
}
```

### Amplifier Example
```json
{
  "nombre": "Blues Junior IV",
  "marca": "Fender",
  "precio": 12999,
  "tipo": "Equipo",
  "tipoEquipo": "Amplificador",
  "categoriaProducto": "Amplificadores",
  "especificacionesAmplificador": {
    "tipo": "Combo",
    "tecnologia": "Tubos",
    "cantidadCanales": 2
  }
}
```

## Database Impact

⚠️ **Warning**: This script will:
1. Clear ALL existing products from your database
2. Insert new generated products

Make sure to backup your database if you have existing data you want to keep.

## Troubleshooting

### Common Issues

1. **Connection Error**
   - Check your MongoDB connection string
   - Ensure MongoDB is running
   - Verify database permissions

2. **Schema Validation Errors**
   - The script uses your existing schemas
   - If you've modified schemas, update the script accordingly

3. **Memory Issues**
   - If generating too many products, reduce the loop counts
   - Consider running in smaller batches

### Script Output
The script provides detailed console output:
```
Connecting to MongoDB...
Connected to MongoDB successfully!
Clearing existing products...
Generating instruments...
Generating equipment...
Generating accessories...
Saving instruments to database...
✅ Created 100 instruments
Saving equipment to database...
✅ Created 100 equipment items
Saving accessories to database...
✅ Created 130 accessories

🎉 Successfully generated 330 products!

📊 Summary:
• Instruments: 100
• Equipment: 100
• Accessories: 130
• Total: 330
```

## Next Steps

After running the script:
1. Verify the data in your database
2. Update image URLs to your actual product images
3. Adjust pricing based on your business needs
4. Modify stock levels as needed
5. Add real product descriptions

## Image URLs

The script currently uses sample Unsplash images. To use your own images:
1. Upload product images to your preferred hosting service
2. Update the `getRandomImages()` function in the script
3. Or manually update the `imagenes` field in your database

The schema already supports multiple images per product as an array of strings.