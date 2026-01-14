import React, { useState } from 'react';

const sections = [
  {
    id: 'A',
    title: 'The Foundations',
    arabic: 'الأساسيات',
    description: 'Assessment of obligatory acts (Farāʾiḍ)',
    questions: [
      {
        id: 'A1',
        text: 'How consistent are you with the five daily prayers?',
        critical: true,
        options: [
          { value: 0, label: 'I rarely pray or have abandoned prayer almost entirely' },
          { value: 1, label: 'I pray sometimes but miss many prayers regularly' },
          { value: 2, label: 'I pray most prayers but frequently miss one or two daily' },
          { value: 3, label: 'I pray all five but sometimes miss them (making up later)' },
          { value: 4, label: 'I pray all five consistently, rarely missing any' },
          { value: 5, label: 'I pray all five on time and add regular nawāfil' }
        ]
      },
      {
        id: 'A2',
        text: 'How do you approach the obligatory fast of Ramadan?',
        options: [
          { value: 0, label: "I don't fast Ramadan" },
          { value: 1, label: 'I fast some days but not consistently' },
          { value: 2, label: 'I fast most of Ramadan with some missed days (not made up)' },
          { value: 3, label: 'I fast Ramadan completely, making up any missed days' },
          { value: 4, label: 'I fast Ramadan and occasionally fast voluntary fasts' },
          { value: 5, label: 'I fast Ramadan plus regular sunnah fasts (Mondays/Thursdays, etc.)' }
        ]
      },
      {
        id: 'A3',
        text: 'If zakat is obligatory on you, how do you handle it?',
        options: [
          { value: 0, label: "I don't pay zakat even though it's obligatory on me" },
          { value: 1, label: 'I pay zakat inconsistently or less than required' },
          { value: 2, label: 'I pay zakat but without careful calculation' },
          { value: 3, label: 'I pay zakat correctly and on time' },
          { value: 4, label: 'I pay zakat and give regular sadaqah' },
          { value: 5, label: 'I pay zakat, give regular sadaqah, and seek out those in need' }
        ]
      },
      {
        id: 'A4',
        text: 'How would you describe your relationship with major sins?',
        critical: true,
        options: [
          { value: 0, label: "I'm involved in major sins without concern" },
          { value: 1, label: 'I commit major sins but feel guilty afterward' },
          { value: 2, label: 'I struggle with major sins, making tawbah but relapsing' },
          { value: 3, label: 'I avoid most major sins but slip occasionally' },
          { value: 4, label: 'I consistently avoid major sins' },
          { value: 5, label: 'I avoid major sins and am cautious even about doubtful matters' }
        ]
      },
      {
        id: 'A5',
        text: 'When you commit a sin, what is your internal response?',
        options: [
          { value: 0, label: "I don't consider my actions sinful / I justify them" },
          { value: 1, label: "I know it's wrong but feel helpless to change" },
          { value: 2, label: 'I acknowledge the sin and intend to do better' },
          { value: 3, label: 'I make tawbah and take steps to avoid repetition' },
          { value: 4, label: 'I make immediate tawbah and feel genuine remorse' },
          { value: 5, label: 'I rarely sin, but when I do, I make extensive tawbah' }
        ]
      }
    ]
  },
  {
    id: 'B',
    title: 'Time & Priorities',
    arabic: 'الوقت والأولويات',
    description: 'How you spend your non-obligatory time',
    questions: [
      {
        id: 'B1',
        text: 'How do you typically spend your free time?',
        options: [
          { value: 0, label: 'Entertainment with no benefit (excessive gaming, binge-watching)' },
          { value: 1, label: 'Mostly entertainment with occasional beneficial activities' },
          { value: 2, label: 'A mix of entertainment and beneficial activities' },
          { value: 3, label: 'Mostly beneficial activities with some entertainment' },
          { value: 4, label: 'Almost all time in beneficial activities' },
          { value: 5, label: 'I consciously choose the MOST beneficial activity at each moment' }
        ]
      },
      {
        id: 'B2',
        text: 'If death came RIGHT NOW, how would you feel about what you\'re doing?',
        options: [
          { value: 0, label: "I'd be embarrassed or regretful" },
          { value: 1, label: "I'd wish I was doing something better" },
          { value: 2, label: "I'd feel okay — not bad, just not great" },
          { value: 3, label: "I'd feel reasonably content" },
          { value: 4, label: "I'd feel good — this is worthwhile" },
          { value: 5, label: "I'd feel completely at peace — exactly what I should be doing" }
        ]
      },
      {
        id: 'B3',
        text: "Do you consider what's MORE important when choosing activities?",
        options: [
          { value: 0, label: "I don't think about importance — I do what I feel like" },
          { value: 1, label: "I sometimes consider what's important" },
          { value: 2, label: 'I usually choose important things over trivial things' },
          { value: 3, label: 'I consistently choose important activities' },
          { value: 4, label: "I often weigh options to find what's MORE important" },
          { value: 5, label: 'I habitually seek the MOST important thing I could be doing' }
        ]
      },
      {
        id: 'B4',
        text: 'In an average week, how many hours feel truly "wasted"?',
        options: [
          { value: 0, label: '20+ hours' },
          { value: 1, label: '15-20 hours' },
          { value: 2, label: '10-15 hours' },
          { value: 3, label: '5-10 hours' },
          { value: 4, label: '2-5 hours' },
          { value: 5, label: "Less than 2 hours — I'm intentional with almost all my time" }
        ]
      }
    ]
  },
  {
    id: 'C',
    title: 'Intention & Transformation',
    arabic: 'النية والتحويل',
    description: 'The spiritual quality of your actions',
    questions: [
      {
        id: 'C1',
        text: 'How often do you consciously make intention (niyyah) before daily activities?',
        options: [
          { value: 0, label: 'Rarely — I just do things' },
          { value: 1, label: 'Only before acts of worship' },
          { value: 2, label: 'Sometimes before important activities' },
          { value: 3, label: 'Often — I try to have good intentions' },
          { value: 4, label: "Usually — I consciously intend for Allah's sake" },
          { value: 5, label: 'Almost always — everything is framed with intention' }
        ]
      },
      {
        id: 'C2',
        text: 'Do you transform permissible activities into worship through intention?',
        subtitle: "Example: Eating for strength to worship, sleeping to rest for tahajjud",
        options: [
          { value: 0, label: 'I never thought about this' },
          { value: 1, label: "I've heard of this but don't practice it" },
          { value: 2, label: 'I try occasionally' },
          { value: 3, label: 'I do this somewhat regularly' },
          { value: 4, label: 'I do this with most daily activities' },
          { value: 5, label: 'This is my habitual state' }
        ]
      },
      {
        id: 'C3',
        text: 'Do you engage in "lesser" activities to prevent yourself from worse ones?',
        subtitle: 'Example: Nasheed instead of haram music, sports to avoid bad company',
        options: [
          { value: 0, label: "I don't think strategically about avoiding sin" },
          { value: 1, label: "I try to avoid sin but don't use substitutes" },
          { value: 2, label: 'I sometimes use this strategy' },
          { value: 3, label: 'I regularly employ this principle' },
          { value: 4, label: 'I actively plan my life around this principle' },
          { value: 5, label: "I've structured my entire lifestyle to minimize exposure to sin" }
        ]
      }
    ]
  },
  {
    id: 'D',
    title: 'Knowledge & Practice',
    arabic: 'العلم والعمل',
    description: 'Engagement with recommended and disputed acts',
    questions: [
      {
        id: 'D1',
        text: "How do you approach acts where scholars differ (duʿāʾ after prayer, mawlid)?",
        options: [
          { value: 0, label: "I don't know about these differences" },
          { value: 1, label: 'I avoid anything with any scholarly dispute' },
          { value: 2, label: "I'm cautious but occasionally participate" },
          { value: 3, label: 'I participate in acts that trustworthy scholars permit' },
          { value: 4, label: 'I actively seek recommended acts even if some dispute them' },
          { value: 5, label: 'I follow valid positions while respecting those who differ' }
        ]
      },
      {
        id: 'D2',
        text: 'How consistent are you with voluntary worship (nawāfil)?',
        options: [
          { value: 0, label: "I don't do voluntary worship" },
          { value: 1, label: 'I occasionally do nawāfil when I feel like it' },
          { value: 2, label: 'I have some regular nawāfil (sunnah prayers)' },
          { value: 3, label: "I'm consistent with several nawāfil" },
          { value: 4, label: 'I have a structured wird I maintain' },
          { value: 5, label: 'I have extensive awrād and constantly seek to increase' }
        ]
      },
      {
        id: 'D3',
        text: 'How actively do you pursue Islamic knowledge?',
        options: [
          { value: 0, label: "I don't actively seek knowledge" },
          { value: 1, label: 'I learn passively (khutbahs, occasional videos)' },
          { value: 2, label: 'I occasionally read or attend classes' },
          { value: 3, label: 'I regularly read Islamic books or attend study circles' },
          { value: 4, label: "I'm actively studying with teachers" },
          { value: 5, label: 'Knowledge-seeking is a primary occupation' }
        ]
      }
    ]
  },
  {
    id: 'E',
    title: 'Internal States',
    arabic: 'أحوال القلب',
    description: "The heart's condition",
    questions: [
      {
        id: 'E1',
        text: 'What is your typical internal state during ṣalāh?',
        options: [
          { value: 0, label: 'I rush through without much thought' },
          { value: 1, label: 'My mind wanders constantly' },
          { value: 2, label: 'I have some focus but frequent distraction' },
          { value: 3, label: "I'm generally focused with occasional wandering" },
          { value: 4, label: "I'm usually present and connected" },
          { value: 5, label: "I experience deep khushūʿ and presence with Allah" }
        ]
      },
      {
        id: 'E2',
        text: 'How often do you remember Allah outside of formal worship?',
        options: [
          { value: 0, label: 'Rarely' },
          { value: 1, label: 'A few times a day' },
          { value: 2, label: 'Several times throughout the day' },
          { value: 3, label: 'Frequently — I do adhkār morning/evening' },
          { value: 4, label: 'Very often — Allah is frequently on my tongue and heart' },
          { value: 5, label: 'Almost constantly — dhikr is my default state' }
        ]
      },
      {
        id: 'E3',
        text: 'When difficulties come, what is your internal response?',
        options: [
          { value: 0, label: 'Anger, despair, or complaint against Allah' },
          { value: 1, label: 'Frustration and difficulty accepting' },
          { value: 2, label: 'Initial struggle but eventual acceptance' },
          { value: 3, label: 'Acceptance with patience (ṣabr)' },
          { value: 4, label: 'Acceptance with contentment (riḍā)' },
          { value: 5, label: 'Acceptance with gratitude (shukr)' }
        ]
      },
      {
        id: 'E4',
        text: 'What primarily motivates your worship?',
        options: [
          { value: 0, label: "I don't think about motivation" },
          { value: 1, label: 'Fear of punishment' },
          { value: 2, label: 'Fear mixed with hope for reward' },
          { value: 3, label: 'Hope for reward primarily' },
          { value: 4, label: 'Love of Allah with hope and fear' },
          { value: 5, label: 'Overwhelming love — I worship because He deserves it' }
        ]
      }
    ]
  },
  {
    id: 'F',
    title: 'Character & Relations',
    arabic: 'الأخلاق والمعاملات',
    description: 'Outward character and dealings',
    questions: [
      {
        id: 'F1',
        text: 'How do you generally treat people?',
        options: [
          { value: 0, label: "I'm often harsh, dismissive, or unkind" },
          { value: 1, label: "I'm decent to those I like, not so much to others" },
          { value: 2, label: 'I try to be polite but have frequent conflicts' },
          { value: 3, label: "I'm generally kind and avoid harming others" },
          { value: 4, label: 'I actively try to benefit others and overlook faults' },
          { value: 5, label: 'I embody iḥsān — treating everyone with excellence' }
        ]
      },
      {
        id: 'F2',
        text: 'How do you respond to Muslims who follow different valid opinions?',
        options: [
          { value: 0, label: 'I consider them wrong or misguided' },
          { value: 1, label: "I'm uncomfortable with differences" },
          { value: 2, label: 'I tolerate differences reluctantly' },
          { value: 3, label: 'I accept that valid differences exist' },
          { value: 4, label: "I respect differences and don't judge" },
          { value: 5, label: 'I see beauty in ikhtilāf and pray for all Muslims' }
        ]
      },
      {
        id: 'F3',
        text: 'How much do you serve others (family, community, humanity)?',
        options: [
          { value: 0, label: 'I focus on myself' },
          { value: 1, label: "I help when it's convenient" },
          { value: 2, label: 'I help family regularly' },
          { value: 3, label: 'I help family and occasionally community' },
          { value: 4, label: 'I regularly serve family, community, and beyond' },
          { value: 5, label: 'Service is a core part of my identity' }
        ]
      }
    ]
  }
];

const stations = {
  1: {
    name: 'Complete Negligence',
    arabic: 'التفريط التام',
    category: 'dhalim',
    categoryName: 'Ẓālim li-Nafsihi',
    categoryArabic: 'ظالم لنفسه',
    color: '#B87333',
    figure: 'Fuḍayl ibn ʿIyāḍ',
    figureStory: 'He was a highway robber. One night, climbing a wall to sin, he heard: "Has not the time come for hearts to be humbled?" He said, "Yes, Lord, the time has come." He became one of the greatest saints of Islam.',
    currentState: "You've identified as Muslim but have largely abandoned the practices of Islam.",
    goodNews: ['You are still Muslim — mercy is wide open', 'The Prophet ﷺ said the ẓālim "will be forgiven"', 'Many great Muslims started here'],
    steps: ['Start with ONE prayer daily', 'Add a second prayer after one week', 'Set ONE prayer alarm', "Make duʿāʾ: 'O Allah, help me pray'"]
  },
  2: {
    name: 'Mixed Deeds',
    arabic: 'خلطوا عملاً صالحاً وآخر سيئاً',
    category: 'dhalim',
    categoryName: 'Ẓālim li-Nafsihi',
    categoryArabic: 'ظالم لنفسه',
    color: '#A0522D',
    figure: "ʿAmr ibn al-ʿĀṣ رضي الله عنه",
    figureStory: "A late convert who mixed good and bad. On his deathbed, he asked companions to stay by his grave — his humility and awareness of his mixed state is a model.",
    currentState: 'You do good deeds but mix them with sins. Your acknowledgment of sin is itself a mercy.',
    goodNews: ['Allah mentions your category with hope', 'Acknowledgment of sin is a sign of faith', 'The struggle you feel IS the spiritual life'],
    steps: ['Make five prayers non-negotiable', 'Identify your TOP 3 recurring sins', 'Work on eliminating ONE at a time', 'Find accountability']
  },
  3: {
    name: 'The Riffraff',
    arabic: 'الغوغاء',
    category: 'dhalim',
    categoryName: 'Ẓālim li-Nafsihi',
    categoryArabic: 'ظالم لنفسه',
    color: '#8B4513',
    figure: "Pre-conversion ʿUmar رضي الله عنه",
    figureStory: "Before Islam, ʿUmar wasn't the worst — just harsh and tribal, spending time without higher purpose. That same energy became al-Fārūq.",
    currentState: "You maintain farāʾiḍ but much time is wasted in things of no benefit.",
    goodNews: ['Your foundations are solid', "You're better than those who waste time AND sin", 'You just need to redirect existing time'],
    steps: ['Track every hour for ONE week', "Convert 30% of 'wasted' to 'beneficial'", 'Add 10 min Quran after Fajr', 'Join ONE regular beneficial gathering']
  },
  4: {
    name: 'The Lesser Evil',
    arabic: 'دفع الأشد بالأخف',
    category: 'muqtasid',
    categoryName: 'Muqtaṣid',
    categoryArabic: 'مقتصد',
    color: '#46AF7D',
    figure: 'The Minister of Fez',
    figureStory: "A powerful minister had his sheikh make him sit on a garbage heap and beg. This 'lower' thing broke his ego — he became one of the great awliyāʾ of Morocco.",
    currentState: "You think strategically — engaging in something lower can prevent something worse.",
    goodNews: ["You've moved beyond mere compliance", "You're actively working on your heart", 'Your spiritual cause-and-effect awareness is awakening'],
    steps: ['Make intention for EVERYTHING', 'Build a simple wird', 'Track wird consistency 30 days', 'Study purification of the heart']
  },
  5: {
    name: 'Ennobled Permissibles',
    arabic: 'المباحات الشريفة',
    category: 'muqtasid',
    categoryName: 'Muqtaṣid',
    categoryArabic: 'مقتصد',
    color: '#3A9D6A',
    figure: "ʿAbd al-Raḥmān ibn ʿAwf رضي الله عنه",
    figureStory: "One of the ten promised Paradise, enormously wealthy — but his wealth was worship. He transformed commerce into ʿibādah through intention.",
    currentState: "You transform ordinary activities into worship through intention.",
    goodNews: ["You're living Islam in every moment", 'The mundane has become sacred', 'Your entire life is becoming worship'],
    steps: ['Add disputed good deeds scholars recommend', 'Engage with ikhtilāf', "Learn your madhab's positions", 'Practice "this is valid, this is also valid"']
  },
  6: {
    name: 'Disputed Virtues',
    arabic: 'الفضائل المختلف فيها',
    category: 'muqtasid',
    categoryName: 'Muqtaṣid',
    categoryArabic: 'مقتصد',
    color: '#2E8B57',
    figure: 'Imam al-Shāṭibī',
    figureStory: 'The Andalusian scholar faced criticism for disputed positions. He wrote extensively defending legitimate ikhtilāf while respecting those who differed.',
    currentState: "You engage in acts some call recommended, others permissible — following valid opinions without condemning others.",
    goodNews: ["You're never below mubāḥ", 'You embody the tolerance the Prophet ﷺ wanted', 'You understand ikhtilāf is mercy'],
    steps: ['Ask: "Is this the BEST use of my time?"', 'Learn relative ranks of good deeds', 'Protect your peak spiritual hours', 'Prioritize benefiting others']
  },
  7: {
    name: 'Important Things',
    arabic: 'في المهم',
    category: 'sabiq',
    categoryName: 'Sābiq bil-Khayrāt',
    categoryArabic: 'سابق بالخيرات',
    color: '#B69419',
    figure: 'Ibn Wahb',
    figureStory: "In Mālik's circle, he got up to pray nāfila. Mālik stopped him: 'What you're going to is not more important than what you're in. This IS ʿibādah.'",
    currentState: "You're consistently in something important — your time is purposeful.",
    goodNews: ["You've internalized that learning IS action", 'Your life has purpose and direction', 'You can reach the ʿārifīn through intention'],
    steps: ['Ask: "Is there something MORE important now?"', 'Learn the fiqh of priorities', "Study Ḥanẓala's hadith", 'Examine what MORE important thing you might be missing']
  },
  8: {
    name: 'Hour by Hour',
    arabic: 'ساعة وساعة',
    category: 'sabiq',
    categoryName: 'Sābiq bil-Khayrāt',
    categoryArabic: 'سابق بالخيرات',
    color: '#C5A028',
    figure: 'Ḥanẓala رضي الله عنه',
    figureStory: 'He said "Ḥanẓala has become a hypocrite!" — exalted with the Prophet ﷺ, then preoccupied with family. The Prophet ﷺ said: "Sāʿatun wa sāʿatun — a time for this, a time for that."',
    currentState: 'You practice "a time for this, a time for that" — alternating between important and MORE important.',
    goodNews: ['You recognize different spiritual states', 'Like Ḥanẓala, you feel the difference', 'If always exalted, angels would shake your hands'],
    steps: ['Minimize gap between exalted and ordinary', 'Bring FULL presence to everything', 'Practice continuous dhikr', 'Spend more time with people of Station 9']
  },
  9: {
    name: "Station of the ʿĀrifīn",
    arabic: 'مقام العارفين',
    category: 'sabiq',
    categoryName: 'Sābiq bil-Khayrāt',
    categoryArabic: 'سابق بالخيرات',
    color: '#D4AF37',
    figure: 'Abu Bakr al-Ṣiddīq رضي الله عنه',
    figureStory: "The Prophet ﷺ said: 'If Abu Bakr's īmān were weighed against the entire ummah, his would outweigh it.' Always in the optimal state.",
    currentState: 'If death came now, you would not find anything you would want to increase.',
    goodNews: ['This is the station of the knowers of Allah', "Al-Mawwāq: 'not in the capacity of the majority'", 'Even ʿārifūn slip — perfected only in prophets'],
    steps: ["Never assume you've 'arrived'", 'See yourself as the least of Muslims', 'Your role is helping others climb', 'Your presence should elevate others'],
    warning: "If you scored yourself here, you're probably not in it. The ʿārifūn see themselves as lowest."
  }
};

const calculateStation = (answers) => {
  let totalScore = 0;
  let sectionScores = {};
  sections.forEach(section => {
    let sectionScore = 0;
    section.questions.forEach(q => {
      if (answers[q.id] !== undefined) {
        sectionScore += answers[q.id];
        totalScore += answers[q.id];
      }
    });
    sectionScores[section.id] = sectionScore;
  });
  const prayerScore = answers['A1'] || 0;
  const majorSinsScore = answers['A4'] || 0;
  const acknowledgmentScore = answers['A5'] || 0;
  const sectionAScore = sectionScores['A'] || 0;
  if (prayerScore <= 1) return { station: 1, totalScore, sectionScores };
  if (majorSinsScore <= 1 && acknowledgmentScore >= 2) return { station: 2, totalScore, sectionScores };
  if (sectionAScore < 10) return { station: 1, totalScore, sectionScores };
  if (sectionAScore <= 15) return { station: 2, totalScore, sectionScores };
  if (totalScore <= 20) return { station: 1, totalScore, sectionScores };
  if (totalScore <= 35) return { station: 2, totalScore, sectionScores };
  if (totalScore <= 45) return { station: 3, totalScore, sectionScores };
  if (totalScore <= 55) return { station: 4, totalScore, sectionScores };
  if (totalScore <= 65) return { station: 5, totalScore, sectionScores };
  if (totalScore <= 75) return { station: 6, totalScore, sectionScores };
  if (totalScore <= 85) return { station: 7, totalScore, sectionScores };
  if (totalScore <= 95) return { station: 8, totalScore, sectionScores };
  return { station: 9, totalScore, sectionScores };
};

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);
  const [started, setStarted] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const getCurrentProgress = () => {
    const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
    return Math.round((Object.keys(answers).length / totalQuestions) * 100);
  };

  const canProceed = () => sections[currentSection].questions.every(q => answers[q.id] !== undefined);

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      const calculatedResult = calculateStation(answers);
      setResult(calculatedResult);
      setShowResults(true);
      window.scrollTo(0, 0);
    }
  };

  const resetAssessment = () => {
    setAnswers({});
    setCurrentSection(0);
    setShowResults(false);
    setResult(null);
    setStarted(false);
  };

  // Landing Page
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-amber-50 p-6 flex items-center justify-center">
        <div className="max-w-xl text-center">
          <div className="text-5xl text-amber-400 mb-4 font-arabic">المقامات التسعة</div>
          <h1 className="text-3xl font-light mb-2 tracking-wide">The Nine Maqāmāt</h1>
          <h2 className="text-lg text-slate-400 mb-8">Self-Assessment Tool</h2>
          <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-6 mb-8 text-left">
            <p className="text-xl text-amber-400 text-center mb-3 font-arabic">
              فَمِنْهُمْ ظَالِمٌ لِّنَفْسِهِ وَمِنْهُم مُّقْتَصِدٌ وَمِنْهُمْ سَابِقٌ بِالْخَيْرَاتِ
            </p>
            <p className="text-sm text-slate-400 text-center italic">
              "Among them is he who wrongs himself, he who is moderate, and he who outstrips in good" — Fāṭir 35:32
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-5 mb-6 text-left text-sm">
            <h3 className="text-amber-400 mb-3 font-semibold">Before You Begin:</h3>
            <ul className="text-slate-300 space-y-2 list-disc pl-5">
              <li>This is for <strong className="text-white">personal reflection only</strong></li>
              <li>All nine stations are within Islam and Paradise</li>
              <li>Be honest — this works only with sincerity</li>
            </ul>
          </div>
          <p className="text-slate-500 mb-6 text-sm">22 questions • ~10 minutes • Based on al-Mawwāq's Sunan al-Muhtadīn</p>
          <button
            onClick={() => setStarted(true)}
            className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-lg font-semibold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg hover:shadow-amber-500/25"
          >
            Begin Assessment
          </button>
        </div>
      </div>
    );
  }

  // Results Page
  if (showResults && result) {
    const station = stations[result.station];
    const categoryColors = {
      dhalim: { bg: 'bg-orange-900/20', border: 'border-orange-700/50', text: 'text-orange-400' },
      muqtasid: { bg: 'bg-emerald-900/20', border: 'border-emerald-700/50', text: 'text-emerald-400' },
      sabiq: { bg: 'bg-amber-900/20', border: 'border-amber-600/50', text: 'text-amber-400' }
    };
    const colors = categoryColors[station.category];
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-amber-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Your Station</div>
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold text-slate-900 shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${station.color}, ${station.color}aa)`, boxShadow: `0 0 40px ${station.color}40` }}
            >
              {result.station}
            </div>
            <div className="text-3xl text-amber-400 mb-2 font-arabic">{station.arabic}</div>
            <h1 className="text-2xl font-light mb-3">{station.name}</h1>
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm ${colors.bg} ${colors.border} ${colors.text} border`}>
              {station.categoryArabic} • {station.categoryName}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-amber-400 font-semibold">Your Score</span>
              <span className="text-xl">{result.totalScore}/110</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {sections.map(s => (
                <div key={s.id} className="bg-black/20 rounded-lg p-2">
                  <div className="text-slate-500">{s.id}</div>
                  <div className="text-white">{result.sectionScores[s.id]}/{s.questions.length * 5}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${colors.bg} border-l-4 rounded-r-lg p-5 mb-6`} style={{ borderColor: station.color }}>
            <h3 className={`${colors.text} font-semibold mb-2`}>Your Current State</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{station.currentState}</p>
          </div>

          <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-5 mb-6">
            <h3 className="text-emerald-400 font-semibold mb-3">✦ The Good News</h3>
            <ul className="text-slate-300 text-sm space-y-1.5 list-disc pl-5">
              {station.goodNews.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>

          <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-5 mb-6">
            <h3 className="text-amber-400 font-semibold mb-1">Historical Inspiration</h3>
            <h4 className="text-white text-lg mb-2">{station.figure}</h4>
            <p className="text-slate-400 text-sm italic leading-relaxed">{station.figureStory}</p>
          </div>

          <div className="bg-white/5 rounded-xl p-5 mb-6">
            <h3 className="text-amber-400 font-semibold mb-4">Your Path Forward</h3>
            <div className="space-y-2">
              {station.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 bg-black/20 rounded-lg p-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-900 flex-shrink-0"
                    style={{ background: station.color }}
                  >{i + 1}</div>
                  <span className="text-slate-300 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {station.warning && (
            <div className="bg-orange-900/20 border border-orange-700/30 rounded-lg p-4 mb-6">
              <p className="text-orange-300 text-sm">⚠️ {station.warning}</p>
            </div>
          )}

          <div className="text-center bg-amber-400/5 rounded-xl p-6 mb-6">
            <p className="text-xl text-amber-400 font-arabic mb-1">كلهم من أهل الجنة</p>
            <p className="text-slate-400 text-sm">"All nine categories are people of Paradise"</p>
          </div>

          <div className="text-center">
            <button
              onClick={resetAssessment}
              className="px-6 py-3 bg-white/5 border border-white/20 rounded-lg text-slate-300 hover:bg-white/10 transition-all"
            >
              Retake Assessment
            </button>
          </div>

          <footer className="text-center mt-10 pt-6 border-t border-white/10 text-slate-600 text-xs">
            Based on <em>Sunan al-Muhtadīn</em> by Imam al-Mawwāq • As taught by Sheikh Hamza Yusuf
          </footer>
        </div>
      </div>
    );
  }

  // Questions Page
  const section = sections[currentSection];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-amber-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Section {currentSection + 1}/{sections.length}</span>
            <span className="text-amber-400">{getCurrentProgress()}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${getCurrentProgress()}%` }}
            />
          </div>
        </div>

        <div className="text-center mb-6 pb-4 border-b border-white/10">
          <div className="text-2xl text-amber-400 font-arabic mb-1">{section.arabic}</div>
          <h2 className="text-xl font-light mb-1">{section.title}</h2>
          <p className="text-slate-400 text-sm">{section.description}</p>
        </div>

        <div className="space-y-6">
          {section.questions.map((question, qIndex) => (
            <div 
              key={question.id} 
              className={`bg-white/5 rounded-xl p-5 border transition-all ${answers[question.id] !== undefined ? 'border-amber-400/30' : 'border-transparent'}`}
            >
              <div className="flex gap-3 mb-4">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${answers[question.id] !== undefined ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-slate-400'}`}>
                  {qIndex + 1}
                </span>
                <div>
                  <p className="text-sm md:text-base leading-relaxed">{question.text}</p>
                  {question.subtitle && <p className="text-xs text-slate-500 mt-1 italic">{question.subtitle}</p>}
                </div>
              </div>
              <div className="space-y-2 ml-10">
                {question.options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all text-sm ${
                      answers[question.id] === option.value 
                        ? 'bg-amber-400/15 border border-amber-400/40' 
                        : 'bg-black/20 border border-transparent hover:bg-black/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === option.value}
                      onChange={() => handleAnswer(question.id, option.value)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      answers[question.id] === option.value ? 'border-amber-400' : 'border-slate-600'
                    }`}>
                      {answers[question.id] === option.value && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                    </div>
                    <span className={answers[question.id] === option.value ? 'text-white' : 'text-slate-400'}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
          <button
            onClick={() => { setCurrentSection(prev => prev - 1); window.scrollTo(0, 0); }}
            disabled={currentSection === 0}
            className={`px-5 py-2.5 rounded-lg text-sm ${currentSection === 0 ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold ${
              canProceed() 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500' 
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
          >
            {currentSection === sections.length - 1 ? 'See Results' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
