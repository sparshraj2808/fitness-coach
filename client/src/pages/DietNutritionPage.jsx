/* DietNutritionPage.jsx - Food logging and interactive hydration panel */
import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import WaterTracker from '../components/WaterTracker';

const RECIPES_SHRED = [
  {
    name: "🍗 Lemon Garlic Herb Chicken & Greens",
    calories: 380,
    protein: "42g",
    carbs: "12g",
    fats: "10g",
    ingredients: ["180g Chicken Breast", "2 cups Fresh Spinach", "10 Cherry Tomatoes", "1/2 Lemon", "1 tsp Olive Oil"],
    prep: "Pan-sear chicken with garlic and olive oil. Squeeze fresh lemon over a bed of spinach and cherry tomatoes, then slice chicken breast on top."
  },
  {
    name: "🐟 Spicy Baked Cod with Asparagus Foil",
    calories: 290,
    protein: "35g",
    carbs: "8g",
    fats: "7g",
    ingredients: ["200g Fresh Cod Filet", "10 Asparagus Spears", "1/2 cup Quinoa (cooked)", "1 tsp Cayenne Pepper"],
    prep: "Wrap cod and seasoned asparagus in aluminum foil. Bake at 200°C for 15 minutes. Serve with a side of fluffy cooked quinoa."
  },
  {
    name: "🍳 Veggie & Egg White Scramble Deck",
    calories: 240,
    protein: "28g",
    carbs: "10g",
    fats: "6g",
    ingredients: ["5 Egg Whites", "1 Whole Egg", "1/2 Red Bell Pepper", "1/4 cup Mushrooms", "1 slice Whole-Wheat Toast"],
    prep: "Whisk egg whites and whole egg. Scramble with diced bell peppers and mushrooms. Serve with dry whole-wheat toast."
  }
];

const RECIPES_GAIN = [
  {
    name: "🥣 Power Oats with Almond Butter & Whey",
    calories: 680,
    protein: "45g",
    carbs: "75g",
    fats: "18g",
    ingredients: ["1 cup Rolled Oats", "1 scoop Whey Protein", "1.5 cups Milk (whole/almond)", "1.5 tbsp Almond Butter", "1 Banana"],
    prep: "Cook oats in milk. Stir in whey protein powder until smooth. Top with sliced banana and a large scoop of rich almond butter."
  },
  {
    name: "🥩 Iron Ribeye and Roast Sweet Potatoes",
    calories: 820,
    protein: "58g",
    carbs: "62g",
    fats: "32g",
    ingredients: ["220g Ribeye Steak", "1 Large Sweet Potato", "1 cup Broccoli", "1 tbsp Butter"],
    prep: "Pan-sear ribeye in butter to desired doneness. Roast sweet potato wedges with sea salt at 200°C. Steam broccoli for side macros."
  },
  {
    name: "🥑 Double-Decker Avocado Turkey Mash",
    calories: 590,
    protein: "40g",
    carbs: "45g",
    fats: "22g",
    ingredients: ["180g Ground Turkey (93% lean)", "1/2 Avocado", "2 slices Sourdough Bread", "1 slice Cheddar Cheese"],
    prep: "Brown ground turkey in a pan with taco seasonings. Toast sourdough bread, mash fresh avocado on top, lay turkey and melt cheese."
  }
];

export default function DietNutritionPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calorieInput, setCalorieInput] = useState('');
  const [loggingFood, setLoggingFood] = useState(false);
  const [foodMsg, setFoodMsg] = useState('');

  const loadStats = async () => {
    try {
      const data = await api.getTrackerStatus();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleLogFood = async (e) => {
    e.preventDefault();
    const calories = Number(calorieInput);
    if (!calories || calories <= 0) return;

    setLoggingFood(true);
    setFoodMsg('');
    try {
      await api.logCalories(calories);
      setCalorieInput('');
      setFoodMsg('🍳 Meal calories logged successfully!');
      await loadStats();
      setTimeout(() => setFoodMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setFoodMsg('❌ Failed to log food.');
    } finally {
      setLoggingFood(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading Kitchen Stats...</p>
      </div>
    );
  }

  const recipes = user?.goal === 'gain' ? RECIPES_GAIN : RECIPES_SHRED;

  return (
    <div className="main-content">
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>🥗 Diet & Hydration Station</h1>
        <p style={styles.pageSubtitle}>Log calories, track fluid volumes, and browse customized recipes.</p>
      </div>

      <div style={styles.splitLayout}>
        {/* Left Side: Water log & Food Log */}
        <div style={styles.leftCol}>
          {/* Water glass tracker component */}
          <WaterTracker 
            initialLogged={stats?.waterLogged || 0} 
            target={stats?.waterTarget || 2500} 
            onUpdate={loadStats} 
          />

          {/* Calorie/Food Log Card */}
          <div className="cyber-card" style={styles.foodCard}>
            <h3 style={styles.cardTitle}>🍳 Log Meal Calories</h3>
            <p style={styles.cardSubtitle}>Log calories consumed during breakfast, lunch, dinner, or snacks.</p>
            
            <form onSubmit={handleLogFood} style={styles.foodForm}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Calories Consumed (kcal)</label>
                <div style={styles.inputRow}>
                  <input 
                    type="number" 
                    value={calorieInput}
                    onChange={(e) => setCalorieInput(e.target.value)}
                    placeholder="E.g., 450" 
                    style={styles.textInput}
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={loggingFood || !calorieInput}
                    className="cyber-button secondary" 
                    style={styles.logBtn}
                  >
                    {loggingFood ? 'Saving...' : 'Log Meal'}
                  </button>
                </div>
              </div>
            </form>
            {foodMsg && <p style={styles.message}>{foodMsg}</p>}
          </div>
        </div>

        {/* Right Side: Recipe Suggestions */}
        <div style={styles.rightCol}>
          <div className="cyber-card" style={styles.recipesCard}>
            <div style={styles.recipesHeader}>
              <h3 style={styles.cardTitle}>🥗 Targeted Meal Blueprints</h3>
              <span style={{
                ...styles.goalBadge,
                color: user?.goal === 'gain' ? 'var(--text-neon-lime)' : 'var(--text-neon-cyan)',
                borderColor: user?.goal === 'gain' ? 'var(--neon-green)' : 'var(--neon-blue)',
                background: user?.goal === 'gain' ? 'rgba(57,255,20,0.05)' : 'rgba(0,240,255,0.05)'
              }}>
                {user?.goal === 'gain' ? '🔥 Muscle Bulk Recipes' : '💧 Lean Shred Recipes'}
              </span>
            </div>
            <p style={styles.cardSubtitle}>Macros dialed to support your active goal of: {user?.goal === 'gain' ? 'Muscle Gain' : 'Weight Loss'}</p>

            <div style={styles.recipesList}>
              {recipes.map((recipe, idx) => (
                <div key={idx} style={styles.recipeItem}>
                  <h4 style={styles.recipeName}>{recipe.name}</h4>
                  
                  {/* Macros Peak */}
                  <div style={styles.macroPills}>
                    <span style={styles.macroPill}>Calories: <strong>{recipe.calories} kcal</strong></span>
                    <span style={styles.macroPill}>P: <strong>{recipe.protein}</strong></span>
                    <span style={styles.macroPill}>C: <strong>{recipe.carbs}</strong></span>
                    <span style={styles.macroPill}>F: <strong>{recipe.fats}</strong></span>
                  </div>

                  <div style={styles.recipeDetails}>
                    <p style={styles.detailsHeader}>Ingredients:</p>
                    <ul style={styles.ingList}>
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} style={styles.ingItem}>• {ing}</li>
                      ))}
                    </ul>

                    <p style={styles.prepHeader}>Preparation Guide:</p>
                    <p style={styles.prepText}>{recipe.prep}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid var(--bg-tertiary)',
    borderTopColor: 'var(--neon-blue)',
    borderRadius: 'var(--border-radius-full)',
    animation: 'rotate 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    fontFamily: 'Outfit, sans-serif',
    color: 'var(--text-secondary)',
  },
  pageHeader: {
    marginBottom: '2.5rem',
  },
  pageTitle: {
    fontSize: '2.2rem',
    fontWeight: '800',
  },
  pageSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    marginTop: '0.2rem',
  },
  splitLayout: {
    display: 'grid',
    gridTemplateColumns: '360px 1fr',
    gap: '2rem',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  rightCol: {
    flex: 1,
  },
  foodCard: {
    padding: '1.5rem',
  },
  cardTitle: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '1.15rem',
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginBottom: '1rem',
  },
  foodForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    marginBottom: '0.35rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  inputRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  textInput: {
    flex: 1,
    background: 'var(--bg-tertiary)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.65rem 1rem',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
  },
  logBtn: {
    padding: '0.65rem 1.25rem',
    fontSize: '0.8rem',
  },
  message: {
    fontSize: '0.8rem',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: '0.75rem',
  },
  recipesCard: {
    padding: '2rem',
  },
  recipesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  goalBadge: {
    border: '1px solid',
    borderRadius: 'var(--border-radius-full)',
    padding: '0.15rem 0.75rem',
    fontSize: '0.65rem',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  recipesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  recipeItem: {
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255,255,255,0.03)',
    borderRadius: 'var(--border-radius-lg)',
    padding: '1.25rem',
  },
  recipeName: {
    fontSize: '1rem',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  macroPills: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  macroPill: {
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.25rem 0.5rem',
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  recipeDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    borderTop: '1px solid rgba(255,255,255,0.03)',
    paddingTop: '0.75rem',
  },
  detailsHeader: {
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
  },
  ingList: {
    listStyle: 'none',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.25rem',
    marginBottom: '0.5rem',
  },
  ingItem: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  prepHeader: {
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
  },
  prepText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.45',
  }
};
