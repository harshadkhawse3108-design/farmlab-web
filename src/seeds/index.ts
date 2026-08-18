// Database Seeder
import { Post, MarketPrice, Advertisement, Admin } from '../models';

export const seedDatabase = async (): Promise<void> => {
  try {
    // Check if data exists
    const postCount = await Post.countDocuments();
    if (postCount > 0) {
      console.log('📦 Database already seeded');
      return;
    }

    console.log('🌱 Seeding database...');

    // Seed Admin
    await Admin.create({
      username: 'admin',
      password: 'admin123',
      name: 'Administrator',
      role: 'superadmin'
    });

    // Seed Posts
    await Post.insertMany([
      {
        title: 'आज का कृषि टिप',
        content: 'गेहूं की बुवाई के लिए सबसे उपयुक्त समय नवंबर का पहला सप्ताह है। बीज दर 100 kg/हेक्टेयर रखें।',
        author: 'FarmLab Team',
        category: 'daily-tip',
        isDaily: true,
        likes: 156,
        views: 1250
      },
      {
        title: 'मंडी भाव अपडेट',
        content: 'आज गेहूं का भाव ₹2,275/क्विंटल है। कल की तुलना में ₹25 की बढ़ोतरी हुई है।',
        author: 'FarmLab Market',
        category: 'market-price',
        likes: 89,
        views: 890
      },
      {
        title: 'मौसम चेतावनी',
        content: 'अगले 48 घंटों में भारी बारिश की संभावना है। कटी हुई फसल को सुरक्षित रखें।',
        author: 'FarmLab Weather',
        category: 'weather-alert',
        likes: 234,
        views: 2100
      },
      {
        title: 'PM-KISAN योजना',
        content: 'PM-KISAN की 17वीं किस्त जल्द आने वाली है। अपना eKYC अवश्य पूरा करें।',
        author: 'FarmLab Schemes',
        category: 'government-scheme',
        likes: 312,
        views: 3500
      },
      {
        title: 'टमाटर में झुलसा रोग',
        content: 'टमाटर में झुलसा रोग से बचाव के लिए मैंकोज़ेब 2.5 ग्राम प्रति लीटर पानी में छिड़काव करें।',
        author: 'FarmLab Experts',
        category: 'pest-control',
        likes: 178,
        views: 1456
      },
      {
        title: 'जैविक खेती के फायदे',
        content: 'जैविक खेती से मिट्टी की उर्वरता बढ़ती है और उत्पाद की कीमत भी अधिक मिलती है।',
        author: 'FarmLab Organic',
        category: 'organic-farming',
        likes: 145,
        views: 980
      }
    ]);

    // Seed Market Prices
    await MarketPrice.insertMany([
      { commodity: 'गेहूं', price: 2275, market: 'देवास', change: 25 },
      { commodity: 'सोयाबीन', price: 4850, market: 'इंदौर', change: -50 },
      { commodity: 'चना', price: 5200, market: 'उज्जैन', change: 75 },
      { commodity: 'प्याज', price: 1800, market: 'रतलाम', change: -100 },
      { commodity: 'टमाटर', price: 2500, market: 'भोपाल', change: 200 },
      { commodity: 'आलू', price: 1200, market: 'इंदौर', change: 50 }
    ]);

    // Seed Ads
    await Advertisement.insertMany([
      {
        title: 'महिंद्रा ट्रैक्टर',
        description: 'EMI ₹8,999/माह से शुरू',
        imageUrl: 'https://via.placeholder.com/728x90/2E7D32/FFFFFF?text=Mahindra+Tractor',
        position: 'top',
        advertiser: 'Mahindra'
      },
      {
        title: 'UPL कीटनाशक',
        imageUrl: 'https://via.placeholder.com/300x250/1565C0/FFFFFF?text=UPL+Pesticides',
        position: 'sidebar',
        advertiser: 'UPL'
      },
      {
        title: 'IFFCO उर्वरक',
        imageUrl: 'https://via.placeholder.com/728x90/F57C00/FFFFFF?text=IFFCO+Fertilizers',
        position: 'bottom',
        advertiser: 'IFFCO'
      }
    ]);

    console.log('✅ Database seeded successfully');
    console.log('   Admin: admin / admin123');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};
