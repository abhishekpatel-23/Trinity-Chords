import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create Feature Flags
  await prisma.featureFlag.upsert({
    where: { key: 'guitar_chords_enabled' },
    update: {},
    create: { key: 'guitar_chords_enabled', description: 'Enable guitar chords feature', enabled: true },
  })
  await prisma.featureFlag.upsert({
    where: { key: 'piano_chords_enabled' },
    update: {},
    create: { key: 'piano_chords_enabled', description: 'Enable piano chords feature', enabled: true },
  })
  await prisma.featureFlag.upsert({
    where: { key: 'gamit_language_enabled' },
    update: {},
    create: { key: 'gamit_language_enabled', description: 'Enable Gamit language', enabled: true },
  })
  await prisma.featureFlag.upsert({
    where: { key: 'share_as_image_enabled' },
    update: {},
    create: { key: 'share_as_image_enabled', description: 'Enable premium share as image', enabled: true },
  })
  await prisma.featureFlag.upsert({
    where: { key: 'contributor_role_enabled' },
    update: {},
    create: { key: 'contributor_role_enabled', description: 'Enable contributor role', enabled: false },
  })
  await prisma.featureFlag.upsert({
    where: { key: 'offline_mode_enabled' },
    update: {},
    create: { key: 'offline_mode_enabled', description: 'Enable offline mode', enabled: false },
  })
  await prisma.featureFlag.upsert({
    where: { key: 'elasticsearch_search_enabled' },
    update: {},
    create: { key: 'elasticsearch_search_enabled', description: 'Enable Elasticsearch (vs Postgres ILIKE)', enabled: false },
  })

  // Create Labels
  const praise = await prisma.label.upsert({
    where: { slug: 'praise' },
    update: {},
    create: { name: 'Praise', slug: 'praise', colorHex: '#4CAF50' },
  })
  const worship = await prisma.label.upsert({
    where: { slug: 'worship' },
    update: {},
    create: { name: 'Worship', slug: 'worship', colorHex: '#2196F3' },
  })
  const lent = await prisma.label.upsert({
    where: { slug: 'lent' },
    update: {},
    create: { name: 'Lent', slug: 'lent', colorHex: '#9C27B0' },
  })

  // Create Artists
  const hillsong = await prisma.artist.upsert({
    where: { id: 'hillsong' },
    update: {},
    create: { id: 'hillsong', name: 'Hillsong Worship', bio: 'Australian praise and worship group' },
  })
  const praneet = await prisma.artist.upsert({
    where: { id: 'praneet' },
    update: {},
    create: { id: 'praneet', name: 'Praneet Calvin', bio: 'Hindi worship leader' },
  })
  const traditional = await prisma.artist.upsert({
    where: { id: 'traditional' },
    update: {},
    create: { id: 'traditional', name: 'Traditional', bio: 'Traditional hymns and songs' },
  })

  // Create Songs
  console.log('Seeding songs...')

  // 1. What A Beautiful Name (English)
  const song1 = await prisma.song.upsert({
    where: { slug: 'what-a-beautiful-name' },
    update: {},
    create: {
      title: 'What A Beautiful Name',
      slug: 'what-a-beautiful-name',
      artistId: hillsong.id,
      tempoBpm: 68,
      key: 'D',
      timeSignature: '4/4',
      genre: 'Contemporary Worship',
      isPremium: false,
      isFeatured: true,
      lyrics: {
        create: [
          {
            languageCode: 'en',
            content: "You were the Word at the beginning\nOne with God the Lord Most High\nYour hidden glory in creation\nNow revealed in You our Christ\n\nWhat a beautiful Name it is\nWhat a beautiful Name it is\nThe Name of Jesus Christ my King",
          }
        ]
      },
      chords: {
        create: [
          {
            instrument: 'guitar',
            chordData: JSON.stringify({
              chords: [
                { line: 0, position: 0, chord: 'D' },
                { line: 1, position: 0, chord: 'G' }, { line: 1, position: 5, chord: 'Bm' }, { line: 1, position: 10, chord: 'A' },
              ]
            })
          }
        ]
      },
      labels: {
        create: [
          { labelId: worship.id }
        ]
      }
    }
  })

  // 2. Tu Hi Rab Hai (Hindi)
  const song2 = await prisma.song.upsert({
    where: { slug: 'tu-hi-rab-hai' },
    update: {},
    create: {
      title: 'Tu Hi Rab Hai',
      slug: 'tu-hi-rab-hai',
      artistId: praneet.id,
      tempoBpm: 72,
      key: 'G',
      genre: 'Hindi Worship',
      isFeatured: true,
      lyrics: {
        create: [
          { languageCode: 'hi', content: "तू ही रब है\nतू ही सब है\nतेरे बिना मैं कुछ नहीं" },
          { languageCode: 'en', content: "You are the Lord\nYou are everything\nWithout you I am nothing" } // Translation
        ]
      },
      labels: { create: [{ labelId: praise.id }] }
    }
  })

  // 3. Oceans (English)
  const song3 = await prisma.song.upsert({
    where: { slug: 'oceans' },
    update: {},
    create: {
      title: 'Oceans (Where Feet May Fail)',
      slug: 'oceans',
      artistId: hillsong.id,
      tempoBpm: 64,
      key: 'D',
      lyrics: { create: [{ languageCode: 'en', content: "You call me out upon the waters\nThe great unknown where feet may fail" }] },
      labels: { create: [{ labelId: worship.id }] }
    }
  })

  // 4. Amazing Grace (English / Traditional)
  const song4 = await prisma.song.upsert({
    where: { slug: 'amazing-grace' },
    update: {},
    create: {
      title: 'Amazing Grace',
      slug: 'amazing-grace',
      artistId: traditional.id,
      tempoBpm: 60,
      key: 'F',
      lyrics: { create: [{ languageCode: 'en', content: "Amazing grace how sweet the sound\nThat saved a wretch like me" }] },
      labels: { create: [{ labelId: worship.id }, { labelId: lent.id }] }
    }
  })

  // 5. Aradhana (Hindi)
  const song5 = await prisma.song.upsert({
    where: { slug: 'aradhana' },
    update: {},
    create: {
      title: 'Aradhana',
      slug: 'aradhana',
      artistId: traditional.id,
      tempoBpm: 80,
      key: 'C',
      lyrics: { create: [{ languageCode: 'hi', content: "आराधना आराधना\nप्रभु यीशु की आराधना" }] },
      labels: { create: [{ labelId: worship.id }] }
    }
  })

  // 6. Tame Mara Taranhar (Gujarati)
  const song6 = await prisma.song.upsert({
    where: { slug: 'tame-mara-taranhar' },
    update: {},
    create: {
      title: 'Tame Mara Taranhar',
      slug: 'tame-mara-taranhar',
      artistId: traditional.id,
      key: 'E',
      lyrics: { create: [{ languageCode: 'gu', content: "તમે મારા તારણહાર\nતમે મારા પ્રભુ" }] },
      labels: { create: [{ labelId: praise.id }] }
    }
  })

  // 7. Mahima Mahima (Hindi)
  const song7 = await prisma.song.upsert({
    where: { slug: 'mahima-mahima' },
    update: {},
    create: {
      title: 'Mahima Mahima',
      slug: 'mahima-mahima',
      artistId: traditional.id,
      tempoBpm: 90,
      key: 'D',
      lyrics: { create: [{ languageCode: 'hi', content: "महिमा महिमा हो तेरी महिमा" }] },
      labels: { create: [{ labelId: praise.id }] }
    }
  })

  // 8. O Ishwar Mari Bhul (Gujarati)
  const song8 = await prisma.song.upsert({
    where: { slug: 'o-ishwar-mari-bhul' },
    update: {},
    create: {
      title: 'O Ishwar Mari Bhul',
      slug: 'o-ishwar-mari-bhul',
      artistId: traditional.id,
      key: 'Am',
      lyrics: { create: [{ languageCode: 'gu', content: "ઓ ઈશ્વર મારી ભૂલ માફ કર" }] },
      labels: { create: [{ labelId: lent.id }] }
    }
  })

  // 9. Yahowa Mara (Gamit)
  const song9 = await prisma.song.upsert({
    where: { slug: 'yahowa-mara' },
    update: {},
    create: {
      title: 'Yahowa Mara',
      slug: 'yahowa-mara',
      artistId: traditional.id,
      key: 'G',
      lyrics: { create: [{ languageCode: 'gm', content: "Yahowa mara prabhu\nTume mara dev" }] },
      labels: { create: [{ labelId: worship.id }] }
    }
  })

  // 10. Hosanna (English)
  const song10 = await prisma.song.upsert({
    where: { slug: 'hosanna' },
    update: {},
    create: {
      title: 'Hosanna',
      slug: 'hosanna',
      artistId: hillsong.id,
      tempoBpm: 76,
      key: 'E',
      lyrics: { create: [{ languageCode: 'en', content: "Hosanna, Hosanna\nHosanna in the highest" }] },
      labels: { create: [{ labelId: praise.id }] }
    }
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
