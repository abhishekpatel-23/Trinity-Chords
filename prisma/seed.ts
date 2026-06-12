import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating admin user...')
  
  const passwordHash = await bcrypt.hash('admin123', 12)
  
  await prisma.user.upsert({
    where: { email: 'admin@trinitychords.com' },
    update: { role: 'admin', passwordHash },
    create: {
      name: 'Admin',
      email: 'admin@trinitychords.com',
      passwordHash,
      role: 'admin',
    },
  })

  console.log('✓ Admin user created: admin@trinitychords.com / admin123')

  console.log('Creating feature flags...')
  const flags = [
    { key: 'guitar_chords_enabled', description: 'Enable guitar chords', enabled: true },
    { key: 'piano_chords_enabled', description: 'Enable piano chords', enabled: true },
    { key: 'gamit_language_enabled', description: 'Enable Gamit language', enabled: true },
    { key: 'share_as_image_enabled', description: 'Enable premium share as image', enabled: true },
    { key: 'contributor_role_enabled', description: 'Enable contributor role', enabled: false },
    { key: 'offline_mode_enabled', description: 'Enable offline mode', enabled: false },
  ]
  for (const flag of flags) {
    await prisma.featureFlag.upsert({ where: { key: flag.key }, update: {}, create: flag })
  }

  console.log('Creating labels...')
  const labels: Record<string, Awaited<ReturnType<typeof prisma.label.upsert>>> = {}
  const labelData = [
    { name: 'Praise', slug: 'praise', colorHex: '#74593e' },
    { name: 'Worship', slug: 'worship', colorHex: '#030813' },
    { name: 'Lent', slug: 'lent', colorHex: '#5a4228' },
    { name: 'Easter', slug: 'easter', colorHex: '#e3c09f' },
    { name: 'Hindi', slug: 'hindi' },
    { name: 'English', slug: 'english' },
    { name: 'Gujarati', slug: 'gujarati' },
    { name: 'Marathi', slug: 'marathi' },
    { name: 'Gamit', slug: 'gamit' },
  ]
  for (const l of labelData) {
    labels[l.slug] = await prisma.label.upsert({ where: { slug: l.slug }, update: {}, create: l })
  }

  console.log('Creating artists...')
  const hillsong = await prisma.artist.upsert({
    where: { id: 'hillsong' },
    update: {},
    create: {
      id: 'hillsong',
      name: 'Hillsong Worship',
      bio: 'Australian praise and worship group from Hillsong Church, Sydney.',
      musicians: {
        create: [
          { name: 'Brooke Ligertwood', role: 'Lead Vocalist' },
          { name: 'Joel Houston', role: 'Songwriter' },
        ]
      }
    },
  })
  const praneet = await prisma.artist.upsert({
    where: { id: 'praneet' },
    update: {},
    create: { id: 'praneet', name: 'Praneet Calvin', bio: 'Hindi worship leader known for contemporary Indian worship music.' },
  })
  const traditional = await prisma.artist.upsert({
    where: { id: 'traditional' },
    update: {},
    create: { id: 'traditional', name: 'Traditional', bio: 'Traditional hymns and songs passed through generations.' },
  })
  const morganHarper = await prisma.artist.upsert({
    where: { id: 'morgan-harper' },
    update: {},
    create: { id: 'morgan-harper', name: 'Morgan Harper Nichols', bio: 'American singer-songwriter and visual artist.' },
  })

  console.log('Creating songs...')

  // Helper to safely create with labels
  async function upsertSong(data: Parameters<typeof prisma.song.upsert>[0]) {
    return prisma.song.upsert(data)
  }

  // 1. What A Beautiful Name
  await upsertSong({
    where: { slug: 'what-a-beautiful-name' },
    update: {},
    create: {
      title: 'What A Beautiful Name',
      slug: 'what-a-beautiful-name',
      artistId: hillsong.id,
      tempoBpm: 68,
      key: 'D',
      timeSignature: '4/4',
      genre: 'Contemporary',
      isPremium: false,
      isFeatured: false,
      lyrics: {
        create: [{
          languageCode: 'en',
          content: `VERSE 1
G    D    Em  C
You were the Word at the beginning
G         D        Em   C
One with God the Lord Most High

CHORUS
G           D
What a beautiful Name it is
Em              C
What a beautiful Name it is
G           D
The Name of Jesus Christ my King`,
        }]
      },
      chords: {
        create: [{
          instrument: 'guitar',
          chordData: JSON.stringify([
            { name: 'G', frets: [3, 2, 0, 0, 3, 3] },
            { name: 'D', frets: [-1, -1, 0, 2, 3, 2] },
            { name: 'Em', frets: [0, 2, 2, 0, 0, 0] },
            { name: 'C', frets: [-1, 3, 2, 0, 1, 0] },
          ])
        }, {
          instrument: 'piano',
          chordData: JSON.stringify([
            { name: 'G', keys: [0, 4, 7] },
            { name: 'D', keys: [2, 6, 9] },
            { name: 'Em', keys: [4, 7, 11] },
            { name: 'C', keys: [0, 4, 7] },
          ])
        }]
      },
      labels: { create: [{ labelId: labels['worship'].id }, { labelId: labels['english'].id }] }
    }
  })

  // 2. Tu Hi Rab Hai — featured
  await upsertSong({
    where: { slug: 'tu-hi-rab-hai' },
    update: {},
    create: {
      title: 'Tu Hi Rab Hai',
      slug: 'tu-hi-rab-hai',
      artistId: praneet.id,
      tempoBpm: 72,
      key: 'G',
      timeSignature: '4/4',
      genre: 'Hindi Worship',
      isFeatured: true,
      lyrics: {
        create: [
          { languageCode: 'hi', content: `VERSE 1\nतू ही रब है\nतू ही सब है\nतेरे बिना मैं कुछ नहीं\n\nCHORUS\nतेरी महिमा\nतेरी स्तुति\nहमेशा करूं मैं प्रभु` },
          { languageCode: 'en', content: `VERSE 1\nYou are the Lord\nYou are everything\nWithout You I am nothing\n\nCHORUS\nTo Your glory\nTo Your praise\nI will worship You forever Lord` }
        ]
      },
      labels: { create: [{ labelId: labels['praise'].id }, { labelId: labels['hindi'].id }] }
    }
  })

  // 3. Oceans
  await upsertSong({
    where: { slug: 'oceans' },
    update: {},
    create: {
      title: 'Oceans (Where Feet May Fail)',
      slug: 'oceans',
      artistId: hillsong.id,
      tempoBpm: 64,
      key: 'D',
      timeSignature: '6/8',
      genre: 'Worship',
      isPremium: true,
      lyrics: {
        create: [{
          languageCode: 'en',
          content: `VERSE 1\nYou call me out upon the waters\nThe great unknown where feet may fail\nAnd there I find You in the mystery\nIn oceans deep my faith will stand\n\nCHORUS\nAnd I will call upon Your name\nAnd keep my eyes above the waves\nWhen oceans rise\nMy soul will rest in Your embrace\nFor I am Yours and You are mine`
        }]
      },
      labels: { create: [{ labelId: labels['worship'].id }, { labelId: labels['english'].id }] }
    }
  })

  // 4. Amazing Grace
  await upsertSong({
    where: { slug: 'amazing-grace' },
    update: {},
    create: {
      title: 'Amazing Grace',
      slug: 'amazing-grace',
      artistId: traditional.id,
      tempoBpm: 60,
      key: 'F',
      timeSignature: '3/4',
      genre: 'Hymn',
      lyrics: {
        create: [{
          languageCode: 'en',
          content: `VERSE 1\nAmazing grace how sweet the sound\nThat saved a wretch like me\nI once was lost but now am found\nWas blind but now I see\n\nVERSE 2\n'Twas grace that taught my heart to fear\nAnd grace my fears relieved\nHow precious did that grace appear\nThe hour I first believed`
        }]
      },
      labels: { create: [{ labelId: labels['worship'].id }, { labelId: labels['lent'].id }, { labelId: labels['english'].id }] }
    }
  })

  // 5. Hosanna
  await upsertSong({
    where: { slug: 'hosanna' },
    update: {},
    create: {
      title: 'Hosanna',
      slug: 'hosanna',
      artistId: hillsong.id,
      tempoBpm: 76,
      key: 'E',
      timeSignature: '4/4',
      genre: 'Praise',
      lyrics: {
        create: [{
          languageCode: 'en',
          content: `CHORUS\nHosanna, Hosanna\nHosanna in the highest\nHosanna, Hosanna\nHosanna in the highest\n\nVERSE 1\nI see the King of glory\nComing on the clouds with fire\nThe whole earth shakes\nThe whole earth shakes`
        }]
      },
      labels: { create: [{ labelId: labels['praise'].id }, { labelId: labels['easter'].id }] }
    }
  })

  // 6. Aradhana (Hindi)
  await upsertSong({
    where: { slug: 'aradhana' },
    update: {},
    create: {
      title: 'Aradhana',
      slug: 'aradhana',
      artistId: traditional.id,
      tempoBpm: 80,
      key: 'C',
      genre: 'Hindi Hymn',
      lyrics: {
        create: [{
          languageCode: 'hi',
          content: `CHORUS\nआराधना आराधना\nप्रभु यीशु की आराधना\nआराधना आराधना\nदिल से करो आराधना\n\nVERSE 1\nजय हो जय हो यीशु मसीह\nजय हो जय हो दिल में हमारे`
        }]
      },
      labels: { create: [{ labelId: labels['worship'].id }, { labelId: labels['hindi'].id }] }
    }
  })

  // 7. Tame Mara Taranhar (Gujarati)
  await upsertSong({
    where: { slug: 'tame-mara-taranhar' },
    update: {},
    create: {
      title: 'Tame Mara Taranhar',
      slug: 'tame-mara-taranhar',
      artistId: traditional.id,
      key: 'E',
      genre: 'Gujarati Hymn',
      lyrics: {
        create: [{
          languageCode: 'gu',
          content: `CHORUS\nતમે મારા તારણહાર\nતમે મારા પ્રભુ\nહું તમારો, તમે મારા\nઆ પ્રીતિ અમર રહો\n\nVERSE 1\nઈસુ ઈસુ ઈસુ\nતારું નામ ઉઠાઉં`
        }]
      },
      labels: { create: [{ labelId: labels['praise'].id }, { labelId: labels['gujarati'].id }] }
    }
  })

  // 8. Mahima Mahima
  await upsertSong({
    where: { slug: 'mahima-mahima' },
    update: {},
    create: {
      title: 'Mahima Mahima',
      slug: 'mahima-mahima',
      artistId: traditional.id,
      tempoBpm: 90,
      key: 'D',
      genre: 'Hindi Praise',
      lyrics: {
        create: [{
          languageCode: 'hi',
          content: `CHORUS\nमहिमा महिमा हो तेरी महिमा\nमहिमा हो प्रभु यीशु\nस्तुति स्तुति हो तेरी स्तुति\nस्तुति हो प्रभु यीशु`
        }]
      },
      labels: { create: [{ labelId: labels['praise'].id }, { labelId: labels['hindi'].id }] }
    }
  })

  // 9. Yahowa Mara (Gamit)
  await upsertSong({
    where: { slug: 'yahowa-mara' },
    update: {},
    create: {
      title: 'Yahowa Mara',
      slug: 'yahowa-mara',
      artistId: traditional.id,
      key: 'G',
      genre: 'Gamit Worship',
      lyrics: {
        create: [{
          languageCode: 'gm',
          content: `CHORUS\nYahowa mara prabhu\nTume mara dev\nTume mara sab kuch\nTume mara jeevan`
        }]
      },
      labels: { create: [{ labelId: labels['worship'].id }] }
    }
  })

  // 10. O Ishwar Mari Bhul (Gujarati Lent)
  await upsertSong({
    where: { slug: 'o-ishwar-mari-bhul' },
    update: {},
    create: {
      title: 'O Ishwar Mari Bhul',
      slug: 'o-ishwar-mari-bhul',
      artistId: traditional.id,
      key: 'Am',
      genre: 'Gujarati Hymn',
      lyrics: {
        create: [{
          languageCode: 'gu',
          content: `VERSE 1\nઓ ઈશ્વર મારી ભૂલ માફ કર\nઓ ઈશ્વર મારી ભૂલ માફ કર\n\nCHORUS\nક્ષમા કર, ક્ષમા કર\nઓ ઈશ્વર ક્ષમા કર`
        }]
      },
      labels: { create: [{ labelId: labels['lent'].id }, { labelId: labels['gujarati'].id }] }
    }
  })

  console.log('✅ Seeding complete! 10 songs + admin user created.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
