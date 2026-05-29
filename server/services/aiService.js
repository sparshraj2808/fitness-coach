import dotenv from 'dotenv';
dotenv.config();

// Daily fitness tips to inject randomly or on request
const DAILY_TIPS = [
  "Consistency beats intensity. 20 minutes of daily movement is better than a single 2-hour workout once a week.",
  "Hydration is key for muscle recovery. Try to drink at least 500ml of water 30 minutes before your workout.",
  "Focus on progressive overload. Keep track of your weights/reps and aim to slightly increase them over time.",
  "Sleep is when muscles grow. Aim for 7-9 hours of quality sleep to optimize muscle synthesis and hormonal balance.",
  "Don't skip the warm-up! 5-10 minutes of dynamic stretches decreases injury risk and increases muscle firing capacity."
];

// Conversational motivation quotes
const MOTIVATION_QUOTES = [
  "The only bad workout is the one that didn't happen. Let's get moving!",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.",
  "Don't limit your challenges. Challenge your limits. You are capable of amazing things!",
  "Energy flows where attention goes. Focus on your strength, not your fatigue."
];

// Local NLP Simulator for Fitness Guidance
function generateSimulatedResponse(message, userProfile) {
  const query = message.toLowerCase();
  const userName = userProfile?.username || "Athlete";
  const userGoal = userProfile?.goal || "fitness";
  const userExp = userProfile?.experience || "beginner";
  
  let text = "";

  // 1. GREETINGS & INTROS
  if (query.match(/\b(hi|hello|hey|greetings|yo|howdy)\b/)) {
    text = `⚡ **Hey ${userName}!** I am your **FitCoach AI** personal trainer! \n\nI'm pumped to help you smash your fitness goals. Currently, you are tracking towards **${userGoal.toUpperCase()}** at a **${userExp}** level.\n\nHere are some things you can ask me:\n- 🏋️‍♂️ *"Give me a home/gym workout plan"* \n- 🥗 *"What should I eat to lose weight/gain muscle?"*\n- 💧 *"How much water should I drink?"*\n- 🔥 *"Give me some motivation for today!"*\n\nWhat are we focusing on today? Workouts, nutrition, or a recovery check-in?`;
  }
  
  // 2. WORKOUT PLANS & CIRCUITS
  else if (query.includes("workout") || query.includes("exercise") || query.includes("routine") || query.includes("plan")) {
    const isGym = query.includes("gym") || query.includes("weight") || query.includes("barbell");
    const isHome = query.includes("home") || query.includes("bodyweight") || query.includes("calisthenics");
    
    if (isGym || (!isHome && Math.random() > 0.5)) {
      // Gym Workout Split
      text = `🏋️‍♂️ **Futuristic Gym Power Routine (${userExp.toUpperCase()} level)**\n\nHere is a high-octane gym session customized for your goal of **${userGoal}**:\n\n### Warm-up (5-10 mins)\n- 5 mins Row machine or light Jog (gets heart rate up)\n- 10 Arm circles & leg swings\n- 2 light warm-up sets of your first lift\n\n### Core Strength & Hypertrophy\n1. **Barbell Squats / Leg Press**\n   - *Sets/Reps:* 3 sets x 8-10 reps\n   - *Rest:* 90 seconds\n2. **Dumbbell Bench Press or Incline Press**\n   - *Sets/Reps:* 3 sets x 10 reps\n   - *Rest:* 75 seconds\n3. **Lat Pulldowns or Seated Cable Rows**\n   - *Sets/Reps:* 3 sets x 12 reps\n   - *Rest:* 60 seconds\n4. **Standing Overhead Dumbbell Press**\n   - *Sets/Reps:* 3 sets x 10-12 reps\n   - *Rest:* 60 seconds\n\n### Finisher Circuit (Core & Cardio)\n- **Hanging Knee Raises:** 3 sets to failure\n- **Dumbbell Bicep Curls:** 2 sets x 15 reps\n- **Cable Tricep Pushdowns:** 2 sets x 15 reps\n\n*🔥 **FitCoach Pro-Tip:** Focus on controlled negatives (2-3 seconds lowering the weight) to trigger maximum muscle fiber engagement! Go crush it!*`;
    } else {
      // Home Workout Circuit
      text = `🏡 **Ultimate Home Bodyweight Blast (${userExp.toUpperCase()} level)**\n\nNo equipment? No excuses! Here is an intense, metabolism-boosting home workout geared towards **${userGoal}**:\n\n### The Circuit (Repeat 3 to 4 Rounds)\n*Perform each exercise for 40 seconds, followed by 20 seconds of rest. Rest 90 seconds between rounds.*\n\n1. **Tempo Bodyweight Squats** (Squat down slowly, explode up)\n2. **Standard or Incline Push-Ups** (Use a couch/wall if regular pushups are too hard)\n3. **Reverse Alternating Lunges** (Great for building leg strength while saving the knees)\n4. **Plank Tap-Outs** (In a plank position, tap your shoulders or step your feet out)\n5. **Jumping Jacks or High Knees** (Max intensity cardio burst!)\n\n### Cool Down & Stretch (3 mins)\n- **Child's Pose:** Hold for 45s (relieves lower back tension)\n- **Cobra Stretch:** Hold for 45s (opens chest and core)\n- **Hamstring Stretch:** 30s per leg\n\n*💧 Remember to grab your water bottle and log your intake after this sweat session!*`;
    }
  }
  
  // 3. DIET & NUTRITION & CALORIES
  else if (query.includes("diet") || query.includes("nutrition") || query.includes("eat") || query.includes("meal") || query.includes("calorie") || query.includes("protein")) {
    const isGain = userGoal.includes("gain") || query.includes("gain") || query.includes("bulk") || query.includes("muscle");
    
    if (isGain) {
      text = `🥗 **Anabolic Muscle-Building Nutrition Blueprint**\n\nTo build quality muscle, you need to be in a slight caloric surplus (250-500 kcal above maintenance) with high protein intake. Here is a daily macro layout and meal structure:\n\n### Target Macro Ratio\n- **Protein:** 30% (~1.8g - 2.2g per kg of bodyweight)\n- **Carbs:** 50% (fuels heavy lifting and replenishes glycogen)\n- **Fats:** 20% (regulates vital hormone production)\n\n### Daily Meal Plan Suggestion\n- **Breakfast:** 3 Scrambled Eggs + 1 cup Oats cooked in almond milk with half a banana & scoop of whey protein.\n- **Lunch:** 180g Grilled Chicken Breast + 1.5 cups Cooked Brown Rice + Steamed Broccoli drizzled with olive oil.\n- **Snack:** Greek Yogurt (0% or 2%) with a handful of almonds and blueberries.\n- **Dinner:** 180g Baked Salmon / Lean Beef + Roast Sweet Potato + Large Mixed Green Salad.\n- **Pre-Sleep:** Casein Protein shake or 150g Cottage Cheese (slow-digesting protein to repair muscle overnight).\n\n*⚡ **Coach Tip:** Consuming 30-40g of fast-digesting protein and carbs within 2 hours post-workout accelerates recovery dramatically!*`;
    } else {
      text = `🥗 **Lean Shred & Fat Loss Nutrition Plan**\n\nTo strip fat while preserving muscle, you must maintain a moderate caloric deficit (300-500 kcal below maintenance) while keeping protein high to maintain satiety. Here is your meal blueprint:\n\n### Target Macro Ratio\n- **Protein:** 40% (maximizes fullness and prevents muscle loss)\n- **Carbs:** 35% (complex, low-glycemic carbs for sustained energy)\n- **Fats:** 25% (healthy fats for brain and joint health)\n\n### Daily Meal Plan Suggestion\n- **Breakfast:** Spinach & Mushroom Omelette (3 whites + 1 whole egg) + 1 slice of whole-wheat toast.\n- **Lunch:** Giant Turkey Salad (200g lean turkey breast, spinach, cucumber, cherry tomatoes, 1/4 avocado, light vinaigrette).\n- **Snack:** Apple slices with 1 tbsp peanut butter or a high-protein shake.\n- **Dinner:** 180g Grilled White Fish (Cod/Tilapia) or Chicken Breast + Air-fried Asparagus & zucchini + 1/2 cup cooked Quinoa.\n- **Hydration Hack:** Drink 1 glass of water 15 minutes before every meal to curb hunger signals.\n\n*🔥 **Coach Tip:** Minimize liquid calories (sodas, fancy coffees). Stick to water, black coffee, and green tea!*`;
    }
  }
  
  // 4. WATER & HYDRATION
  else if (query.includes("water") || query.includes("hydrate") || query.includes("hydration") || query.includes("drink")) {
    text = `💧 **Hydration Command Center & Tips**\n\nWater makes up roughly 60% of your body. Dehydration by even 2% can drop physical performance by **up to 30%**!\n\n### How much do you need?\n- **Base Formula:** ~35ml of water per kg of body weight.\n- **Workout addition:** Add **500ml - 750ml** for every hour of heavy sweating.\n\n### 3 Pro Hydration Habits:\n1. **First Thing in the Morning:** Drink a large 300ml glass of water immediately after waking up to restart hydration.\n2. **Color Check:** Aim for a light, pale-yellow straw color. If it's dark amber, hit the water station immediately!\n3. **Use the Tracker:** Head over to our **Diet & Nutrition** page and use the **Water Intake Tracker** to log your progress throughout the day. Set a goal of 8-10 glasses!\n\n*Let's drink a glass right now. Cheers to performance!* 🥤`;
  }
  
  // 5. MOTIVATION & CHALLENGE
  else if (query.includes("motivation") || query.includes("motivate") || query.includes("quote") || query.includes("challenge") || query.includes("tired")) {
    const quote = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
    const tip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
    
    text = `🔥 **FitCoach Fuel: Instant Motivation Booster**\n\nHere is your spark for today:\n> "${quote}"\n\n### ⚡ Today's Coach Challenge:\n**The "10-rep check-in":** Wherever you are, drop and do **10 perfect push-ups** (or squats/jumping jacks) right now! Let's get the blood pumping and break the inertia! \n\n*Daily Tip:* ${tip}\n\nDo not let comfort win. You are building the future version of yourself starting with this very minute! Can you hit those 10 reps?`;
  }
  
  // 6. GENERAL CHATBOT INFO / DEFAULT CONTEXT
  else {
    text = `🤖 **FitCoach AI Live**\n\nI hear you loud and clear! Let's address your question about "${message}".\n\nAs your AI Coach, I want to emphasize that fitness is a marathon, not a sprint. Success lies in structural adjustments to your diet, training, and mindset:\n- Make sure your movements are structured (e.g. following a plan on the **Workout Plans** page).\n- Fuel your engine correctly (check our **Diet & Nutrition** page for macro calculators).\n- Record your progress daily on the **Progress Tracker** to see your weekly performance graph!\n\nCould you share a bit more detail? Are you looking for a specific training routine, trying to optimize your calorie intake, or trying to overcome a plateau? I am ready to break it down for you!`;
  }

  // Add the required medical disclaimer automatically to all health queries
  text += `\n\n---\n⚠️ ***FitCoach Disclaimer:** I am an AI fitness assistant designed to support your healthy lifestyle goals. Please consult a qualified medical practitioner before beginning any new training program or dramatic diet change, especially if you have pre-existing medical conditions.*`;

  return text;
}

// ─── Shared system prompt builder ──────────────────────────────────────────
function buildSystemPrompt(userProfile) {
  return `You are "FitCoach AI", a highly encouraging, futuristic, energetic, and professional personal trainer chatbot.
Your target is to help users with fitness goals, workouts, nutrition, macro targets, streaks, and healthy habit building.
The current user is named "${userProfile?.username || 'Athlete'}".
Their fitness goal is "${userProfile?.goal || 'fitness'}".
Their fitness experience level is "${userProfile?.experience || 'beginner'}".

Guidelines for Tone & Style:
- **Human-like & Conversational:** Write in natural, direct, and human-like language. Speak like an encouraging, enthusiastic personal trainer sending real text messages to a client. Avoid sounding robotic, template-driven, or overly formal.
- **Short & Crisp:** Keep responses short, punchy, and straight to the point (aim for under 100-150 words). Get to the key value instantly without unnecessary fluff.
- **Clean Structure:** Use minimal, clean markdown (like bold words or small bullet lists) to keep it easy to read on a phone/chat bubble. Do not generate massive tables or endless lists unless explicitly requested.
- **Energetic Persona:** Use active, high-energy coaching words (e.g., "Let's crush it!", "Awesome job!", "Lock it in!").
- **Disclaimer:** ALWAYS end every single message with a very brief, single-sentence disclaimer in parentheses at the very bottom: "(Please consult a doctor or certified fitness professional before starting new diets or intense routines.)"`;
}

// ─── Provider 1: GROQ (primary – OpenAI-compatible, ultra-fast LPU inference) ──
async function callGroq(message, conversationHistory, userProfile) {
  const groqKey   = process.env.GROQ_API_KEY;
  const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  if (!groqKey) throw new Error('GROQ_API_KEY not set');

  // Build OpenAI-style messages array
  const messages = [
    { role: 'system', content: buildSystemPrompt(userProfile) },
    // Inject last 10 turns of history for context
    ...conversationHistory.slice(-10).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.message
    })),
    { role: 'user', content: message }
  ];

  console.log(`🚀 Sending prompt to Groq API (${groqModel})...`);

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groqKey}`
    },
    body: JSON.stringify({
      model: groqModel,
      messages,
      temperature: 0.75,
      max_tokens: 1024,
    })
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from Groq API');

  return text;
}

// ─── Provider 2: GEMINI (secondary fallback) ────────────────────────────────
async function callGemini(message, conversationHistory, userProfile) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) throw new Error('GEMINI_API_KEY not set');

  // Gemini uses a single text prompt, so we flatten history into a conversation block
  let historyText = '';
  conversationHistory.slice(-10).forEach(msg => {
    const role = msg.sender === 'user' ? 'User' : 'FitCoach AI';
    historyText += `${role}: ${msg.message}\n`;
  });

  const prompt = `${buildSystemPrompt(userProfile)}\n\nChat history:\n${historyText}\nUser: ${message}\nFitCoach AI:`;

  console.log('🤖 Sending prompt to Gemini API (fallback)...');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );

  if (!response.ok) throw new Error(`Gemini API error ${response.status}`);

  const data     = await response.json();
  const aiText   = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!aiText) throw new Error('Empty response from Gemini API');

  return aiText;
}

// ─── Main dispatcher: Groq → Gemini → Local NLP ─────────────────────────────
export async function generateCoachResponse(message, conversationHistory = [], userProfile = {}) {

  // ── 1. Try Groq first ──────────────────────────────────────────────────
  if (process.env.GROQ_API_KEY) {
    try {
      return await callGroq(message, conversationHistory, userProfile);
    } catch (err) {
      console.warn('⚠️  Groq call failed, trying Gemini fallback…', err.message);
    }
  }

  // ── 2. Try Gemini second ───────────────────────────────────────────────
  if (process.env.GEMINI_API_KEY) {
    try {
      return await callGemini(message, conversationHistory, userProfile);
    } catch (err) {
      console.warn('⚠️  Gemini call failed, falling back to local NLP…', err.message);
    }
  }

  // ── 3. Local NLP simulator (always works offline) ─────────────────────
  console.log('🧠 Using local NLP trainer simulation.');
  return generateSimulatedResponse(message, userProfile);
}
