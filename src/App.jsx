import React, { useState, useRef, useEffect } from 'react';

// ============================================
// GOOGLE ANALYTICS CONFIGURATION
// ============================================
const GA_MEASUREMENT_ID = 'G-686QG2RQN9';

// Initialize Google Analytics
const initGA = () => {
  if (typeof window === 'undefined' || window.gaInitialized) return;
  
  // Initialize dataLayer and gtag function FIRST
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { 
    window.dataLayer.push(arguments); 
  };
  
  // Send initial config (gtag queues these until script loads)
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: 'Nine Maqāmāt Assessment',
    send_page_view: true,
    debug_mode: false
  });
  
  // Now load the gtag.js script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  
  script.onload = () => {
    console.log('GA4 Script loaded successfully');
  };
  
  script.onerror = () => {
    console.error('GA4 Script failed to load');
  };
  
  document.head.appendChild(script);
  window.gaInitialized = true;
  
  console.log('GA4 Initialized with ID:', GA_MEASUREMENT_ID);
};

// Track custom events
const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
    console.log('GA4 Event:', eventName, parameters);
  }
};

// Analytics event names
const GA_EVENTS = {
  // User Journey Events
  ASSESSMENT_STARTED: 'assessment_started',
  SECTION_VIEWED: 'section_viewed',
  SECTION_COMPLETED: 'section_completed',
  QUESTION_ANSWERED: 'question_answered',
  ASSESSMENT_COMPLETED: 'assessment_completed',
  
  // Result Events
  RESULT_VIEWED: 'result_viewed',
  STATION_ACHIEVED: 'station_achieved',
  
  // Interaction Events
  LANGUAGE_CHANGED: 'language_changed',
  SHARE_CLICKED: 'share_clicked',
  SHARE_PLATFORM: 'share_platform',
  DOWNLOAD_CLICKED: 'download_clicked',
  DOWNLOAD_COMPLETED: 'download_completed',
  DASHBOARD_VIEWED: 'dashboard_viewed',
  RETAKE_CLICKED: 'retake_clicked',
  
  // Engagement Events
  TIME_ON_SECTION: 'time_on_section',
  SCROLL_DEPTH: 'scroll_depth'
};

// ============================================
// TRILINGUAL CONTENT (English, Urdu & Arabic)
// ============================================

const content = {
  en: {
    dir: 'ltr',
    fontClass: '',
    title: 'The Nine Maqāmāt',
    subtitle: 'Self-Assessment',
    tagline: 'A Tool for Spiritual Self-Reflection Based on al-Mawwaq\'s Sunan al-Muhtadīn',
    preface: '"The real faqīh is the one who doesn\'t cause people to despair of the mercy of Allah."',
    prefaceNote: 'This assessment is for personal reflection only — not for judging others.',
    remember: [
      'All nine stations are within the fold of Islam',
      'All nine categories are people of Paradise',
      'The street sweeper can be the wali of Allah',
      'Only Allah knows our true station'
    ],
    honesty: 'Be honest with yourself. This tool works only with sincerity.',
    startBtn: 'Begin Assessment',
    section: 'Section',
    next: 'Next Section',
    previous: 'Previous',
    complete: 'Complete Assessment',
    answerAll: 'Please answer all questions',
    results: {
      title: 'Your Spiritual Station',
      category: 'Category',
      score: 'Total Score',
      outOf: 'out of 110',
      keyPrinciple: 'Key Principle',
      example: 'Example',
      inspiration: 'Historical Inspiration',
      pathForward: 'Your Path Forward (Taraqqi)',
      allParadise: 'All Nine Categories Are People of Paradise',
      hadith: 'The Prophet ﷺ said: "Our outstripper (sābiq) is a true outstripper, our moderate one (muqtaṣid) has salvation, and the one who oppressed himself (ẓālim li-nafsihi) is going to be forgiven."',
      faqih: '"The real faqīh is the one who doesn\'t cause people to despair of the mercy of Allah."'
    },
    buttons: {
      share: '📤 Share Result',
      download: '📥 Download Result',
      explained: '📖 Maqāmāt Explained',
      retake: '↺ Retake Assessment',
      back: '← Back to Results',
      downloading: 'Generating...'
    },
    footer: 'Based on Sunan al-Muhtadīn by Imam al-Mawwāq • As taught by Sheikh Hamza Yusuf',
    langSwitch: 'اردو'
  },
  ur: {
    dir: 'rtl',
    fontClass: 'font-urdu',
    title: 'نو مقامات',
    subtitle: 'خود جائزہ',
    tagline: 'امام الموّاق کی سنن المہتدین کی بنیاد پر روحانی خود شناسی کا آلہ',
    preface: '"حقیقی فقیہ وہ ہے جو لوگوں کو اللہ کی رحمت سے مایوس نہیں کرتا۔"',
    prefaceNote: 'یہ جائزہ صرف ذاتی غور و فکر کے لیے ہے — دوسروں کو جج کرنے کے لیے نہیں۔',
    remember: [
      'تمام نو مقامات اسلام کے دائرے میں ہیں',
      'تمام نو زمرے جنت کے لوگ ہیں',
      'صفائی کرنے والا بھی اللہ کا ولی ہو سکتا ہے',
      'صرف اللہ ہمارے حقیقی مقام کو جانتا ہے'
    ],
    honesty: 'اپنے ساتھ ایمانداری سے پیش آئیں۔ یہ آلہ صرف اخلاص کے ساتھ کام کرتا ہے۔',
    startBtn: 'جائزہ شروع کریں',
    section: 'حصہ',
    next: 'اگلا حصہ',
    previous: 'پچھلا',
    complete: 'جائزہ مکمل کریں',
    answerAll: 'براہ کرم تمام سوالات کے جواب دیں',
    results: {
      title: 'آپ کا روحانی مقام',
      category: 'زمرہ',
      score: 'کل سکور',
      outOf: '110 میں سے',
      keyPrinciple: 'کلیدی اصول',
      example: 'مثال',
      inspiration: 'تاریخی تحریک',
      pathForward: 'آپ کا راستہ آگے (ترقی)',
      allParadise: 'تمام نو زمرے جنت کے لوگ ہیں',
      hadith: 'نبی کریم ﷺ نے فرمایا: "ہمارا سابق حقیقی سابق ہے، ہمارا مقتصد نجات پانے والا ہے، اور جس نے اپنے آپ پر ظلم کیا وہ بخشا جائے گا۔"',
      faqih: '"حقیقی فقیہ وہ ہے جو لوگوں کو اللہ کی رحمت سے مایوس نہیں کرتا۔"'
    },
    buttons: {
      share: '📤 نتیجہ شیئر کریں',
      download: '📥 نتیجہ ڈاؤن لوڈ کریں',
      explained: '📖 مقامات کی وضاحت',
      retake: '↺ دوبارہ جائزہ لیں',
      back: '→ نتائج پر واپس',
      downloading: 'بنایا جا رہا ہے...'
    },
    footer: 'امام الموّاق کی سنن المہتدین کی بنیاد پر • شیخ حمزہ یوسف کی تعلیمات',
    langSwitch: 'العربية'
  },
  ar: {
    dir: 'rtl',
    fontClass: 'font-arabic',
    title: 'المقامات التسعة',
    subtitle: 'تقييم ذاتي',
    tagline: 'أداة للتأمل الروحي بناءً على سنن المهتدين للإمام الموّاق',
    preface: '"الفقيه الحقيقي هو الذي لا يُقنّط الناس من رحمة الله."',
    prefaceNote: 'هذا التقييم للتأمل الشخصي فقط — وليس للحكم على الآخرين.',
    remember: [
      'جميع المقامات التسعة داخل دائرة الإسلام',
      'جميع الفئات التسع من أهل الجنة',
      'الكنّاس قد يكون وليّاً من أولياء الله',
      'الله وحده يعلم مقامنا الحقيقي'
    ],
    honesty: 'كن صادقاً مع نفسك. هذه الأداة تعمل فقط مع الإخلاص.',
    startBtn: 'ابدأ التقييم',
    section: 'القسم',
    next: 'القسم التالي',
    previous: 'السابق',
    complete: 'إتمام التقييم',
    answerAll: 'يرجى الإجابة على جميع الأسئلة',
    results: {
      title: 'مقامك الروحي',
      category: 'الفئة',
      score: 'المجموع الكلي',
      outOf: 'من 110',
      keyPrinciple: 'المبدأ الأساسي',
      example: 'مثال',
      inspiration: 'إلهام تاريخي',
      pathForward: 'طريقك للترقّي',
      allParadise: 'جميع الفئات التسع من أهل الجنة',
      hadith: 'قال النبي ﷺ: "سابقنا سابق، ومقتصدنا ناجٍ، وظالمنا لنفسه مغفور له."',
      faqih: '"الفقيه الحقيقي هو الذي لا يُقنّط الناس من رحمة الله."'
    },
    buttons: {
      share: '📤 مشاركة النتيجة',
      download: '📥 تحميل النتيجة',
      explained: '📖 شرح المقامات',
      retake: '↺ إعادة التقييم',
      back: '← العودة للنتائج',
      downloading: 'جارٍ التحميل...'
    },
    footer: 'بناءً على سنن المهتدين للإمام الموّاق • كما علّمها الشيخ حمزة يوسف',
    langSwitch: 'English'
  }
};

// ============================================
// SECTIONS DATA (Trilingual)
// ============================================

const sectionsData = {
  en: [
    {
      id: 'foundations',
      title: 'The Foundations',
      arabic: 'الأساسيات',
      description: 'Assessment of obligatory acts (Farā\'iḍ)',
      questions: [
        {
          id: 'prayer',
          text: 'How consistent are you with the five daily prayers?',
          options: [
            { value: 0, label: 'I rarely pray or have abandoned prayer almost entirely' },
            { value: 1, label: 'I pray sometimes but miss many prayers regularly' },
            { value: 2, label: 'I pray most prayers but frequently miss one or two daily' },
            { value: 3, label: 'I pray all five but sometimes miss them (making up later)' },
            { value: 4, label: 'I pray all five consistently, rarely missing any' },
            { value: 5, label: 'I pray all five on time and add regular nawafil' }
          ]
        },
        {
          id: 'fasting',
          text: 'How do you approach the obligatory fast of Ramadan?',
          options: [
            { value: 0, label: 'I don\'t fast Ramadan' },
            { value: 1, label: 'I fast some days but not consistently' },
            { value: 2, label: 'I fast most of Ramadan with some missed days (not made up)' },
            { value: 3, label: 'I fast Ramadan completely, making up any missed days' },
            { value: 4, label: 'I fast Ramadan and occasionally fast voluntary fasts' },
            { value: 5, label: 'I fast Ramadan plus regular sunnah fasts' }
          ]
        },
        {
          id: 'zakat',
          text: 'If zakat is obligatory on you, how do you handle it?',
          options: [
            { value: 0, label: 'I don\'t pay zakat even though it\'s obligatory on me' },
            { value: 1, label: 'I pay zakat inconsistently or less than required' },
            { value: 2, label: 'I pay zakat but without careful calculation' },
            { value: 3, label: 'I pay zakat correctly and on time' },
            { value: 4, label: 'I pay zakat and give regular sadaqah' },
            { value: 5, label: 'I pay zakat, give regular sadaqah, and seek out those in need' }
          ]
        },
        {
          id: 'sins',
          text: 'How would you describe your relationship with major sins?',
          options: [
            { value: 0, label: 'I\'m involved in major sins without concern' },
            { value: 1, label: 'I commit major sins but feel guilty afterward' },
            { value: 2, label: 'I struggle with major sins, making tawbah but relapsing' },
            { value: 3, label: 'I avoid most major sins but slip occasionally' },
            { value: 4, label: 'I consistently avoid major sins' },
            { value: 5, label: 'I avoid major sins and am cautious about doubtful matters' }
          ]
        }
      ]
    },
    {
      id: 'time',
      title: 'Time & Priorities',
      arabic: 'الوقت والأولويات',
      description: 'How you spend your time',
      questions: [
        {
          id: 'leisure',
          text: 'How do you typically spend your free time?',
          options: [
            { value: 0, label: 'Entertainment with no benefit (excessive gaming, social media)' },
            { value: 1, label: 'Mostly entertainment with occasional beneficial activities' },
            { value: 2, label: 'A mix of entertainment and beneficial activities' },
            { value: 3, label: 'Mostly beneficial activities with some entertainment' },
            { value: 4, label: 'Almost all time in beneficial activities' },
            { value: 5, label: 'I consciously choose the MOST beneficial activity at each moment' }
          ]
        },
        {
          id: 'death_test',
          text: 'If death came RIGHT NOW, how would you feel about what you\'re doing?',
          options: [
            { value: 0, label: 'I\'d be embarrassed or regretful' },
            { value: 1, label: 'I\'d wish I was doing something better' },
            { value: 2, label: 'I\'d feel okay — it\'s not bad, just not great' },
            { value: 3, label: 'I\'d feel reasonably content' },
            { value: 4, label: 'I\'d feel good — this is worthwhile' },
            { value: 5, label: 'I\'d feel completely at peace — this is exactly what I should be doing' }
          ]
        },
        {
          id: 'priorities',
          text: 'When choosing between activities, do you consider what\'s MORE important?',
          options: [
            { value: 0, label: 'I don\'t think about importance — I do what I feel like' },
            { value: 1, label: 'I sometimes consider what\'s important' },
            { value: 2, label: 'I usually choose important things over trivial things' },
            { value: 3, label: 'I consistently choose important activities' },
            { value: 4, label: 'I often weigh between important options to find what\'s MORE important' },
            { value: 5, label: 'I habitually seek the MOST important thing I could be doing' }
          ]
        },
        {
          id: 'wasted',
          text: 'In an average week, how many hours do you feel are truly "wasted"?',
          options: [
            { value: 0, label: '20+ hours' },
            { value: 1, label: '15-20 hours' },
            { value: 2, label: '10-15 hours' },
            { value: 3, label: '5-10 hours' },
            { value: 4, label: '2-5 hours' },
            { value: 5, label: 'Less than 2 hours — I\'m intentional with almost all my time' }
          ]
        }
      ]
    },
    {
      id: 'intention',
      title: 'Intention & Transformation',
      arabic: 'النية والتحول',
      description: 'The spiritual quality of your actions',
      questions: [
        {
          id: 'niyyah',
          text: 'How often do you consciously make intention (niyyah) before daily activities?',
          options: [
            { value: 0, label: 'Rarely — I just do things' },
            { value: 1, label: 'Only before acts of worship' },
            { value: 2, label: 'Sometimes before important activities' },
            { value: 3, label: 'Often — I try to have good intentions' },
            { value: 4, label: 'Usually — I consciously intend for Allah\'s sake' },
            { value: 5, label: 'Almost always — eating, sleeping, working, everything is framed with intention' }
          ]
        },
        {
          id: 'transform',
          text: 'Do you transform permissible activities into worship through intention?',
          subtitle: 'Example: Eating to have strength for \'ibadah, sleeping to rest for tahajjud',
          options: [
            { value: 0, label: 'I never thought about this' },
            { value: 1, label: 'I\'ve heard of this but don\'t practice it' },
            { value: 2, label: 'I try occasionally' },
            { value: 3, label: 'I do this somewhat regularly' },
            { value: 4, label: 'I do this with most daily activities' },
            { value: 5, label: 'This is my habitual state — almost everything is intentional worship' }
          ]
        },
        {
          id: 'lesser',
          text: 'Do you consciously engage in "lesser" activities to prevent worse ones?',
          subtitle: 'Example: Permissible entertainment to avoid haram',
          options: [
            { value: 0, label: 'I don\'t think strategically about avoiding sin' },
            { value: 1, label: 'I try to avoid sin but don\'t use substitutes' },
            { value: 2, label: 'I sometimes use this strategy' },
            { value: 3, label: 'I regularly employ this principle' },
            { value: 4, label: 'I actively plan my life around this principle' },
            { value: 5, label: 'I\'ve structured my entire lifestyle to minimize exposure to sin' }
          ]
        }
      ]
    },
    {
      id: 'knowledge',
      title: 'Knowledge & Practice',
      arabic: 'العلم والعمل',
      description: 'Engagement with learning and worship',
      questions: [
        {
          id: 'disputed',
          text: 'How do you approach acts where scholars differ?',
          subtitle: 'e.g., du\'a after prayer, mawlid, group dhikr',
          options: [
            { value: 0, label: 'I don\'t know about these differences' },
            { value: 1, label: 'I avoid anything with any scholarly dispute' },
            { value: 2, label: 'I\'m cautious but occasionally participate' },
            { value: 3, label: 'I participate in acts that trustworthy scholars permit' },
            { value: 4, label: 'I actively seek out recommended acts even if some scholars dispute them' },
            { value: 5, label: 'I follow valid scholarly positions while respecting those who differ' }
          ]
        },
        {
          id: 'nawafil',
          text: 'How consistent are you with voluntary acts of worship?',
          options: [
            { value: 0, label: 'I don\'t do voluntary worship' },
            { value: 1, label: 'I occasionally do nawafil when I feel like it' },
            { value: 2, label: 'I have some regular nawafil (e.g., sunnah prayers)' },
            { value: 3, label: 'I\'m consistent with several nawafil' },
            { value: 4, label: 'I have a structured wird (daily practice) I maintain' },
            { value: 5, label: 'I have extensive awrad and rarely miss them' }
          ]
        },
        {
          id: 'seeking',
          text: 'How actively do you pursue Islamic knowledge?',
          options: [
            { value: 0, label: 'I don\'t actively seek knowledge' },
            { value: 1, label: 'I learn passively (hearing khutbahs, occasional videos)' },
            { value: 2, label: 'I occasionally read or attend classes' },
            { value: 3, label: 'I regularly read Islamic books or attend study circles' },
            { value: 4, label: 'I\'m actively studying with teachers or a structured curriculum' },
            { value: 5, label: 'Knowledge-seeking is a primary occupation — I study daily' }
          ]
        }
      ]
    },
    {
      id: 'heart',
      title: 'Internal States',
      arabic: 'أحوال القلب',
      description: 'The condition of your heart',
      questions: [
        {
          id: 'khushu',
          text: 'What is your typical internal state during salah?',
          options: [
            { value: 0, label: 'I rush through without much thought' },
            { value: 1, label: 'My mind wanders constantly' },
            { value: 2, label: 'I have some focus but frequent distraction' },
            { value: 3, label: 'I\'m generally focused with occasional wandering' },
            { value: 4, label: 'I\'m usually present and connected' },
            { value: 5, label: 'I experience deep khushu\' and presence with Allah' }
          ]
        },
        {
          id: 'dhikr',
          text: 'How often do you remember Allah outside of formal worship?',
          options: [
            { value: 0, label: 'Rarely' },
            { value: 1, label: 'A few times a day' },
            { value: 2, label: 'Several times throughout the day' },
            { value: 3, label: 'Frequently — I do adhkar morning/evening' },
            { value: 4, label: 'Very often — Allah is frequently on my tongue and heart' },
            { value: 5, label: 'Almost constantly — dhikr is my default state' }
          ]
        },
        {
          id: 'qadr',
          text: 'When difficulties come, what is your internal response?',
          options: [
            { value: 0, label: 'Anger, despair, or complaint against Allah' },
            { value: 1, label: 'Frustration and difficulty accepting' },
            { value: 2, label: 'Initial struggle but eventual acceptance' },
            { value: 3, label: 'Acceptance with patience (sabr)' },
            { value: 4, label: 'Acceptance with contentment (rida)' },
            { value: 5, label: 'Acceptance with gratitude (shukr) — seeing wisdom in the trial' }
          ]
        }
      ]
    },
    {
      id: 'character',
      title: 'Character & Relations',
      arabic: 'الأخلاق والمعاملات',
      description: 'How you treat others',
      questions: [
        {
          id: 'treatment',
          text: 'How do you generally treat people?',
          options: [
            { value: 0, label: 'I\'m often harsh, dismissive, or unkind' },
            { value: 1, label: 'I\'m decent to those I like, not so much to others' },
            { value: 2, label: 'I try to be polite but have frequent conflicts' },
            { value: 3, label: 'I\'m generally kind and avoid harming others' },
            { value: 4, label: 'I actively try to benefit others and overlook faults' },
            { value: 5, label: 'I embody ihsan — treating everyone with excellence' }
          ]
        },
        {
          id: 'tolerance',
          text: 'How do you respond to Muslims who follow different valid opinions?',
          options: [
            { value: 0, label: 'I consider them wrong or misguided' },
            { value: 1, label: 'I\'m uncomfortable with differences' },
            { value: 2, label: 'I tolerate differences reluctantly' },
            { value: 3, label: 'I accept that valid differences exist' },
            { value: 4, label: 'I respect differences and don\'t judge' },
            { value: 5, label: 'I see beauty in ikhtilaf and pray for all Muslims' }
          ]
        },
        {
          id: 'service',
          text: 'How much do you engage in serving others?',
          options: [
            { value: 0, label: 'I focus on myself' },
            { value: 1, label: 'I help when it\'s convenient' },
            { value: 2, label: 'I help family regularly' },
            { value: 3, label: 'I help family and occasionally community' },
            { value: 4, label: 'I regularly serve family, community, and beyond' },
            { value: 5, label: 'Service is a core part of my identity' }
          ]
        }
      ]
    }
  ],
  ur: [
    {
      id: 'foundations',
      title: 'بنیادی باتیں',
      arabic: 'الأساسيات',
      description: 'فرائض کا جائزہ',
      questions: [
        {
          id: 'prayer',
          text: 'آپ پانچ وقت کی نماز میں کتنے پابند ہیں؟',
          options: [
            { value: 0, label: 'میں شاذ و نادر ہی نماز پڑھتا ہوں یا تقریباً چھوڑ دی ہے' },
            { value: 1, label: 'میں کبھی کبھار پڑھتا ہوں لیکن اکثر نمازیں چھوٹ جاتی ہیں' },
            { value: 2, label: 'میں زیادہ تر نمازیں پڑھتا ہوں لیکن روزانہ ایک دو چھوٹ جاتی ہیں' },
            { value: 3, label: 'میں پانچوں پڑھتا ہوں لیکن کبھی کبھار چھوٹ جاتی ہیں (بعد میں قضا کرتا ہوں)' },
            { value: 4, label: 'میں پانچوں باقاعدگی سے پڑھتا ہوں، شاذ و نادر ہی چھوٹتی ہیں' },
            { value: 5, label: 'میں پانچوں وقت پر پڑھتا ہوں اور نوافل بھی ادا کرتا ہوں' }
          ]
        },
        {
          id: 'fasting',
          text: 'آپ رمضان کے فرض روزوں کے بارے میں کیا رویہ رکھتے ہیں؟',
          options: [
            { value: 0, label: 'میں رمضان کے روزے نہیں رکھتا' },
            { value: 1, label: 'میں کچھ دن روزے رکھتا ہوں لیکن باقاعدگی سے نہیں' },
            { value: 2, label: 'میں رمضان کے زیادہ تر روزے رکھتا ہوں کچھ چھوٹ جاتے ہیں (قضا نہیں)' },
            { value: 3, label: 'میں پورے رمضان کے روزے رکھتا ہوں، چھوٹے ہوئے کی قضا کرتا ہوں' },
            { value: 4, label: 'میں رمضان کے روزے رکھتا ہوں اور کبھی کبھار نفلی روزے بھی' },
            { value: 5, label: 'میں رمضان کے علاوہ سنت روزے بھی رکھتا ہوں (پیر، جمعرات، ایام بیض)' }
          ]
        },
        {
          id: 'zakat',
          text: 'اگر زکوٰۃ آپ پر فرض ہے تو آپ اسے کیسے ادا کرتے ہیں؟',
          options: [
            { value: 0, label: 'میں زکوٰۃ ادا نہیں کرتا حالانکہ فرض ہے' },
            { value: 1, label: 'میں زکوٰۃ بے قاعدگی سے یا کم ادا کرتا ہوں' },
            { value: 2, label: 'میں زکوٰۃ دیتا ہوں لیکن درست حساب کے بغیر' },
            { value: 3, label: 'میں زکوٰۃ درست طریقے سے وقت پر ادا کرتا ہوں' },
            { value: 4, label: 'میں زکوٰۃ اور باقاعدہ صدقہ دیتا ہوں' },
            { value: 5, label: 'میں زکوٰۃ، صدقہ دیتا ہوں اور ضرورت مندوں کو تلاش کرتا ہوں' }
          ]
        },
        {
          id: 'sins',
          text: 'کبیرہ گناہوں سے آپ کا کیا تعلق ہے؟',
          options: [
            { value: 0, label: 'میں کبیرہ گناہوں میں ملوث ہوں بغیر کسی فکر کے' },
            { value: 1, label: 'میں کبیرہ گناہ کرتا ہوں لیکن بعد میں ندامت محسوس کرتا ہوں' },
            { value: 2, label: 'میں کبیرہ گناہوں سے جدوجہد کرتا ہوں، توبہ کرتا ہوں پھر لوٹ آتا ہوں' },
            { value: 3, label: 'میں زیادہ تر کبیرہ گناہوں سے بچتا ہوں لیکن کبھی کبھار ہو جاتا ہے' },
            { value: 4, label: 'میں مسلسل کبیرہ گناہوں سے بچتا ہوں' },
            { value: 5, label: 'میں کبیرہ گناہوں سے بچتا ہوں اور مشتبہ چیزوں سے بھی محتاط ہوں' }
          ]
        }
      ]
    },
    {
      id: 'time',
      title: 'وقت اور ترجیحات',
      arabic: 'الوقت والأولويات',
      description: 'آپ اپنا وقت کیسے گزارتے ہیں',
      questions: [
        {
          id: 'leisure',
          text: 'آپ عموماً اپنا فارغ وقت کیسے گزارتے ہیں؟',
          options: [
            { value: 0, label: 'بے فائدہ تفریح (زیادہ گیمنگ، سوشل میڈیا)' },
            { value: 1, label: 'زیادہ تر تفریح، کبھی کبھار فائدہ مند سرگرمیاں' },
            { value: 2, label: 'تفریح اور فائدہ مند سرگرمیوں کا مرکب' },
            { value: 3, label: 'زیادہ تر فائدہ مند سرگرمیاں، کچھ تفریح' },
            { value: 4, label: 'تقریباً سارا وقت فائدہ مند سرگرمیوں میں' },
            { value: 5, label: 'میں شعوری طور پر ہر لمحے سب سے زیادہ فائدہ مند کام چنتا ہوں' }
          ]
        },
        {
          id: 'death_test',
          text: 'اگر ابھی موت آ جائے تو آپ جو کر رہے ہیں اس پر کیسا محسوس کریں گے؟',
          options: [
            { value: 0, label: 'شرمندگی یا پچھتاوا' },
            { value: 1, label: 'کاش کچھ بہتر کر رہا ہوتا' },
            { value: 2, label: 'ٹھیک ہے — برا نہیں، بہت اچھا بھی نہیں' },
            { value: 3, label: 'کافی مطمئن' },
            { value: 4, label: 'اچھا — یہ قابل قدر ہے' },
            { value: 5, label: 'مکمل سکون — یہی کرنا چاہیے تھا' }
          ]
        },
        {
          id: 'priorities',
          text: 'سرگرمیوں میں انتخاب کرتے وقت کیا آپ "زیادہ اہم" پر غور کرتے ہیں؟',
          options: [
            { value: 0, label: 'میں اہمیت کے بارے میں نہیں سوچتا — جو دل چاہے کرتا ہوں' },
            { value: 1, label: 'کبھی کبھار اہمیت پر غور کرتا ہوں' },
            { value: 2, label: 'عموماً اہم چیزیں معمولی سے پہلے چنتا ہوں' },
            { value: 3, label: 'مسلسل اہم سرگرمیاں چنتا ہوں' },
            { value: 4, label: 'اکثر اہم آپشنز میں "زیادہ اہم" تلاش کرتا ہوں' },
            { value: 5, label: 'عادتاً "سب سے زیادہ اہم" کام تلاش کرتا ہوں' }
          ]
        },
        {
          id: 'wasted',
          text: 'اوسطاً ہفتے میں کتنے گھنٹے "ضائع" ہوتے ہیں؟',
          options: [
            { value: 0, label: '20+ گھنٹے' },
            { value: 1, label: '15-20 گھنٹے' },
            { value: 2, label: '10-15 گھنٹے' },
            { value: 3, label: '5-10 گھنٹے' },
            { value: 4, label: '2-5 گھنٹے' },
            { value: 5, label: '2 گھنٹے سے کم — میں تقریباً سارے وقت کا مقصد رکھتا ہوں' }
          ]
        }
      ]
    },
    {
      id: 'intention',
      title: 'نیت اور تبدیلی',
      arabic: 'النية والتحول',
      description: 'آپ کے اعمال کی روحانی کیفیت',
      questions: [
        {
          id: 'niyyah',
          text: 'روزمرہ کاموں سے پہلے کتنی بار شعوری نیت کرتے ہیں؟',
          options: [
            { value: 0, label: 'شاذ و نادر — بس کر لیتا ہوں' },
            { value: 1, label: 'صرف عبادت سے پہلے' },
            { value: 2, label: 'کبھی کبھار اہم کاموں سے پہلے' },
            { value: 3, label: 'اکثر — اچھی نیت رکھنے کی کوشش کرتا ہوں' },
            { value: 4, label: 'عموماً — شعوری طور پر اللہ کے لیے نیت کرتا ہوں' },
            { value: 5, label: 'تقریباً ہمیشہ — کھانا، سونا، کام، سب کچھ نیت کے ساتھ' }
          ]
        },
        {
          id: 'transform',
          text: 'کیا آپ مباح کاموں کو نیت سے عبادت میں بدلتے ہیں؟',
          subtitle: 'مثال: عبادت کی طاقت کے لیے کھانا، تہجد کے لیے سونا',
          options: [
            { value: 0, label: 'میں نے اس بارے میں کبھی نہیں سوچا' },
            { value: 1, label: 'سنا ہے لیکن عمل نہیں کرتا' },
            { value: 2, label: 'کبھی کبھار کوشش کرتا ہوں' },
            { value: 3, label: 'کافی باقاعدگی سے کرتا ہوں' },
            { value: 4, label: 'زیادہ تر روزمرہ کاموں میں کرتا ہوں' },
            { value: 5, label: 'یہ میری عادت ہے — تقریباً سب کچھ عبادت ہے' }
          ]
        },
        {
          id: 'lesser',
          text: 'کیا آپ "کم" کاموں سے "بدتر" سے بچنے کی کوشش کرتے ہیں؟',
          subtitle: 'مثال: حرام سے بچنے کے لیے مباح تفریح',
          options: [
            { value: 0, label: 'میں گناہ سے بچنے کی حکمت عملی نہیں سوچتا' },
            { value: 1, label: 'گناہ سے بچنے کی کوشش کرتا ہوں لیکن متبادل نہیں' },
            { value: 2, label: 'کبھی کبھار یہ حکمت عملی استعمال کرتا ہوں' },
            { value: 3, label: 'باقاعدگی سے یہ اصول استعمال کرتا ہوں' },
            { value: 4, label: 'اپنی زندگی کی منصوبہ بندی اسی اصول پر کرتا ہوں' },
            { value: 5, label: 'میں نے اپنی پوری طرز زندگی گناہ سے بچنے کے لیے ترتیب دی ہے' }
          ]
        }
      ]
    },
    {
      id: 'knowledge',
      title: 'علم اور عمل',
      arabic: 'العلم والعمل',
      description: 'سیکھنے اور عبادت میں مشغولیت',
      questions: [
        {
          id: 'disputed',
          text: 'جن معاملات میں علماء کا اختلاف ہے ان کے بارے میں آپ کا رویہ کیا ہے؟',
          subtitle: 'مثلاً: نماز کے بعد دعا، میلاد، اجتماعی ذکر',
          options: [
            { value: 0, label: 'مجھے ان اختلافات کا علم نہیں' },
            { value: 1, label: 'جس میں بھی اختلاف ہو اس سے بچتا ہوں' },
            { value: 2, label: 'محتاط ہوں لیکن کبھی کبھار شامل ہوتا ہوں' },
            { value: 3, label: 'جو معتبر علماء اجازت دیں اس میں شامل ہوتا ہوں' },
            { value: 4, label: 'مستحب اعمال تلاش کرتا ہوں چاہے کچھ علماء اختلاف کریں' },
            { value: 5, label: 'درست علمی موقف کی پیروی کرتا ہوں اور مختلف رائے کا احترام کرتا ہوں' }
          ]
        },
        {
          id: 'nawafil',
          text: 'نفلی عبادات میں آپ کتنے پابند ہیں؟',
          options: [
            { value: 0, label: 'میں نفلی عبادت نہیں کرتا' },
            { value: 1, label: 'جب دل چاہے کبھی کبھار نوافل پڑھتا ہوں' },
            { value: 2, label: 'کچھ باقاعدہ نوافل ہیں (مثلاً سنت نمازیں)' },
            { value: 3, label: 'کئی نوافل میں پابند ہوں' },
            { value: 4, label: 'ایک مرتب ورد ہے جسے برقرار رکھتا ہوں' },
            { value: 5, label: 'وسیع اوراد ہیں اور شاذ و نادر ہی چھوڑتا ہوں' }
          ]
        },
        {
          id: 'seeking',
          text: 'آپ اسلامی علم کتنی فعالی سے حاصل کرتے ہیں؟',
          options: [
            { value: 0, label: 'میں فعال طور پر علم حاصل نہیں کرتا' },
            { value: 1, label: 'غیر فعال طور پر سیکھتا ہوں (خطبے، کبھی کبھار ویڈیوز)' },
            { value: 2, label: 'کبھی کبھار پڑھتا ہوں یا کلاسز میں جاتا ہوں' },
            { value: 3, label: 'باقاعدگی سے اسلامی کتابیں پڑھتا ہوں یا درس میں جاتا ہوں' },
            { value: 4, label: 'استاد کے ساتھ یا منظم نصاب میں پڑھ رہا ہوں' },
            { value: 5, label: 'علم حاصل کرنا بنیادی مشغلہ ہے — روزانہ پڑھتا ہوں' }
          ]
        }
      ]
    },
    {
      id: 'heart',
      title: 'دل کے احوال',
      arabic: 'أحوال القلب',
      description: 'آپ کے دل کی کیفیت',
      questions: [
        {
          id: 'khushu',
          text: 'نماز میں آپ کی عام داخلی کیفیت کیا ہوتی ہے؟',
          options: [
            { value: 0, label: 'جلدی جلدی پڑھ لیتا ہوں بغیر زیادہ سوچے' },
            { value: 1, label: 'ذہن مسلسل بھٹکتا رہتا ہے' },
            { value: 2, label: 'کچھ توجہ ہوتی ہے لیکن اکثر بھٹکاؤ' },
            { value: 3, label: 'عموماً توجہ رہتی ہے، کبھی کبھار بھٹکاؤ' },
            { value: 4, label: 'عموماً حاضر اور متصل رہتا ہوں' },
            { value: 5, label: 'گہرا خشوع اور اللہ کے ساتھ حضوری محسوس کرتا ہوں' }
          ]
        },
        {
          id: 'dhikr',
          text: 'باقاعدہ عبادت کے علاوہ اللہ کو کتنی بار یاد کرتے ہیں؟',
          options: [
            { value: 0, label: 'شاذ و نادر' },
            { value: 1, label: 'دن میں چند بار' },
            { value: 2, label: 'دن بھر میں کئی بار' },
            { value: 3, label: 'اکثر — صبح شام اذکار کرتا ہوں' },
            { value: 4, label: 'بہت زیادہ — اللہ کا ذکر زبان اور دل پر رہتا ہے' },
            { value: 5, label: 'تقریباً مسلسل — ذکر میری عادت ہے' }
          ]
        },
        {
          id: 'qadr',
          text: 'مشکلات آنے پر آپ کا داخلی ردعمل کیا ہوتا ہے؟',
          options: [
            { value: 0, label: 'غصہ، مایوسی، یا اللہ سے شکایت' },
            { value: 1, label: 'پریشانی اور قبول کرنے میں مشکل' },
            { value: 2, label: 'پہلے جدوجہد پھر آخرکار قبول' },
            { value: 3, label: 'صبر کے ساتھ قبول' },
            { value: 4, label: 'رضا کے ساتھ قبول' },
            { value: 5, label: 'شکر کے ساتھ قبول — آزمائش میں حکمت دیکھتا ہوں' }
          ]
        }
      ]
    },
    {
      id: 'character',
      title: 'اخلاق اور معاملات',
      arabic: 'الأخلاق والمعاملات',
      description: 'آپ دوسروں کے ساتھ کیسے پیش آتے ہیں',
      questions: [
        {
          id: 'treatment',
          text: 'عموماً آپ لوگوں کے ساتھ کیسے پیش آتے ہیں؟',
          options: [
            { value: 0, label: 'اکثر سخت، نظرانداز کرنے والا، یا بدتمیز' },
            { value: 1, label: 'جو پسند ہیں ان سے اچھا، دوسروں سے نہیں' },
            { value: 2, label: 'شائستہ رہنے کی کوشش لیکن اکثر تنازعات' },
            { value: 3, label: 'عموماً مہربان اور دوسروں کو نقصان سے بچاتا ہوں' },
            { value: 4, label: 'فعال طور پر دوسروں کو فائدہ پہنچاتا اور غلطیاں معاف کرتا ہوں' },
            { value: 5, label: 'احسان کرتا ہوں — سب کے ساتھ عمدگی سے پیش آتا ہوں' }
          ]
        },
        {
          id: 'tolerance',
          text: 'جو مسلمان مختلف درست آراء پر عمل کرتے ہیں ان کے بارے میں کیا رویہ ہے؟',
          options: [
            { value: 0, label: 'انہیں غلط یا گمراہ سمجھتا ہوں' },
            { value: 1, label: 'اختلافات سے بے چینی محسوس کرتا ہوں' },
            { value: 2, label: 'بادل نخواستہ اختلاف برداشت کرتا ہوں' },
            { value: 3, label: 'قبول کرتا ہوں کہ درست اختلاف ہو سکتا ہے' },
            { value: 4, label: 'اختلاف کا احترام کرتا ہوں اور فیصلہ نہیں کرتا' },
            { value: 5, label: 'اختلاف میں خوبصورتی دیکھتا ہوں اور سب مسلمانوں کے لیے دعا کرتا ہوں' }
          ]
        },
        {
          id: 'service',
          text: 'دوسروں کی خدمت میں کتنے مشغول ہیں؟',
          options: [
            { value: 0, label: 'اپنے آپ پر توجہ دیتا ہوں' },
            { value: 1, label: 'جب آسان ہو مدد کرتا ہوں' },
            { value: 2, label: 'خاندان کی باقاعدگی سے مدد کرتا ہوں' },
            { value: 3, label: 'خاندان اور کبھی کبھار کمیونٹی کی مدد' },
            { value: 4, label: 'خاندان، کمیونٹی اور اس سے آگے باقاعدگی سے خدمت' },
            { value: 5, label: 'خدمت میری شناخت کا بنیادی حصہ ہے' }
          ]
        }
      ]
    }
  ],
  ar: [
    {
      id: 'foundations',
      title: 'الأساسيات',
      arabic: 'الأساسيات',
      description: 'تقييم الفرائض',
      questions: [
        {
          id: 'prayer',
          text: 'ما مدى محافظتك على الصلوات الخمس؟',
          options: [
            { value: 0, label: 'نادراً ما أصلي أو تركت الصلاة تقريباً' },
            { value: 1, label: 'أصلي أحياناً لكن تفوتني صلوات كثيرة' },
            { value: 2, label: 'أصلي معظم الصلوات لكن تفوتني واحدة أو اثنتان يومياً' },
            { value: 3, label: 'أصلي الخمس لكن أحياناً تفوتني (أقضيها لاحقاً)' },
            { value: 4, label: 'أصلي الخمس بانتظام، نادراً ما تفوتني' },
            { value: 5, label: 'أصلي الخمس في وقتها وأضيف النوافل' }
          ]
        },
        {
          id: 'fasting',
          text: 'كيف تتعامل مع صيام رمضان الواجب؟',
          options: [
            { value: 0, label: 'لا أصوم رمضان' },
            { value: 1, label: 'أصوم بعض الأيام لكن ليس بانتظام' },
            { value: 2, label: 'أصوم معظم رمضان مع بعض الأيام الفائتة (غير مقضية)' },
            { value: 3, label: 'أصوم رمضان كاملاً وأقضي ما فاتني' },
            { value: 4, label: 'أصوم رمضان وأصوم أحياناً صياماً تطوعياً' },
            { value: 5, label: 'أصوم رمضان وصيام السنة بانتظام' }
          ]
        },
        {
          id: 'zakat',
          text: 'إذا كانت الزكاة واجبة عليك، كيف تؤديها؟',
          options: [
            { value: 0, label: 'لا أدفع الزكاة رغم وجوبها علي' },
            { value: 1, label: 'أدفع الزكاة بشكل غير منتظم أو أقل من المطلوب' },
            { value: 2, label: 'أدفع الزكاة لكن بدون حساب دقيق' },
            { value: 3, label: 'أدفع الزكاة بشكل صحيح وفي وقتها' },
            { value: 4, label: 'أدفع الزكاة وأتصدق بانتظام' },
            { value: 5, label: 'أدفع الزكاة وأتصدق وأبحث عن المحتاجين' }
          ]
        },
        {
          id: 'sins',
          text: 'كيف تصف علاقتك بالكبائر؟',
          options: [
            { value: 0, label: 'أرتكب الكبائر دون اكتراث' },
            { value: 1, label: 'أرتكب الكبائر لكن أشعر بالذنب بعدها' },
            { value: 2, label: 'أجاهد مع الكبائر، أتوب ثم أعود' },
            { value: 3, label: 'أتجنب معظم الكبائر لكن أزل أحياناً' },
            { value: 4, label: 'أتجنب الكبائر باستمرار' },
            { value: 5, label: 'أتجنب الكبائر وأحذر من الشبهات' }
          ]
        }
      ]
    },
    {
      id: 'time',
      title: 'الوقت والأولويات',
      arabic: 'الوقت والأولويات',
      description: 'كيف تقضي وقتك',
      questions: [
        {
          id: 'leisure',
          text: 'كيف تقضي عادةً وقت فراغك؟',
          options: [
            { value: 0, label: 'ترفيه بلا فائدة (ألعاب مفرطة، وسائل التواصل)' },
            { value: 1, label: 'معظمه ترفيه مع أنشطة نافعة أحياناً' },
            { value: 2, label: 'مزيج من الترفيه والأنشطة النافعة' },
            { value: 3, label: 'معظمه أنشطة نافعة مع بعض الترفيه' },
            { value: 4, label: 'تقريباً كل الوقت في أنشطة نافعة' },
            { value: 5, label: 'أختار بوعي النشاط الأكثر نفعاً في كل لحظة' }
          ]
        },
        {
          id: 'death_test',
          text: 'لو جاءك الموت الآن، كيف ستشعر تجاه ما تفعله؟',
          options: [
            { value: 0, label: 'سأشعر بالخجل أو الندم' },
            { value: 1, label: 'كنت أتمنى لو كنت أفعل شيئاً أفضل' },
            { value: 2, label: 'مقبول — ليس سيئاً، لكن ليس رائعاً' },
            { value: 3, label: 'سأشعر بالرضا المعقول' },
            { value: 4, label: 'سأشعر بالرضا — هذا مفيد' },
            { value: 5, label: 'سأشعر بالسكينة التامة — هذا بالضبط ما يجب أن أفعله' }
          ]
        },
        {
          id: 'priorities',
          text: 'عند الاختيار بين الأنشطة، هل تفكر في الأهم؟',
          options: [
            { value: 0, label: 'لا أفكر في الأهمية — أفعل ما أشتهي' },
            { value: 1, label: 'أحياناً أفكر في الأهمية' },
            { value: 2, label: 'عادةً أختار المهم على التافه' },
            { value: 3, label: 'أختار الأنشطة المهمة باستمرار' },
            { value: 4, label: 'غالباً أوازن لأجد الأهم' },
            { value: 5, label: 'أبحث دائماً عن أهم شيء يمكنني فعله' }
          ]
        },
        {
          id: 'wasted',
          text: 'في الأسبوع العادي، كم ساعة تشعر أنها "ضائعة"؟',
          options: [
            { value: 0, label: 'أكثر من 20 ساعة' },
            { value: 1, label: '15-20 ساعة' },
            { value: 2, label: '10-15 ساعة' },
            { value: 3, label: '5-10 ساعات' },
            { value: 4, label: '2-5 ساعات' },
            { value: 5, label: 'أقل من ساعتين — أنا مقصود في كل وقتي تقريباً' }
          ]
        }
      ]
    },
    {
      id: 'intention',
      title: 'النية والتحول',
      arabic: 'النية والتحول',
      description: 'الجودة الروحية لأعمالك',
      questions: [
        {
          id: 'niyyah',
          text: 'كم مرة تنوي بوعي قبل الأنشطة اليومية؟',
          options: [
            { value: 0, label: 'نادراً — أفعل الأشياء فحسب' },
            { value: 1, label: 'فقط قبل العبادات' },
            { value: 2, label: 'أحياناً قبل الأنشطة المهمة' },
            { value: 3, label: 'غالباً — أحاول أن تكون نيتي حسنة' },
            { value: 4, label: 'عادةً — أنوي بوعي لله' },
            { value: 5, label: 'دائماً تقريباً — الأكل والنوم والعمل، كل شيء بنية' }
          ]
        },
        {
          id: 'transform',
          text: 'هل تحول المباحات إلى عبادة بالنية؟',
          subtitle: 'مثال: الأكل للتقوي على العبادة، النوم للاستعداد للتهجد',
          options: [
            { value: 0, label: 'لم أفكر في هذا قط' },
            { value: 1, label: 'سمعت عن هذا لكن لا أمارسه' },
            { value: 2, label: 'أحاول أحياناً' },
            { value: 3, label: 'أفعل هذا بانتظام معقول' },
            { value: 4, label: 'أفعل هذا مع معظم الأنشطة اليومية' },
            { value: 5, label: 'هذه حالتي المعتادة — كل شيء تقريباً عبادة مقصودة' }
          ]
        },
        {
          id: 'lesser',
          text: 'هل تفعل أشياء "أقل" لتجنب ما هو أسوأ؟',
          subtitle: 'مثال: ترفيه مباح لتجنب الحرام',
          options: [
            { value: 0, label: 'لا أفكر استراتيجياً في تجنب المعصية' },
            { value: 1, label: 'أحاول تجنب المعصية لكن بدون بدائل' },
            { value: 2, label: 'أستخدم هذه الاستراتيجية أحياناً' },
            { value: 3, label: 'أستخدم هذا المبدأ بانتظام' },
            { value: 4, label: 'أخطط حياتي حول هذا المبدأ' },
            { value: 5, label: 'رتبت نمط حياتي كله لتقليل التعرض للمعصية' }
          ]
        }
      ]
    },
    {
      id: 'knowledge',
      title: 'العلم والعمل',
      arabic: 'العلم والعمل',
      description: 'الانخراط في التعلم والعبادة',
      questions: [
        {
          id: 'disputed',
          text: 'كيف تتعامل مع الأعمال المختلف فيها بين العلماء؟',
          subtitle: 'مثل: الدعاء بعد الصلاة، المولد، الذكر الجماعي',
          options: [
            { value: 0, label: 'لا أعرف عن هذه الخلافات' },
            { value: 1, label: 'أتجنب أي شيء فيه خلاف' },
            { value: 2, label: 'أتحفظ لكن أشارك أحياناً' },
            { value: 3, label: 'أشارك فيما يجيزه العلماء الموثوقون' },
            { value: 4, label: 'أبحث عن المستحبات حتى لو اختلف فيها بعض العلماء' },
            { value: 5, label: 'أتبع الأقوال العلمية الصحيحة مع احترام المخالفين' }
          ]
        },
        {
          id: 'nawafil',
          text: 'ما مدى محافظتك على النوافل؟',
          options: [
            { value: 0, label: 'لا أصلي النوافل' },
            { value: 1, label: 'أصلي النوافل أحياناً حسب المزاج' },
            { value: 2, label: 'لي بعض النوافل المنتظمة (مثل السنن الرواتب)' },
            { value: 3, label: 'أحافظ على عدة نوافل' },
            { value: 4, label: 'لي ورد منظم أحافظ عليه' },
            { value: 5, label: 'لي أوراد واسعة ونادراً ما أتركها' }
          ]
        },
        {
          id: 'seeking',
          text: 'ما مدى سعيك لطلب العلم الشرعي؟',
          options: [
            { value: 0, label: 'لا أسعى لطلب العلم' },
            { value: 1, label: 'أتعلم بشكل سلبي (الخطب، فيديوهات أحياناً)' },
            { value: 2, label: 'أقرأ أو أحضر دروساً أحياناً' },
            { value: 3, label: 'أقرأ كتباً إسلامية أو أحضر حلقات علم بانتظام' },
            { value: 4, label: 'أدرس مع شيوخ أو منهج منظم' },
            { value: 5, label: 'طلب العلم شغلي الأساسي — أدرس يومياً' }
          ]
        }
      ]
    },
    {
      id: 'heart',
      title: 'أحوال القلب',
      arabic: 'أحوال القلب',
      description: 'حالة قلبك',
      questions: [
        {
          id: 'khushu',
          text: 'ما حالتك الداخلية المعتادة في الصلاة؟',
          options: [
            { value: 0, label: 'أسرع فيها بدون تفكير' },
            { value: 1, label: 'ذهني يشرد باستمرار' },
            { value: 2, label: 'عندي بعض التركيز لكن شرود متكرر' },
            { value: 3, label: 'عادةً مركز مع شرود أحياناً' },
            { value: 4, label: 'عادةً حاضر ومتصل' },
            { value: 5, label: 'أعيش خشوعاً عميقاً وحضوراً مع الله' }
          ]
        },
        {
          id: 'dhikr',
          text: 'كم مرة تذكر الله خارج العبادات الرسمية؟',
          options: [
            { value: 0, label: 'نادراً' },
            { value: 1, label: 'مرات قليلة في اليوم' },
            { value: 2, label: 'عدة مرات خلال اليوم' },
            { value: 3, label: 'كثيراً — أذكر أذكار الصباح والمساء' },
            { value: 4, label: 'كثيراً جداً — الله على لساني وقلبي كثيراً' },
            { value: 5, label: 'باستمرار تقريباً — الذكر حالتي الطبيعية' }
          ]
        },
        {
          id: 'qadr',
          text: 'عندما تأتي الصعوبات، ما ردة فعلك الداخلية؟',
          options: [
            { value: 0, label: 'غضب أو يأس أو شكوى من الله' },
            { value: 1, label: 'إحباط وصعوبة في القبول' },
            { value: 2, label: 'صراع أولاً ثم قبول في النهاية' },
            { value: 3, label: 'قبول مع الصبر' },
            { value: 4, label: 'قبول مع الرضا' },
            { value: 5, label: 'قبول مع الشكر — أرى الحكمة في البلاء' }
          ]
        }
      ]
    },
    {
      id: 'character',
      title: 'الأخلاق والمعاملات',
      arabic: 'الأخلاق والمعاملات',
      description: 'كيف تعامل الآخرين',
      questions: [
        {
          id: 'treatment',
          text: 'كيف تعامل الناس عادةً؟',
          options: [
            { value: 0, label: 'غالباً قاسٍ أو مستهزئ أو غير لطيف' },
            { value: 1, label: 'لطيف مع من أحب، ليس كذلك مع الآخرين' },
            { value: 2, label: 'أحاول أن أكون مهذباً لكن عندي خلافات متكررة' },
            { value: 3, label: 'عادةً لطيف وأتجنب إيذاء الآخرين' },
            { value: 4, label: 'أسعى لنفع الآخرين والتغاضي عن أخطائهم' },
            { value: 5, label: 'أجسد الإحسان — أعامل الجميع بإتقان' }
          ]
        },
        {
          id: 'tolerance',
          text: 'كيف تتعامل مع المسلمين الذين يتبعون آراء صحيحة مختلفة؟',
          options: [
            { value: 0, label: 'أعتبرهم مخطئين أو ضالين' },
            { value: 1, label: 'أشعر بعدم الارتياح من الخلافات' },
            { value: 2, label: 'أتحمل الخلافات على مضض' },
            { value: 3, label: 'أقبل أن الخلافات الصحيحة موجودة' },
            { value: 4, label: 'أحترم الخلافات ولا أحكم' },
            { value: 5, label: 'أرى الجمال في الاختلاف وأدعو لجميع المسلمين' }
          ]
        },
        {
          id: 'service',
          text: 'ما مدى انخراطك في خدمة الآخرين؟',
          options: [
            { value: 0, label: 'أركز على نفسي' },
            { value: 1, label: 'أساعد عندما يكون ذلك مريحاً' },
            { value: 2, label: 'أساعد العائلة بانتظام' },
            { value: 3, label: 'أساعد العائلة وأحياناً المجتمع' },
            { value: 4, label: 'أخدم العائلة والمجتمع وما وراءهما بانتظام' },
            { value: 5, label: 'الخدمة جزء أساسي من هويتي' }
          ]
        }
      ]
    }
  ]
};

// ============================================
// STATIONS DATA (Trilingual)
// ============================================

const stationsData = {
  en: [
    { id: 9, category: 'sabiq', categoryName: 'Sābiq bil-Khayrāt', categoryArabic: 'سابق بالخيرات', categoryMeaning: 'Those Who Race to Good', name: "Station of the 'Ārifīn", arabic: 'مقام العارفين', description: 'Always doing the most important thing at every moment', keyPrinciple: 'If surprised by death, would find nothing concerning the truth they would want to increase', example: 'The knowers of Allah who are always in the optimal state', inspiration: 'Abu Bakr al-Siddiq رضي الله عنه — first to accept, first to sacrifice, first in everything', taraqqi: 'Constant vigilance. Never assume you\'ve arrived. Continue to see yourself as the least of Muslims. Your primary role is helping others climb.', color: '#D4AF37', shareEmoji: '🌟' },
    { id: 8, category: 'sabiq', categoryName: 'Sābiq bil-Khayrāt', categoryArabic: 'سابق بالخيرات', categoryMeaning: 'Those Who Race to Good', name: "Sa'āt wa Sa'āt", arabic: 'ساعة وساعة', description: 'Either in something important OR something more important', keyPrinciple: 'A time for this, a time for that — alternating between the important and the more important', example: "Ḥanẓala's experience: exalted with the Prophet ﷺ, then occupied with family/farms", inspiration: 'Ḥanẓala رضي الله عنه — felt like a hypocrite for not maintaining the highest state constantly', taraqqi: 'Minimize the gap between exalted and ordinary states. Practice dhikr continuously. Before switching modes, make intention.', color: '#C5A028', shareEmoji: '⭐' },
    { id: 7, category: 'sabiq', categoryName: 'Sābiq bil-Khayrāt', categoryArabic: 'سابق بالخيرات', categoryMeaning: 'Those Who Race to Good', name: 'Being in Something Important', arabic: 'في المهم', description: 'In something important if not in what is more important', keyPrinciple: "For the 'ulamā' of the aḥkām — scholars of rulings", example: "Ibn Wahb leaving prayer to study — Mālik said studying IS 'ibāda if intention is sound", inspiration: 'Ibn Wahb — student of Mālik who understood knowledge as worship', taraqqi: 'Begin asking: "Is there something MORE important right now?" Learn the fiqh of priorities. Study Imam al-\'Izz ibn \'Abd al-Salam\'s work.', color: '#B69419', shareEmoji: '✨' },
    { id: 6, category: 'muqtasid', categoryName: 'Muqtaṣid', categoryArabic: 'مقتصد', categoryMeaning: 'Those Who Are Moderate', name: 'Disputed Virtues', arabic: 'الفضائل المختلف فيها', description: 'Doing things that are disputed between being virtuous vs. permissible', keyPrinciple: 'Never in anything less than mubāḥ (permissible) with everybody', example: "Du'ā' after prayer — makrūh to some, mandūb to others", inspiration: 'Imam al-Shāṭibī — defended legitimate ikhtilaf while maintaining respect for those who differed', taraqqi: 'Begin asking not just "Is this permitted?" but "Is this the BEST use of my time right now?" Time segmentation.', color: '#2E8B57', shareEmoji: '🌿' },
    { id: 5, category: 'muqtasid', categoryName: 'Muqtaṣid', categoryArabic: 'مقتصد', categoryMeaning: 'Those Who Are Moderate', name: 'Ennobled Permissibles', arabic: 'المباحات الشريفة', description: 'Permissible things that become noble deeds through intention', keyPrinciple: 'There is no permissible thing except it can become a noble deed through intention', example: 'Sleeping to rest for future worship, eating to strengthen for obedience', inspiration: "'Abd al-Rahman ibn 'Awf رضي الله عنه — transformed commerce into 'ibadah", taraqqi: 'Begin adding disputed good deeds that trustworthy scholars recommend. Engage with ikhtilaf. Study fiqh differences.', color: '#3A9D6A', shareEmoji: '🍃' },
    { id: 4, category: 'muqtasid', categoryName: 'Muqtaṣid', categoryArabic: 'مقتصد', categoryMeaning: 'Those Who Are Moderate', name: 'Lesser Evil', arabic: 'دفع الأشد بالأخف', description: 'Doing lower things to ward off worse things', keyPrinciple: 'No maṣlaḥa can be good unless it wards off a worse thing', example: 'Mālik: "If sitting on a garbage heap would rectify my heart, I would do it"', inspiration: 'The Minister of Fez — broke his ego by begging on a garbage heap, became a great wali', taraqqi: 'The Intention Revolution: consciously make intention for EVERYTHING. Build your wird. Study purification of the heart.', color: '#46AF7D', shareEmoji: '🌱' },
    { id: 3, category: 'dhalim', categoryName: 'Ẓālim li-Nafsihi', categoryArabic: 'ظالم لنفسه', categoryMeaning: 'Those Who Wrong Themselves', name: 'The Riffraff', arabic: 'الغوغاء', description: 'Wasting time in things of no benefit — but at least not sinning', keyPrinciple: 'No ḥisba (commanding good) with them — just leave them alone', example: 'Watching TV but stops for prayer. Playing video games but still prays.', inspiration: "Pre-conversion 'Umar رضي الله عنه — his energy later transformed into becoming al-Farooq", taraqqi: 'Time Audit: track how you spend every hour for one week. Strategic Swap: convert 30% of wasted time to beneficial.', color: '#8B4513', shareEmoji: '🌾' },
    { id: 2, category: 'dhalim', categoryName: 'Ẓālim li-Nafsihi', categoryArabic: 'ظالم لنفسه', categoryMeaning: 'Those Who Wrong Themselves', name: 'Mixed Deeds', arabic: 'خلطوا عملاً صالحاً وآخر سيئاً', description: 'Mixing good deeds with bad deeds — admits sins', keyPrinciple: 'Perhaps Allah will make tawba on them', example: 'Committing sins but acknowledging them, doing some good alongside the bad', inspiration: "'Amr ibn al-'As رضي الله عنه — asked companions to stay by his grave for support", taraqqi: 'Stabilize the foundations. Identify TOP 3 recurring sins. Work on eliminating ONE at a time. Replace, don\'t just remove.', color: '#A0522D', shareEmoji: '🌻' },
    { id: 1, category: 'dhalim', categoryName: 'Ẓālim li-Nafsihi', categoryArabic: 'ظالم لنفسه', categoryMeaning: 'Those Who Wrong Themselves', name: 'Completely Wasted Life', arabic: 'التفريط التام', description: "Doesn't even do the farā'iḍ — but still Muslim", keyPrinciple: '"Don\'t despair of the mercy of Allah"', example: "Doesn't pray, fast is neglected, might not pay zakat — but says 'I am Muslim'", inspiration: 'Fuḍayl ibn \'Iyād — highway robber who heard Quran and transformed completely', taraqqi: 'Start with ONE prayer daily. The 40-Day Challenge. Don\'t despair — every moment is a new opportunity.', color: '#B87333', shareEmoji: '🌅' }
  ],
  ur: [
    { id: 9, category: 'sabiq', categoryName: 'سابق بالخیرات', categoryArabic: 'سابق بالخيرات', categoryMeaning: 'نیکیوں میں آگے بڑھنے والے', name: 'عارفین کا مقام', arabic: 'مقام العارفين', description: 'ہر لمحے سب سے اہم کام کرنا', keyPrinciple: 'اگر موت اچانک آ جائے تو حق کے بارے میں کوئی کمی محسوس نہ ہو', example: 'اللہ کے عارفین جو ہمیشہ بہترین حالت میں رہتے ہیں', inspiration: 'ابوبکر صدیق رضی اللہ عنہ — قبول کرنے میں اول، قربانی میں اول، ہر چیز میں اول', taraqqi: 'مسلسل چوکنا رہیں۔ کبھی نہ سمجھیں کہ پہنچ گئے۔ خود کو سب سے کم مسلمان سمجھیں۔ دوسروں کی مدد کرنا آپ کا کام ہے۔', color: '#D4AF37', shareEmoji: '🌟' },
    { id: 8, category: 'sabiq', categoryName: 'سابق بالخیرات', categoryArabic: 'سابق بالخيرات', categoryMeaning: 'نیکیوں میں آگے بڑھنے والے', name: 'ساعت و ساعت', arabic: 'ساعة وساعة', description: 'یا تو اہم کام میں یا زیادہ اہم کام میں', keyPrinciple: 'اس کے لیے وقت، اس کے لیے وقت — اہم اور زیادہ اہم کے درمیان', example: 'حنظلہ کا تجربہ: نبی ﷺ کے ساتھ بلند حالت، پھر گھر کے کاموں میں', inspiration: 'حنظلہ رضی اللہ عنہ — بلند حالت برقرار نہ رکھنے پر منافق محسوس کیا', taraqqi: 'بلند اور عام حالتوں کے درمیان فرق کم کریں۔ مسلسل ذکر کریں۔ حالت بدلنے سے پہلے نیت کریں۔', color: '#C5A028', shareEmoji: '⭐' },
    { id: 7, category: 'sabiq', categoryName: 'سابق بالخیرات', categoryArabic: 'سابق بالخيرات', categoryMeaning: 'نیکیوں میں آگے بڑھنے والے', name: 'اہم کام میں ہونا', arabic: 'في المهم', description: 'اگر زیادہ اہم میں نہیں تو کم از کم اہم میں', keyPrinciple: 'احکام کے علماء کے لیے', example: 'ابن وہب کا نماز چھوڑ کر پڑھائی کرنا — مالک نے کہا پڑھائی بھی عبادت ہے اگر نیت صحیح ہو', inspiration: 'ابن وہب — امام مالک کے شاگرد جنہوں نے علم کو عبادت سمجھا', taraqqi: 'پوچھنا شروع کریں: "کیا ابھی کوئی زیادہ اہم کام ہے؟" ترجیحات کی فقہ سیکھیں۔', color: '#B69419', shareEmoji: '✨' },
    { id: 6, category: 'muqtasid', categoryName: 'مقتصد', categoryArabic: 'مقتصد', categoryMeaning: 'میانہ رو', name: 'متنازعہ فضائل', arabic: 'الفضائل المختلف فيها', description: 'جن کے فضیلت یا جواز میں اختلاف ہو', keyPrinciple: 'کبھی مباح سے کم میں نہیں', example: 'نماز کے بعد دعا — کچھ کے نزدیک مکروہ، کچھ کے نزدیک مستحب', inspiration: 'امام شاطبی — جائز اختلاف کا دفاع کیا', taraqqi: 'صرف "کیا یہ جائز ہے؟" نہیں بلکہ "کیا یہ میرے وقت کا بہترین استعمال ہے؟" پوچھیں۔', color: '#2E8B57', shareEmoji: '🌿' },
    { id: 5, category: 'muqtasid', categoryName: 'مقتصد', categoryArabic: 'مقتصد', categoryMeaning: 'میانہ رو', name: 'شریف مباحات', arabic: 'المباحات الشريفة', description: 'مباح چیزیں جو نیت سے نیک کام بن جائیں', keyPrinciple: 'کوئی مباح نہیں جو نیت سے نیکی نہ بن سکے', example: 'عبادت کے لیے سونا، اطاعت کے لیے کھانا', inspiration: 'عبدالرحمن بن عوف رضی اللہ عنہ — تجارت کو عبادت بنایا', taraqqi: 'معتبر علماء کے تجویز کردہ اعمال شامل کریں۔ اختلاف کو سمجھیں۔', color: '#3A9D6A', shareEmoji: '🍃' },
    { id: 4, category: 'muqtasid', categoryName: 'مقتصد', categoryArabic: 'مقتصد', categoryMeaning: 'میانہ رو', name: 'کم برائی', arabic: 'دفع الأشد بالأخف', description: 'بڑی برائی سے بچنے کے لیے چھوٹی چیز کرنا', keyPrinciple: 'کوئی مصلحت اچھی نہیں جب تک بڑی برائی نہ روکے', example: 'مالک: "اگر کوڑے کے ڈھیر پر بیٹھنے سے دل درست ہو تو بیٹھ جاؤں"', inspiration: 'فاس کا وزیر — تکبر توڑنے کے لیے بھیک مانگی، عظیم ولی بنا', taraqqi: 'نیت کا انقلاب: ہر چیز کے لیے شعوری نیت کریں۔ ورد بنائیں۔', color: '#46AF7D', shareEmoji: '🌱' },
    { id: 3, category: 'dhalim', categoryName: 'ظالم لنفسہ', categoryArabic: 'ظالم لنفسه', categoryMeaning: 'اپنے آپ پر ظلم کرنے والے', name: 'غوغا', arabic: 'الغوغاء', description: 'بے فائدہ چیزوں میں وقت ضائع — لیکن گناہ نہیں', keyPrinciple: 'ان پر حسبہ نہیں — انہیں چھوڑ دو', example: 'ٹی وی دیکھنا لیکن نماز کے لیے رکنا۔ گیمز کھیلنا لیکن نماز پڑھنا۔', inspiration: 'قبول اسلام سے پہلے عمر رضی اللہ عنہ — بعد میں فاروق بنے', taraqqi: 'وقت کا جائزہ: ایک ہفتہ ہر گھنٹے کا حساب رکھیں۔ 30% ضائع وقت کو فائدہ مند میں بدلیں۔', color: '#8B4513', shareEmoji: '🌾' },
    { id: 2, category: 'dhalim', categoryName: 'ظالم لنفسہ', categoryArabic: 'ظالم لنفسه', categoryMeaning: 'اپنے آپ پر ظلم کرنے والے', name: 'ملے جلے اعمال', arabic: 'خلطوا عملاً صالحاً وآخر سيئاً', description: 'نیک اور برے اعمال ملانا — گناہ کا اعتراف', keyPrinciple: 'شاید اللہ ان پر توبہ کرے', example: 'گناہ کرنا لیکن اعتراف کرنا، کچھ نیکی بھی ساتھ', inspiration: 'عمرو بن العاص رضی اللہ عنہ — ساتھیوں سے قبر پر رہنے کی درخواست', taraqqi: 'بنیادیں مضبوط کریں۔ سب سے زیادہ 3 بار بار گناہ پہچانیں۔ ایک ایک کر کے ختم کریں۔', color: '#A0522D', shareEmoji: '🌻' },
    { id: 1, category: 'dhalim', categoryName: 'ظالم لنفسہ', categoryArabic: 'ظالم لنفسه', categoryMeaning: 'اپنے آپ پر ظلم کرنے والے', name: 'مکمل ضیاع', arabic: 'التفريط التام', description: 'فرائض بھی ادا نہیں — لیکن پھر بھی مسلمان', keyPrinciple: '"اللہ کی رحمت سے مایوس نہ ہو"', example: 'نماز نہیں، روزہ چھوٹا، زکوٰۃ نہیں — لیکن کہتا ہے "میں مسلمان ہوں"', inspiration: 'فضیل بن عیاض — ڈاکو جس نے قرآن سنا اور بدل گیا', taraqqi: 'ایک نماز سے شروع کریں۔ 40 دن کا چیلنج۔ مایوس نہ ہوں — ہر لمحہ نیا موقع ہے۔', color: '#B87333', shareEmoji: '🌅' }
  ],
  ar: [
    { id: 9, category: 'sabiq', categoryName: 'سابق بالخيرات', categoryArabic: 'سابق بالخيرات', categoryMeaning: 'السابقون إلى الخيرات', name: 'مقام العارفين', arabic: 'مقام العارفين', description: 'دائماً يفعل الأهم في كل لحظة', keyPrinciple: 'لو فاجأه الموت لم يجد شيئاً من الحق يريد أن يزيده', example: 'العارفون بالله الذين هم دائماً في الحالة المثلى', inspiration: 'أبو بكر الصديق رضي الله عنه — أول من آمن، أول من ضحى، أول في كل شيء', taraqqi: 'يقظة دائمة. لا تظن أنك وصلت. استمر في رؤية نفسك أقل المسلمين. دورك الأساسي مساعدة الآخرين على الصعود.', color: '#D4AF37', shareEmoji: '🌟' },
    { id: 8, category: 'sabiq', categoryName: 'سابق بالخيرات', categoryArabic: 'سابق بالخيرات', categoryMeaning: 'السابقون إلى الخيرات', name: 'ساعة وساعة', arabic: 'ساعة وساعة', description: 'إما في مهم أو في أهم', keyPrinciple: 'ساعة لهذا وساعة لذاك — التناوب بين المهم والأهم', example: 'تجربة حنظلة: رفيع مع النبي ﷺ، ثم مشغول بالأهل والزرع', inspiration: 'حنظلة رضي الله عنه — شعر بالنفاق لعدم استمرار الحالة العليا', taraqqi: 'قلل الفجوة بين الحالات الرفيعة والعادية. واظب على الذكر. انوِ قبل تغيير الوضع.', color: '#C5A028', shareEmoji: '⭐' },
    { id: 7, category: 'sabiq', categoryName: 'سابق بالخيرات', categoryArabic: 'سابق بالخيرات', categoryMeaning: 'السابقون إلى الخيرات', name: 'في المهم', arabic: 'في المهم', description: 'في مهم إن لم يكن في الأهم', keyPrinciple: 'لعلماء الأحكام', example: 'ابن وهب ترك الصلاة للدراسة — قال مالك: الدراسة عبادة إذا صحت النية', inspiration: 'ابن وهب — تلميذ مالك الذي فهم العلم كعبادة', taraqqi: 'ابدأ بسؤال: "هل هناك شيء أهم الآن؟" تعلم فقه الأولويات. ادرس كتب العز بن عبد السلام.', color: '#B69419', shareEmoji: '✨' },
    { id: 6, category: 'muqtasid', categoryName: 'مقتصد', categoryArabic: 'مقتصد', categoryMeaning: 'المقتصدون', name: 'الفضائل المختلف فيها', arabic: 'الفضائل المختلف فيها', description: 'فعل ما اختُلف في كونه فضيلة أو مباحاً', keyPrinciple: 'لا يكون أبداً في أقل من مباح عند الجميع', example: 'الدعاء بعد الصلاة — مكروه عند بعض، مندوب عند آخرين', inspiration: 'الإمام الشاطبي — دافع عن الاختلاف المشروع مع احترام المخالفين', taraqqi: 'لا تسأل فقط "هل هذا جائز؟" بل "هل هذا أفضل استخدام لوقتي الآن؟"', color: '#2E8B57', shareEmoji: '🌿' },
    { id: 5, category: 'muqtasid', categoryName: 'مقتصد', categoryArabic: 'مقتصد', categoryMeaning: 'المقتصدون', name: 'المباحات الشريفة', arabic: 'المباحات الشريفة', description: 'المباحات التي تصير طاعات بالنية', keyPrinciple: 'ما من مباح إلا ويمكن أن يصير طاعة بالنية', example: 'النوم للتقوي على العبادة، الأكل للتقوي على الطاعة', inspiration: 'عبد الرحمن بن عوف رضي الله عنه — حول التجارة إلى عبادة', taraqqi: 'أضف الأعمال المستحبة التي يوصي بها العلماء الموثوقون. تعامل مع الاختلاف. ادرس الفقه المقارن.', color: '#3A9D6A', shareEmoji: '🍃' },
    { id: 4, category: 'muqtasid', categoryName: 'مقتصد', categoryArabic: 'مقتصد', categoryMeaning: 'المقتصدون', name: 'دفع الأشد بالأخف', arabic: 'دفع الأشد بالأخف', description: 'فعل الأدنى لدفع الأسوأ', keyPrinciple: 'لا تكون مصلحة خيراً إلا إذا دفعت شراً أكبر', example: 'مالك: "لو أن جلوسي على مزبلة يصلح قلبي لجلست"', inspiration: 'وزير فاس — كسر كبره بالتسول على مزبلة، فصار ولياً عظيماً', taraqqi: 'ثورة النية: انوِ بوعي لكل شيء. ابنِ وردك. ادرس تزكية النفس.', color: '#46AF7D', shareEmoji: '🌱' },
    { id: 3, category: 'dhalim', categoryName: 'ظالم لنفسه', categoryArabic: 'ظالم لنفسه', categoryMeaning: 'الظالمون لأنفسهم', name: 'الغوغاء', arabic: 'الغوغاء', description: 'إضاعة الوقت فيما لا ينفع — لكن على الأقل لا يعصي', keyPrinciple: 'لا حسبة عليهم — اتركهم', example: 'يشاهد التلفاز لكن يقوم للصلاة. يلعب ألعاباً لكن يصلي.', inspiration: 'عمر رضي الله عنه قبل إسلامه — تحولت طاقته لاحقاً ليصبح الفاروق', taraqqi: 'تدقيق الوقت: تابع كيف تقضي كل ساعة لأسبوع. حول 30% من الوقت الضائع إلى نافع.', color: '#8B4513', shareEmoji: '🌾' },
    { id: 2, category: 'dhalim', categoryName: 'ظالم لنفسه', categoryArabic: 'ظالم لنفسه', categoryMeaning: 'الظالمون لأنفسهم', name: 'خلطوا عملاً صالحاً وآخر سيئاً', arabic: 'خلطوا عملاً صالحاً وآخر سيئاً', description: 'يخلط العمل الصالح بالسيء — يعترف بذنوبه', keyPrinciple: 'عسى الله أن يتوب عليهم', example: 'يرتكب ذنوباً لكن يعترف بها، يفعل خيراً مع الشر', inspiration: 'عمرو بن العاص رضي الله عنه — طلب من أصحابه البقاء عند قبره للدعم', taraqqi: 'ثبّت الأساسيات. حدد أكثر 3 ذنوب متكررة. اعمل على إزالة واحد في كل مرة. استبدل ولا تكتفِ بالإزالة.', color: '#A0522D', shareEmoji: '🌻' },
    { id: 1, category: 'dhalim', categoryName: 'ظالم لنفسه', categoryArabic: 'ظالم لنفسه', categoryMeaning: 'الظالمون لأنفسهم', name: 'التفريط التام', arabic: 'التفريط التام', description: 'لا يؤدي حتى الفرائض — لكنه مسلم', keyPrinciple: '"لا تقنطوا من رحمة الله"', example: 'لا يصلي، الصيام مهمل، قد لا يزكي — لكن يقول "أنا مسلم"', inspiration: 'الفضيل بن عياض — قاطع طريق سمع القرآن فتغير كلياً', taraqqi: 'ابدأ بصلاة واحدة يومياً. تحدي الأربعين يوماً. لا تيأس — كل لحظة فرصة جديدة.', color: '#B87333', shareEmoji: '🌅' }
  ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const calculateStation = (answers, sections) => {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const prayerScore = answers.prayer || 0;
  const sinsScore = answers.sins || 0;
  
  let stationId;
  
  if (prayerScore <= 1) {
    stationId = 1;
  } else if (sinsScore <= 1 && prayerScore <= 2) {
    stationId = 2;
  } else if (totalScore <= 20) {
    stationId = 1;
  } else if (totalScore <= 35) {
    stationId = 2;
  } else if (totalScore <= 45) {
    stationId = 3;
  } else if (totalScore <= 55) {
    stationId = 4;
  } else if (totalScore <= 65) {
    stationId = 5;
  } else if (totalScore <= 75) {
    stationId = 6;
  } else if (totalScore <= 85) {
    stationId = 7;
  } else if (totalScore <= 95) {
    stationId = 8;
  } else {
    stationId = 9;
  }
  
  return { station: stationId, score: totalScore };
};

// ============================================
// LANGUAGE SELECTOR COMPONENT
// ============================================

function LanguageSelector({ currentLang, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ur', label: 'اردو', flag: '🇵🇰' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ];
  
  const currentLanguage = languages.find(l => l.code === currentLang);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-amber-400/20 border border-amber-400/50 text-amber-400 rounded-lg hover:bg-amber-400/30 transition-all font-medium"
      >
        <span>{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.label}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden min-w-[140px]">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                  currentLang === language.code 
                    ? 'bg-amber-400/20 text-amber-400' 
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.label}</span>
                {currentLang === language.code && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// SHARE MODAL COMPONENT
// ============================================

function ShareModal({ station, onClose, lang, t }) {
  const [copied, setCopied] = useState(false);
  const siteUrl = window.location.origin;
  
  const shareText = `${station.shareEmoji} ${lang === 'ur' ? 'میں نے نو مقامات کا جائزہ لیا!' : (lang === 'ar' ? 'أخذت تقييم المقامات التسعة!' : 'I took the Nine Maqāmāt Self-Assessment!')}\n\n${lang === 'ur' ? 'مقام' : (lang === 'ar' ? 'المقام' : 'Station')} ${station.id}: ${station.arabic} (${station.name})\n\n"${station.keyPrinciple}"`;
  
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + siteUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`,
  };

  const handlePlatformClick = (platform) => {
    trackEvent(GA_EVENTS.SHARE_PLATFORM, {
      platform: platform,
      station_id: station.id,
      language: lang
    });
  };

  const copyLink = async () => {
    trackEvent(GA_EVENTS.SHARE_PLATFORM, {
      platform: 'copy_link',
      station_id: station.id,
      language: lang
    });
    
    try {
      await navigator.clipboard.writeText(`${shareText}\n${siteUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = `${shareText}\n${siteUrl}`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className={`bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-white/10 ${lang === 'ur' ? 'font-urdu' : ''}`}
        dir={lang === 'ur' ? 'rtl' : 'ltr'}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">{lang === 'ur' ? 'نتیجہ شیئر کریں' : 'Share Your Result'}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 mb-6 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: station.color, color: '#0a1628' }}>
              {station.id}
            </div>
            <div>
              <div className="text-lg font-arabic text-amber-400">{station.arabic}</div>
              <div className="text-sm text-slate-300">{station.name}</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm italic">"{station.keyPrinciple}"</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => handlePlatformClick('whatsapp')} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-3 px-4 rounded-xl transition-all font-medium">
            WhatsApp
          </a>
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" onClick={() => handlePlatformClick('twitter')} className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-xl transition-all font-medium">
            X
          </a>
          <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" onClick={() => handlePlatformClick('telegram')} className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white py-3 px-4 rounded-xl transition-all font-medium">
            Telegram
          </a>
        </div>

        <button
          onClick={copyLink}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-medium border ${copied ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
        >
          {copied ? '✓ Copied!' : '📋 Copy Link'}
        </button>
      </div>
    </div>
  );
}

// ============================================
// DOWNLOAD RESULT CARD COMPONENT
// ============================================

function ResultCard({ station, score, lang, t }) {
  return (
    <div 
      id="result-card-download"
      className="w-[600px] h-[800px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8 flex flex-col"
      style={{ fontFamily: lang === 'ur' ? "'Noto Nastaliq Urdu', serif" : "'Cormorant Garamond', Georgia, serif" }}
      dir={lang === 'ur' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-3xl text-amber-400 mb-2">المقامات التسعة</div>
        <div className="text-xl text-white/80">{lang === 'ur' ? 'نو مقامات کا جائزہ' : 'Nine Maqāmāt Assessment'}</div>
      </div>

      {/* Station Circle */}
      <div className="flex justify-center mb-6">
        <div 
          className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${station.color} 0%, ${station.color}99 100%)`, color: '#0a1628' }}
        >
          {station.id}
        </div>
      </div>

      {/* Station Info */}
      <div className="text-center mb-6">
        <div className="text-4xl text-amber-400 mb-2" style={{ fontFamily: "'Amiri', serif" }}>
          {station.arabic}
        </div>
        <div className="text-2xl text-white mb-2">{station.name}</div>
        <div className="text-lg text-slate-400">{station.categoryMeaning}</div>
      </div>

      {/* Score */}
      <div className="bg-white/5 rounded-xl p-4 mb-6 text-center">
        <div className="text-slate-400 text-sm mb-1">{t.results.score}</div>
        <div className="text-3xl font-bold text-amber-400">{score} <span className="text-lg text-slate-500">{t.results.outOf}</span></div>
      </div>

      {/* Key Principle */}
      <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-5 mb-6 flex-grow">
        <div className="text-amber-400 text-sm mb-2">{t.results.keyPrinciple}</div>
        <p className="text-white/90 text-lg italic leading-relaxed">"{station.keyPrinciple}"</p>
      </div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-sm">
        <div className="mb-1">كلهم من أهل الجنة</div>
        <div>{lang === 'ur' ? 'امام الموّاق کی سنن المہتدین کی بنیاد پر' : 'Based on Sunan al-Muhtadīn by Imam al-Mawwāq'}</div>
      </div>
    </div>
  );
}

// ============================================
// MAQAMAT DASHBOARD COMPONENT
// ============================================

function MaqamatDashboard({ onBack, userStation, stations, lang, t }) {
  const [viewMode, setViewMode] = useState('ladder');

  const categoryInfo = {
    sabiq: { 
      name: lang === 'ar' ? 'سابق بالخيرات' : (lang === 'ur' ? 'سابق بالخیرات' : 'Sābiq bil-Khayrāt'), 
      color: '#D4AF37', 
      meaning: lang === 'ar' ? 'السابقون إلى الخيرات' : (lang === 'ur' ? 'نیکیوں میں آگے بڑھنے والے' : 'Those Who Race to Good') 
    },
    muqtasid: { 
      name: lang === 'ar' ? 'مقتصد' : (lang === 'ur' ? 'مقتصد' : 'Muqtaṣid'), 
      color: '#2E8B57', 
      meaning: lang === 'ar' ? 'المقتصدون' : (lang === 'ur' ? 'میانہ رو' : 'Those Who Are Moderate') 
    },
    dhalim: { 
      name: lang === 'ar' ? 'ظالم لنفسه' : (lang === 'ur' ? 'ظالم لنفسہ' : 'Ẓālim li-Nafsihi'), 
      color: '#8B4513', 
      meaning: lang === 'ar' ? 'الظالمون لأنفسهم' : (lang === 'ur' ? 'اپنے آپ پر ظلم کرنے والے' : 'Those Who Wrong Themselves') 
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-amber-50 p-4 md:p-6 ${lang === 'ur' ? 'font-urdu' : ''} ${lang === 'ar' ? 'font-arabic' : ''}`} dir={t.dir}>
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-amber-400 mb-6 transition-colors">
          {(lang === 'ur' || lang === 'ar') ? '→' : '←'} {t.buttons.back}
        </button>

        <header className="text-center mb-8">
          <div className="text-3xl text-amber-400 mb-2" style={{ fontFamily: "'Amiri', serif" }}>المقامات التسعة</div>
          <h1 className="text-2xl font-light text-white">{lang === 'ar' ? 'شرح المقامات التسعة' : (lang === 'ur' ? 'نو مقامات کی وضاحت' : 'The Nine Maqāmāt Explained')}</h1>
        </header>

        {/* View Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          {['ladder', 'grid'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg transition-all ${viewMode === mode ? 'bg-amber-400/20 text-amber-400 border border-amber-400/50' : 'bg-white/5 text-slate-400 border border-transparent'}`}
            >
              {mode === 'ladder' 
                ? (lang === 'ar' ? '↕ سلم' : (lang === 'ur' ? '↕ سیڑھی' : '↕ Ladder')) 
                : (lang === 'ar' ? '⊞ شبكة' : (lang === 'ur' ? '⊞ گرڈ' : '⊞ Grid'))}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.entries(categoryInfo).map(([key, cat]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
              <span className="text-slate-400 text-sm">{cat.meaning}</span>
            </div>
          ))}
        </div>

        {/* Stations */}
        <div className="space-y-4">
          {stations.map((station) => (
            <div
              key={station.id}
              className={`bg-white/5 rounded-xl p-5 border transition-all ${userStation === station.id ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-transparent hover:border-white/10'}`}
              style={{ borderLeftWidth: '4px', borderLeftColor: station.color }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{ background: station.color, color: '#0a1628' }}
                >
                  {station.id}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl text-amber-400" style={{ fontFamily: "'Amiri', serif" }}>{station.arabic}</span>
                    {userStation === station.id && (
                      <span className="bg-amber-400 text-slate-900 text-xs px-2 py-0.5 rounded-full font-medium">
                        {lang === 'ar' ? 'مقامك' : (lang === 'ur' ? 'آپ کا مقام' : 'Your Station')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg text-white mb-1">{station.name}</h3>
                  <p className="text-slate-400 text-sm mb-2">{station.description}</p>
                  <p className="text-slate-500 text-xs italic">"{station.keyPrinciple}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Message */}
        <div className="mt-8 bg-gradient-to-r from-amber-400/10 via-emerald-400/10 to-amber-400/10 rounded-xl p-6 text-center border border-amber-400/20">
          <div className="text-2xl text-amber-400 mb-2" style={{ fontFamily: "'Amiri', serif" }}>كلهم من أهل الجنة</div>
          <h3 className="text-lg text-white mb-2">{t.results.allParadise}</h3>
          <p className="text-slate-400 text-sm">{t.results.faqih}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================

export default function MaqamatAssessment() {
  const [lang, setLang] = useState('en');
  const [started, setStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [result, setResult] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [sectionStartTime, setSectionStartTime] = useState(null);
  const resultCardRef = useRef(null);

  const t = content[lang];
  const sections = sectionsData[lang];
  const stations = stationsData[lang];

  // Initialize Google Analytics on mount
  useEffect(() => {
    initGA();
  }, []);

  // Track section time
  useEffect(() => {
    if (started && !showResults) {
      setSectionStartTime(Date.now());
    }
  }, [currentSection, started]);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Track question answered
    trackEvent(GA_EVENTS.QUESTION_ANSWERED, {
      question_id: questionId,
      answer_value: value,
      section_id: sections[currentSection]?.id,
      section_number: currentSection + 1,
      language: lang
    });
  };

  const getCurrentProgress = () => {
    const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
    const answeredQuestions = Object.keys(answers).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const canProceed = () => sections[currentSection].questions.every(q => answers[q.id] !== undefined);

  const handleNext = () => {
    // Track time spent on section
    if (sectionStartTime) {
      const timeSpent = Math.round((Date.now() - sectionStartTime) / 1000);
      trackEvent(GA_EVENTS.TIME_ON_SECTION, {
        section_id: sections[currentSection]?.id,
        section_number: currentSection + 1,
        time_seconds: timeSpent,
        language: lang
      });
    }

    // Track section completed
    trackEvent(GA_EVENTS.SECTION_COMPLETED, {
      section_id: sections[currentSection]?.id,
      section_number: currentSection + 1,
      language: lang
    });

    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      
      // Track next section viewed
      trackEvent(GA_EVENTS.SECTION_VIEWED, {
        section_id: sections[currentSection + 1]?.id,
        section_number: currentSection + 2,
        language: lang
      });
      
      window.scrollTo(0, 0);
    } else {
      const calculatedResult = calculateStation(answers, sections);
      setResult(calculatedResult);
      setShowResults(true);
      
      // Track assessment completed
      trackEvent(GA_EVENTS.ASSESSMENT_COMPLETED, {
        total_score: calculatedResult.score,
        station_achieved: calculatedResult.station,
        language: lang,
        completion_time: Date.now()
      });
      
      // Track station achieved (separate event for funnel analysis)
      const station = stationsData[lang].find(s => s.id === calculatedResult.station);
      trackEvent(GA_EVENTS.STATION_ACHIEVED, {
        station_id: calculatedResult.station,
        station_name: station?.name,
        station_category: station?.category,
        total_score: calculatedResult.score,
        language: lang
      });
      
      window.scrollTo(0, 0);
    }
  };

  const resetAssessment = () => {
    // Track retake
    trackEvent(GA_EVENTS.RETAKE_CLICKED, {
      previous_station: result?.station,
      previous_score: result?.score,
      language: lang
    });
    
    setAnswers({});
    setCurrentSection(0);
    setShowResults(false);
    setShowDashboard(false);
    setShowShareModal(false);
    setResult(null);
    setStarted(false);
  };

  const toggleLanguage = (newLang) => {
    // Track language change
    trackEvent(GA_EVENTS.LANGUAGE_CHANGED, {
      from_language: lang,
      to_language: newLang,
      current_screen: showResults ? 'results' : (started ? 'assessment' : 'welcome'),
      current_section: started && !showResults ? currentSection + 1 : null
    });
    
    setLang(newLang);
  };

  // Download as PNG
  const downloadResultAsPNG = async () => {
    // Track download clicked
    trackEvent(GA_EVENTS.DOWNLOAD_CLICKED, {
      station_id: result?.station,
      score: result?.score,
      language: lang
    });
    
    setDownloading(true);
    
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.min.js')).default;
      
      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);
      
      // Render the result card
      const station = stations.find(s => s.id === result.station);
      const cardHTML = `
        <div id="download-card" style="width: 600px; height: 800px; background: linear-gradient(to bottom, #0f172a, #1e293b, #0f172a); padding: 32px; font-family: Georgia, serif; color: white; display: flex; flex-direction: column;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 28px; color: #fbbf24; margin-bottom: 8px; font-family: 'Times New Roman', serif;">المقامات التسعة</div>
            <div style="font-size: 20px; color: rgba(255,255,255,0.8);">${lang === 'ur' ? 'نو مقامات کا جائزہ' : 'Nine Maqāmāt Assessment'}</div>
          </div>
          <div style="display: flex; justify-content: center; margin-bottom: 24px;">
            <div style="width: 120px; height: 120px; border-radius: 50%; background: ${station.color}; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: bold; color: #0f172a;">
              ${station.id}
            </div>
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 32px; color: #fbbf24; margin-bottom: 8px;">${station.arabic}</div>
            <div style="font-size: 24px; color: white; margin-bottom: 8px;">${station.name}</div>
            <div style="font-size: 16px; color: #94a3b8;">${station.categoryMeaning}</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px;">
            <div style="color: #94a3b8; font-size: 14px; margin-bottom: 4px;">${t.results.score}</div>
            <div style="font-size: 28px; font-weight: bold; color: #fbbf24;">${result.score} <span style="font-size: 16px; color: #64748b;">${t.results.outOf}</span></div>
          </div>
          <div style="background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); border-radius: 12px; padding: 20px; flex-grow: 1;">
            <div style="color: #fbbf24; font-size: 14px; margin-bottom: 8px;">${t.results.keyPrinciple}</div>
            <p style="color: rgba(255,255,255,0.9); font-size: 18px; font-style: italic; line-height: 1.6;">"${station.keyPrinciple}"</p>
          </div>
          <div style="text-align: center; color: #64748b; font-size: 12px; margin-top: 24px;">
            <div style="margin-bottom: 4px;">كلهم من أهل الجنة</div>
            <div>${lang === 'ur' ? 'امام الموّاق کی سنن المہتدین کی بنیاد پر' : 'Based on Sunan al-Muhtadīn by Imam al-Mawwāq'}</div>
          </div>
        </div>
      `;
      
      container.innerHTML = cardHTML;
      const cardElement = container.querySelector('#download-card');
      
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      // Download
      const link = document.createElement('a');
      link.download = `maqamat-station-${result.station}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      // Track download completed
      trackEvent(GA_EVENTS.DOWNLOAD_COMPLETED, {
        station_id: result?.station,
        score: result?.score,
        language: lang
      });
      
      // Cleanup
      document.body.removeChild(container);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: show alert
      alert(lang === 'ur' ? 'ڈاؤن لوڈ میں مسئلہ ہوا۔ براہ کرم اسکرین شاٹ لیں۔' : 'Download failed. Please take a screenshot instead.');
    }
    
    setDownloading(false);
  };

  // Track dashboard view when it opens
  useEffect(() => {
    if (showDashboard && result) {
      trackEvent(GA_EVENTS.DASHBOARD_VIEWED, {
        from_station: result?.station,
        language: lang
      });
    }
  }, [showDashboard]);

  // Track results view when shown
  useEffect(() => {
    if (showResults && result) {
      trackEvent(GA_EVENTS.RESULT_VIEWED, {
        station_id: result?.station,
        score: result?.score,
        language: lang
      });
    }
  }, [showResults]);

  // Show Dashboard
  if (showDashboard && result) {
    const station = stations.find(s => s.id === result.station);
    return (
      <MaqamatDashboard 
        onBack={() => { setShowDashboard(false); window.scrollTo(0, 0); }}
        userStation={result.station}
        stations={stations}
        lang={lang}
        t={t}
      />
    );
  }

  // Welcome Screen
  if (!started) {
    return (
      <div className={`min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-amber-50 p-4 md:p-6 ${lang === 'ur' ? 'font-urdu' : ''} ${lang === 'ar' ? 'font-arabic' : ''}`} dir={t.dir}>
        {/* Language Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSelector currentLang={lang} onLanguageChange={toggleLanguage} />
        </div>

        <div className="max-w-2xl mx-auto pt-12">
          <header className="text-center mb-10">
            <div className="text-4xl md:text-5xl text-amber-400 mb-3" style={{ fontFamily: "'Amiri', serif" }}>المقامات التسعة</div>
            <h1 className="text-2xl md:text-3xl font-light mb-2">{t.title}</h1>
            <h2 className="text-lg text-slate-400">{t.subtitle}</h2>
          </header>

          <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
            <blockquote className="text-center text-lg italic text-amber-200/80 mb-4">
              {t.preface}
            </blockquote>
            <p className="text-center text-slate-400 text-sm">{t.prefaceNote}</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 mb-8">
            <ul className="space-y-3">
              {t.remember.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="text-amber-400 mt-1">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-center text-amber-200/60 italic mb-8">{t.honesty}</p>

          <button
            onClick={() => {
              trackEvent(GA_EVENTS.ASSESSMENT_STARTED, {
                language: lang,
                timestamp: Date.now()
              });
              trackEvent(GA_EVENTS.SECTION_VIEWED, {
                section_id: sections[0]?.id,
                section_number: 1,
                language: lang
              });
              setStarted(true);
            }}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-xl text-lg font-semibold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25"
          >
            {t.startBtn}
          </button>

          <footer className="text-center mt-10 text-slate-600 text-sm">
            {t.footer}
          </footer>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults && result) {
    const station = stations.find(s => s.id === result.station);
    
    return (
      <div className={`min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-amber-50 p-4 md:p-6 ${lang === 'ur' ? 'font-urdu' : ''} ${lang === 'ar' ? 'font-arabic' : ''}`} dir={t.dir}>
        {/* Language Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSelector currentLang={lang} onLanguageChange={toggleLanguage} />
        </div>

        <div className="max-w-2xl mx-auto pt-8">
          <header className="text-center mb-8">
            <div className="text-2xl text-amber-400 mb-2" style={{ fontFamily: "'Amiri', serif" }}>المقامات التسعة</div>
            <h1 className="text-xl font-light">{t.results.title}</h1>
          </header>

          {/* Station Badge */}
          <div className="flex justify-center mb-6">
            <div 
              className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${station.color} 0%, ${station.color}99 100%)`, color: '#0a1628' }}
            >
              {station.id}
            </div>
          </div>

          {/* Station Info */}
          <div className="text-center mb-6">
            <div className="text-3xl text-amber-400 mb-2" style={{ fontFamily: "'Amiri', serif" }}>{station.arabic}</div>
            <h2 className="text-xl text-white mb-1">{station.name}</h2>
            <p className="text-slate-400">{station.categoryMeaning}</p>
          </div>

          {/* Score */}
          <div className="bg-white/5 rounded-xl p-4 mb-6 text-center">
            <span className="text-slate-400">{t.results.score}: </span>
            <span className="text-2xl font-bold text-amber-400">{result.score}</span>
            <span className="text-slate-500 ml-2">{t.results.outOf}</span>
          </div>

          {/* Key Principle */}
          <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-5 mb-6">
            <h3 className="text-amber-400 text-sm mb-2">{t.results.keyPrinciple}</h3>
            <p className="text-white/90 italic">"{station.keyPrinciple}"</p>
          </div>

          {/* Example */}
          <div className="bg-white/5 rounded-xl p-5 mb-6">
            <h3 className="text-emerald-400 text-sm mb-2">{t.results.example}</h3>
            <p className="text-slate-300">{station.example}</p>
          </div>

          {/* Inspiration */}
          <div className="bg-white/5 rounded-xl p-5 mb-6">
            <h3 className="text-purple-400 text-sm mb-2">{t.results.inspiration}</h3>
            <p className="text-slate-300">{station.inspiration}</p>
          </div>

          {/* Taraqqi */}
          <div className="bg-gradient-to-r from-emerald-400/10 to-teal-400/10 border border-emerald-400/30 rounded-xl p-5 mb-8">
            <h3 className="text-emerald-400 text-sm mb-2">{t.results.pathForward}</h3>
            <p className="text-slate-300">{station.taraqqi}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => {
                trackEvent(GA_EVENTS.SHARE_CLICKED, {
                  station_id: result?.station,
                  score: result?.score,
                  language: lang
                });
                setShowShareModal(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-400 transition-all"
            >
              {t.buttons.share}
            </button>

            <button
              onClick={downloadResultAsPNG}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-400 hover:to-pink-400 transition-all disabled:opacity-50"
            >
              {downloading ? t.buttons.downloading : t.buttons.download}
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowDashboard(true); window.scrollTo(0, 0); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-xl font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"
              >
                {t.buttons.explained}
              </button>
              <button
                onClick={resetAssessment}
                className="flex-1 py-3 bg-white/5 border border-white/20 rounded-xl text-slate-300 hover:bg-white/10 transition-all"
              >
                {t.buttons.retake}
              </button>
            </div>
          </div>

          {/* Paradise Message */}
          <div className="bg-gradient-to-r from-amber-400/10 via-emerald-400/10 to-amber-400/10 rounded-xl p-6 text-center border border-amber-400/20 mb-8">
            <div className="text-xl text-amber-400 mb-2" style={{ fontFamily: "'Amiri', serif" }}>كلهم من أهل الجنة</div>
            <h3 className="text-lg text-white mb-2">{t.results.allParadise}</h3>
            <p className="text-slate-400 text-sm italic">{t.results.faqih}</p>
          </div>

          <footer className="text-center text-slate-600 text-xs">
            {t.footer}
          </footer>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <ShareModal 
            station={{ ...station, id: result.station }}
            onClose={() => setShowShareModal(false)}
            lang={lang}
            t={t}
          />
        )}
      </div>
    );
  }

  // Questions Screen
  const section = sections[currentSection];
  const progress = getCurrentProgress();
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-amber-50 p-4 md:p-6 ${lang === 'ur' ? 'font-urdu' : ''} ${lang === 'ar' ? 'font-arabic' : ''}`} dir={t.dir}>
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector currentLang={lang} onLanguageChange={toggleLanguage} />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>{t.section} {currentSection + 1}/{sections.length}</span>
            <span className="text-amber-400">{progress}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-6 pb-4 border-b border-white/10">
          <div className="text-2xl text-amber-400 mb-1" style={{ fontFamily: "'Amiri', serif" }}>{section.arabic}</div>
          <h2 className="text-xl font-light mb-1">{section.title}</h2>
          <p className="text-slate-400 text-sm">{section.description}</p>
        </div>

        {/* Questions */}
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
              <div className={`space-y-2 ${lang === 'ur' ? 'mr-10' : 'ml-10'}`}>
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

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
          <button
            onClick={() => { setCurrentSection(prev => prev - 1); window.scrollTo(0, 0); }}
            disabled={currentSection === 0}
            className="px-6 py-3 bg-white/5 rounded-xl text-slate-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {t.previous}
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-xl font-semibold hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {currentSection === sections.length - 1 ? t.complete : t.next}
          </button>
        </div>

        {!canProceed() && (
          <p className="text-center text-amber-400/60 text-sm mt-4">{t.answerAll}</p>
        )}
      </div>
    </div>
  );
}
