# PesoGrow - Your Peso Grow to More

A professional web application that helps Filipinos compare interest rates and calculate potential earnings across various Philippine digital banks.

## Features

- 🏦 **Real-time Bank Comparison** - Compare 9 major Philippine digital banks
- 💰 **Interest Calculator** - Calculate compound interest with customizable amounts and periods
- 📱 **Mobile Responsive** - Optimized for mobile and desktop devices
- 🔄 **Live Data** - Integration with Google Sheets for dynamic bank data
- 🏆 **Smart Highlighting** - Automatically highlights the best earning potential
- 📊 **Professional UI** - Clean, Bankrate-inspired design

## Supported Banks

- GCash GSave (CIMB)
- Maya Bank
- Tonik Bank
- CIMB Bank Philippines
- ING Bank Philippines
- KOMO by EastWest
- UNO Digital Bank
- SeaBank Philippines
- GoTyme Bank

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

## Google Sheets Integration (Optional)

To use live data from Google Sheets instead of sample data:

1. **Create a Google Sheet** with the following columns (A-J):
   - A: bankId (e.g., "gcash-gsave")
   - B: bankName (e.g., "GCash GSave")
   - C: logoUrl (image URL)
   - D: bankType (e.g., "Digital Bank")
   - E: baseInterestRate (e.g., 2.5 for 2.5%)
   - F: promoInterestRate (optional, e.g., 4.0 for 4.0%)
   - G: minimumDeposit (e.g., 100)
   - H: website (e.g., "https://gcash.com")
   - I: isActive (TRUE/FALSE)
   - J: description (optional)

2. **Get Google Sheets API credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google Sheets API
   - Create an API key
   - Share your sheet publicly (or use service account)

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```
   GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SHEETS_API_KEY=your_api_key_here
   ```

4. **Restart the development server**

## Project Structure

```
pesogrow/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Calculator.tsx     # Interest calculator
│   └── BankCard.tsx       # Bank comparison card
├── data/                  # Static data
│   └── sampleBanks.ts     # Sample bank data
├── pages/api/             # API routes
│   └── banks.ts           # Bank data API endpoint
├── types/                 # TypeScript definitions
│   └── index.ts           # Type definitions
└── public/                # Static assets
```

## Customization

### Adding New Banks

1. **With Google Sheets:** Add a new row to your sheet
2. **Without Google Sheets:** Edit `data/sampleBanks.ts`

### Styling

- Edit `app/globals.css` for global styles
- Modify Tailwind classes in components for specific styling
- Update `tailwind.config.js` for theme customization

### Interest Calculation

The app uses compound interest formula: A = P(1 + r/n)^(nt)
- P = Principal amount
- r = Annual interest rate
- n = Number of times interest compounds per year (quarterly = 4)
- t = Time in years

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Integration:** Google Sheets API
- **Hosting:** Optimized for Vercel deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Disclaimer

This calculator provides estimates based on the entered data. Actual returns may vary. Interest rates and terms are subject to change by respective banks. Please verify current rates and terms with the banks before making financial decisions.

## License

MIT License - feel free to use this project for your own purposes.