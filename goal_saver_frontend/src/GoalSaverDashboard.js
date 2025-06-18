import React, { useState } from "react";

// Color palette and light theme CSS-in-JS for quick prototyping
const COLORS = {
  primary: "#4CAF50",
  secondary: "#FFC107",
  accent: "#2196F3",
  lightBg: "#FAFAFA",
  card: "#FFFFFF",
  text: "#24292F",
  muted: "#757575",
  border: "#ECECEC",
  progress: "#E0F5E9",
  shadow: "rgba(60, 64, 67, 0.08)",
};

const cardStyle = {
  background: COLORS.card,
  borderRadius: 12,
  boxShadow: `0 2px 8px ${COLORS.shadow}`,
  padding: 24,
  marginBottom: 24,
  border: `1px solid ${COLORS.border}`,
};

const heroStyle = {
  marginTop: 32,
  marginBottom: 32,
  textAlign: "center",
};

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
  marginTop: "32px",
};
const labelStyle = { marginBottom: 4, color: COLORS.muted, fontSize: 13, fontWeight: 500 };

function capitalize(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

// PUBLIC_INTERFACE
export default function GoalSaverDashboard() {
  // ============= State: Mocked Data, Multiple Goals Management ============
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Buy a New Bicycle 🚲",
      target: 12000,
      saved: 3500,
      deadline: "2024-12-01",
      reminderFreq: "Weekly",
      microHabit: "Skip latte, save ₹100 every Friday",
    },
    {
      id: 2,
      name: "Emergency Fund 💡",
      target: 50000,
      saved: 30000,
      deadline: "2025-05-30",
      reminderFreq: "Monthly",
      microHabit: "Transfer ₹2000 on salary day",
    },
  ]);
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0].id);

  // ============= Create/Edit Goal States =============
  const [goalForm, setGoalForm] = useState({
    name: "",
    target: "",
    deadline: "",
    reminderFreq: "Weekly",
  });
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalEditMode, setGoalEditMode] = useState(null); // id for editing

  // ============= Smart Contribution Calculator =============
  function calculateMonthlyContribution(goal) {
    // Simple mocked calc: (target - saved)/(months_left)
    const now = new Date();
    const deadline = new Date(goal.deadline);
    let months =
      deadline.getFullYear() * 12 +
      deadline.getMonth() -
      (now.getFullYear() * 12 + now.getMonth());
    months = months > 0 ? months : 1;
    const amt = (goal.target - goal.saved) / months;
    return amt > 0 ? Math.ceil(amt) : 0;
  }

  // ============= Handlers: Add/Edit/Delete Goals =============
  function handleGoalSelect(id) {
    setSelectedGoalId(id);
    setShowAddGoal(false);
    setGoalEditMode(null);
  }
  function handleGoalFormChange(e) {
    setGoalForm({ ...goalForm, [e.target.name]: e.target.value });
  }
  function resetGoalForm() {
    setGoalForm({
      name: "",
      target: "",
      deadline: "",
      reminderFreq: "Weekly",
    });
  }
  function handleAddGoal() {
    setShowAddGoal(true);
    setGoalEditMode(null);
    resetGoalForm();
  }
  function handleEditGoal(goal) {
    setGoalEditMode(goal.id);
    setShowAddGoal(true);
    setGoalForm({
      name: goal.name,
      target: goal.target,
      deadline: goal.deadline,
      reminderFreq: goal.reminderFreq || "Weekly",
    });
  }
  function handleGoalFormSubmit(e) {
    e.preventDefault();
    if (!goalForm.name || !goalForm.target || !goalForm.deadline) return;
    if (goalEditMode) {
      setGoals(goals =>
        goals.map(g =>
          g.id === goalEditMode
            ? { ...g, ...goalForm, target: Number(goalForm.target) }
            : g
        )
      );
      setGoalEditMode(null);
    } else {
      setGoals([
        ...goals,
        {
          id: Date.now(),
          name: goalForm.name,
          target: Number(goalForm.target),
          saved: 0,
          deadline: goalForm.deadline,
          reminderFreq: goalForm.reminderFreq || "Weekly",
          microHabit: "",
        },
      ]);
      setSelectedGoalId(Date.now());
    }
    resetGoalForm();
    setShowAddGoal(false);
  }
  function handleDeleteGoal(id) {
    setGoals(goals => goals.filter(g => g.id !== id));
    if (goals.length > 1) setSelectedGoalId(goals.find(g => g.id !== id).id);
  }

  // ============= Reminder & Habit (Mocked) =============
  function getReminderPhrase(freq) {
    switch (freq) {
      case "Monthly":
        return "every month";
      case "Weekly":
        return "each week";
      case "Daily":
        return "every day";
      default:
        return "regularly";
    }
  }

  // ============= Progress Calculation =============
  function getGoalProgress(goal) {
    return Math.min((goal.saved / goal.target) * 100, 100);
  }
  function handleSimulateSave(amount, goalId) {
    setGoals(gs =>
      gs.map(g =>
        g.id === goalId
          ? { ...g, saved: Math.min(g.saved + amount, g.target) }
          : g
      )
    );
  }

  // ============= UI Elements =============
  const selectedGoal = goals.find((g) => g.id === selectedGoalId);

  // Input field common style
  const inputStyle = {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: "8px 13px",
    width: "100%",
    background: "#F5F8FA",
    fontSize: 15,
    color: COLORS.text,
    marginTop: 2,
    outline: "none",
    marginBottom: 0,
    boxSizing: "border-box",
    fontWeight: 500,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.lightBg,
        color: COLORS.text,
        paddingBottom: 32,
      }}
    >
      <nav
        style={{
          background: COLORS.card,
          borderBottom: `2px solid ${COLORS.primary}20`,
          boxShadow: `0 2px 8px ${COLORS.shadow}`,
          padding: 0,
        }}
      >
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            padding: "0 32px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: COLORS.primary,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 1,
            }}
          >
            🏆 GoalSaver
          </span>
          <span style={{ fontSize: 14, color: COLORS.muted }}>
            Your personal savings planner
          </span>
        </div>
      </nav>

      <section style={heroStyle}>
        <h1 style={{ fontWeight: 700, color: COLORS.primary, fontSize: 38, margin: "0 0 8px 0" }}>
          Save Smarter. Reach Your Dreams.
        </h1>
        <div style={{ color: COLORS.muted, fontSize: 17, marginBottom: 2 }}>
          Plan. Track. Celebrate.
        </div>
        <div style={{ color: COLORS.accent, marginTop: 6, fontWeight: 500 }}>
          Manage multiple goals, see your progress, and build habits for lasting change.
        </div>
      </section>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 32px" }}>
        {/* ========== Main Dashboard Grid ========== */}
        <div style={dashboardGrid}>
          {/* Left Column: Goals & Progress */}
          <div>
            {/* Multiple Goals Management */}
            <div style={{ ...cardStyle, paddingBottom: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 20, color: COLORS.primary, marginBottom: 10 }}>
                Your Savings Goals
              </div>
              <div style={{ marginBottom: 12 }}>
                {goals.map(goal => (
                  <div
                    key={goal.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: 8,
                      borderRadius: 8,
                      border:
                        selectedGoalId === goal.id
                          ? `2px solid ${COLORS.primary}`
                          : `1px solid ${COLORS.border}`,
                      background: selectedGoalId === goal.id ? "#F2FBF4" : "transparent",
                      marginBottom: 4,
                      cursor: "pointer",
                      justifyContent: "space-between",
                    }}
                    onClick={() => handleGoalSelect(goal.id)}
                  >
                    <span style={{ fontWeight: 500, fontSize: 15 }}>
                      {goal.name}
                    </span>
                    <span>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: COLORS.accent,
                          marginRight: 4,
                          cursor: "pointer",
                          fontSize: 14,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGoal(goal);
                        }}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#DC3545",
                          fontSize: 15,
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGoal(goal.id);
                        }}
                        title="Delete"
                        disabled={goals.length <= 1}
                      >
                        🗑️
                      </button>
                    </span>
                  </div>
                ))}
              </div>
              <button
                style={{
                  ...btnStyle(COLORS.secondary, COLORS.text),
                  width: "90%",
                  margin: "0 auto",
                  display: "block",
                  marginTop: 8,
                }}
                onClick={handleAddGoal}
              >
                + Add New Goal
              </button>
            </div>
            {/* Goal-Based Savings Planner & Progress Tracker */}
            {selectedGoal && (
              <div style={cardStyle}>
                <div style={{ fontWeight: 600, fontSize: 19, color: COLORS.accent }}>
                  {selectedGoal.name}
                </div>
                <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 12 }}>
                  Target: <b>₹{selectedGoal.target.toLocaleString()}</b>{" "}
                  by {selectedGoal.deadline}
                </div>
                <div style={labelStyle}>Progress</div>
                <ProgressBar
                  percent={getGoalProgress(selectedGoal)}
                  color={COLORS.primary}
                />
                <div style={{ fontWeight: 500, marginTop: 6, marginBottom: 10 }}>
                  Saved: <span style={{ color: COLORS.primary }}>₹{selectedGoal.saved.toLocaleString()}</span>
                  {" / "}
                  <span style={{ color: COLORS.muted }}>
                    ₹{selectedGoal.target.toLocaleString()}
                  </span>
                  <span style={{ marginLeft: 8, fontSize: 12, color: COLORS.secondary }}>
                    {getGoalProgress(selectedGoal) >= 100
                      ? "🎉 Goal reached!"
                      : `(${getGoalProgress(selectedGoal).toFixed(1)}%)`}
                  </span>
                </div>
                <button
                  style={btnStyle(COLORS.primary, "white", { marginTop: 8 })}
                  onClick={() => handleSimulateSave(500, selectedGoal.id)}
                  disabled={selectedGoal.saved >= selectedGoal.target}
                >
                  Simulate Save ₹500
                </button>
              </div>
            )}
          </div>
          {/* Right Column: Contribution Calculator, Reminders & Habits */}
          <div>
            {/* Smart Contribution Calculator */}
            {selectedGoal && (
              <div style={cardStyle}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 18,
                    color: COLORS.secondary,
                    marginBottom: 8,
                  }}
                >
                  Smart Contribution Calculator
                </div>
                <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 4 }}>
                  Required per month to reach your goal:
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 26,
                    color: COLORS.primary,
                    margin: "5px 0 16px 0",
                  }}
                >
                  ₹{calculateMonthlyContribution(selectedGoal).toLocaleString()} / month
                </div>
                <div style={{ fontSize: 13, color: COLORS.muted }}>
                  <span>Based on your current pace, target, and deadline.</span>
                </div>
              </div>
            )}
            {/* Reminders & Habit Builder (Enabled and Interactive) */}
            <div style={{
              ...cardStyle,
              background: "#fff8e1",
              border: `2px solid ${COLORS.secondary}`,
              boxShadow: `0 2px 10px ${COLORS.shadow}`,
              position: "relative",
              opacity: 1,
              filter: "none",
              transition: "all 0.2s"
            }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 17,
                  color: COLORS.secondary,
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                Reminders & Habit Builder <span style={{
                  marginLeft: 10,
                  background: COLORS.primary,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 6,
                  padding: "2px 9px",
                  letterSpacing: ".5px"
                }}>ENABLED</span>
              </div>
              <div style={{
                fontSize: 15,
                color: COLORS.muted,
                marginBottom: 8,
              }}>
                <b>Auto Reminders:</b>&nbsp;
                Get friendly nudges to save {selectedGoal?.reminderFreq && <b>{getReminderPhrase(selectedGoal.reminderFreq)}</b>}.
                <br />
                <span style={{ color: COLORS.text, fontWeight: 500 }}>
                  Boost consistency with micro-saving habits tailored to your goal.
                </span>
              </div>
              <form
                onSubmit={e => { e.preventDefault(); alert('Reminder set! (Demo)'); }}
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 8,
                  alignItems: "center"
                }}
              >
                <label style={
                  { ...labelStyle, marginBottom: 0 }
                }>
                  Reminder Frequency
                  <select
                    style={{
                      ...inputStyle,
                      width: 115,
                      marginLeft: 8,
                      fontWeight: 500,
                      fontSize: 14,
                      padding: "6px 11px"
                    }}
                    name="reminderFreq"
                    value={selectedGoal?.reminderFreq || "Weekly"}
                    onChange={e => {
                      const value = e.target.value;
                      setGoals(gs => gs.map(g =>
                        g.id === selectedGoalId ? { ...g, reminderFreq: value } : g
                      ));
                    }}
                  >
                    {["Daily", "Weekly", "Monthly"].map(freq => (
                      <option key={freq} value={freq}>{capitalize(freq)}</option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  style={btnStyle(COLORS.secondary, "#fff", { marginLeft: 10, fontWeight: 600 })}
                  title="Save reminder frequency"
                >
                  Set
                </button>
              </form>
              {selectedGoal?.microHabit && (
                <div style={{
                  marginTop: 18,
                  background: "#fffde7",
                  borderRadius: 7,
                  padding: "8px 13px",
                  color: COLORS.accent,
                  fontWeight: 500,
                  fontSize: 14,
                  boxShadow: `0 1.5px 5px ${COLORS.shadow}`
                }}>
                  <span role="img" aria-label="habit" style={{ marginRight: 7 }}>🌱</span>
                  <span>{selectedGoal.microHabit}</span>
                </div>
              )}
            </div>
            {/* Progress/Milestones */}
            {selectedGoal && (
              <div style={{ ...cardStyle, background: "#F7FAFE" }}>
                <div style={{ fontWeight: 600, color: "#446b8a", marginBottom: 12 }}>
                  Progress Milestones
                </div>
                <MilestoneList goal={selectedGoal} />
              </div>
            )}
          </div>
        </div>
        {/* Add/Edit Goal Modal */}
        {showAddGoal && (
          <Modal onClose={() => { setShowAddGoal(false); setGoalEditMode(null); }}>
            <form onSubmit={handleGoalFormSubmit} style={{ width: 320, margin: "0 auto" }}>
              <h2 style={{ color: COLORS.primary, fontSize: 21, marginBottom: 14 }}>
                {goalEditMode ? "Edit Goal" : "Add New Goal"}
              </h2>
              <div style={{ marginBottom: 13 }}>
                <label style={labelStyle}>Goal Name</label>
                <input
                  style={inputStyle}
                  name="name"
                  required
                  placeholder="e.g. Vacation to Goa"
                  value={goalForm.name}
                  onChange={handleGoalFormChange}
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: 13 }}>
                <label style={labelStyle}>Target Amount (₹)</label>
                <input
                  style={inputStyle}
                  type="number"
                  name="target"
                  required
                  min={100}
                  placeholder="e.g. 20000"
                  value={goalForm.target}
                  onChange={handleGoalFormChange}
                />
              </div>
              <div style={{ marginBottom: 13 }}>
                <label style={labelStyle}>Deadline</label>
                <input
                  style={inputStyle}
                  type="date"
                  name="deadline"
                  required
                  value={goalForm.deadline}
                  onChange={handleGoalFormChange}
                />
              </div>
              <div style={{ marginBottom: 13 }}>
                <label style={labelStyle}>Reminder Frequency</label>
                <select
                  style={inputStyle}
                  name="reminderFreq"
                  value={goalForm.reminderFreq}
                  onChange={handleGoalFormChange}
                >
                  {["Daily", "Weekly", "Monthly"].map(freq => (
                    <option key={freq} value={freq}>{capitalize(freq)}</option>
                  ))}
                </select>
              </div>
              <div style={{ textAlign: "right", marginTop: 12 }}>
                <button
                  type="button"
                  style={btnStyle("transparent", COLORS.text, { marginRight: 10 })}
                  onClick={() => { setShowAddGoal(false); setGoalEditMode(null); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={btnStyle(COLORS.primary, "white")}
                >
                  {goalEditMode ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
      {/* Enhanced GoalStack Features (Simulated, Demo UI) */}
      <div style={{
        maxWidth: 1040,
        margin: "56px auto 0 auto",
        padding: "0 32px 24px 32px",
        transition: "background 0.3s"
      }}>
        <h2 style={{
          color: COLORS.primary,
          letterSpacing: 0.5,
          fontWeight: 700,
          marginTop: 24,
          marginBottom: 14,
          textAlign: "center",
        }}>
          🚀 Enhanced GoalStack Experiences
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px"
        }}>
          {/* 1. Goal Templates */}
          <FeatureCard
            icon="📚"
            title="Goal Templates"
            description="Choose from pre-made goal templates (Travel, Gadgets, Emergency Fund, etc.). Kickstart saving with best-practice targets and micro-habits auto-filled!"
            demoTag="NEW"
          />
          {/* 2. Goal Bundles */}
          <FeatureCard
            icon="🎯"
            title="Goal Bundles"
            description="Group related saving goals into bundles (e.g. Wedding Bundle: Venue, Dress, Honeymoon) and track their collective progress."
            demoTag="DEMO"
          />
          {/* 3. Widget Support */}
          <FeatureCard
            icon="🧩"
            title="Widget Support"
            description="Add live savings goal widgets to your phone or desktop home screen and monitor progress at a glance."
            comingSoon
          />
          {/* 4. Level-Up System */}
          <FeatureCard
            icon="🔥"
            title="Level-Up System"
            description="Unlock new levels and earn badges as you achieve savings streaks, reach goals, or try advanced features. Gamify your money journey!"
            demoTag="HOT"
          />
          {/* 5. Daily Savings Quiz */}
          <FeatureCard
            icon="❓"
            title="Daily Savings Quiz"
            description="Take a daily short quiz to reinforce good savings habits and earn rewards. Fun and educational!"
          />
          {/* 6. "Lock It & Leave It" Mode */}
          <FeatureCard
            icon="🔒"
            title='"Lock It & Leave It" Mode'
            description="Temporarily lock your progress to prevent withdrawals and boost discipline for a set period ('saving fast')."
          />
          {/* 7. Mystery Reward Days */}
          <FeatureCard
            icon="🎁"
            title="Mystery Reward Days"
            description="On select days, meeting your savings target unlocks a surprise reward. Stay curious and consistent!"
          />
          {/* 8. Sync with Google Calendar / Reminders */}
          <FeatureCard
            icon="📆"
            title="Calendar / Reminder Sync"
            description="(Preview) Connect your Google Calendar to auto-track savings reminders and deadlines with one click."
            comingSoon
          />
          {/* 9. Goal Journal */}
          <FeatureCard
            icon="📓"
            title="Goal Journal"
            description="Write daily/weekly reflections on your savings journey, set affirmations, and celebrate small wins."
            demoTag="BETA"
          />
          {/* 10. Night Mode Savings Prompt */}
          <FeatureCard
            icon="🌙"
            title="Night Mode Prompt"
            description="Get a friendly evening check-in to log your savings or journal your progress before bed. (Night mode preview!)"
          />
          {/* 11. Public Goal Showcase */}
          <FeatureCard
            icon="🌐"
            title="Public Goal Showcase"
            description="Share select goals & milestones (no amounts) with friends or community to inspire and be inspired."
          />
          {/* 12. GoalStack Pro */}
          <FeatureCard
            icon="⭐"
            title="GoalStack Pro"
            description="Unlock Pro features (advanced analytics, export data, detailed insights, premium themes)."
            comingSoon
          />
          {/* 13. Partner Discounts */}
          <FeatureCard
            icon="🤝"
            title="Partner Discounts"
            description="Enjoy special offers from finance, travel, and shopping partners when you achieve your savings targets!"
          />
          {/* 14. Community Challenges */}
          <FeatureCard
            icon="🏅"
            title="Community Challenges"
            description="Join public challenges, compete on streaks, and celebrate as a part of the GoalSaver community."
          />
        </div>
      </div>
      <footer style={{
        maxWidth: 1040, padding: 30, margin: '40px auto 0 auto', color: COLORS.muted, textAlign: "center", fontSize: 14
      }}>
        <span>GoalSaver — Virtual savings dashboard. No bank integration. Data does not persist.</span>
      </footer>
    </div>
  );
}

// ====== UI Helper Components =======

function btnStyle(bg, fg, extra = {}) {
  return {
    background: bg,
    color: fg,
    border: "none",
    borderRadius: 7,
    padding: "8px 16px",
    fontWeight: 550,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: `0 1px 3px ${COLORS.shadow}`,
    ...extra
  };
}

// PUBLIC_INTERFACE
function ProgressBar({ percent, color }) {
  return (
    <div style={{
      background: COLORS.progress,
      borderRadius: 7,
      height: 15,
      width: "100%",
      marginBottom: 8,
      border: `1px solid ${COLORS.primary}30`,
      overflow: "hidden",
    }}>
      <div style={{
        width: `${percent}%`,
        height: "100%",
        background: color,
        borderRadius: 7,
        transition: "width 0.5s cubic-bezier(.42,0,.56,1.71)"
      }} />
    </div>
  );
}

// PUBLIC_INTERFACE
function Modal({ children, onClose }) {
  return (
    <div style={{
      position: "fixed",
      left: 0, top: 0, right: 0, bottom: 0,
      background: "rgba(22,28,41,0.18)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 16, minWidth: 290, boxShadow: "0 6px 40px #0002", padding: "24px 28px", position: "relative" }}
        onClick={e => e.stopPropagation()}
      >
        <button type="button" style={{
          position: "absolute", top: 7, right: 14, border: "none", background: "none", color: "#587", fontSize: 19, cursor: "pointer"
        }} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function MilestoneList({ goal }) {
  // Divide target into milestones (25%, 50%, 75%, 100%)
  const ms = [0.25, 0.5, 0.75, 1.0];
  return (
    <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
      {ms.map(m => {
        const mValue = Math.round(goal.target * m);
        const achieved = goal.saved >= mValue;
        return (
          <li key={mValue} style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 10,
            color: achieved ? COLORS.primary : COLORS.muted,
            opacity: achieved ? 1 : 0.55,
            fontWeight: achieved ? 600 : 400
          }}>
            <span style={{ fontSize: 19, marginRight: 12 }}>
              {achieved ? "✅" : "⏳"}
            </span>
            <span>{Math.floor(m * 100)}% ({`₹${mValue.toLocaleString()}`})</span>
            <span style={{ marginLeft: "auto", fontSize: 12 }}>
              {achieved ? "Unlocked" : "Pending"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * PUBLIC_INTERFACE
 * Renders a feature card for the GoalStack enhancements section.
 */
function FeatureCard({ icon, title, description, demoTag, comingSoon }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 13,
      border: `1.5px solid ${COLORS.border}`,
      boxShadow: "0 2px 10px rgba(120, 148, 180, 0.09)",
      padding: "21px 19px 16px 19px",
      minHeight: 165,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <span style={{ fontSize: 29, marginTop: -2, marginRight: 6 }}>{icon}</span>
        <span style={{
          color: COLORS.accent,
          fontWeight: 700,
          fontSize: 18,
        }}>{title}</span>
        {demoTag && (
          <span style={{
            marginLeft: 8,
            background: COLORS.secondary,
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 600,
            borderRadius: 6,
            padding: "1px 7px",
            letterSpacing: "0.5px"
          }}>{demoTag}</span>
        )}
        {comingSoon && (
          <span style={{
            marginLeft: 8,
            background: "#e1e6fa",
            color: "#5a6fa9",
            fontSize: 12.5,
            fontWeight: 600,
            borderRadius: 6,
            padding: "1px 7px",
            border: `1px dashed ${COLORS.secondary}`,
            letterSpacing: "0.5px"
          }}>Coming Soon</span>
        )}
      </div>
      <p style={{
        margin: "15px 0 0 2px",
        fontSize: 15,
        color: COLORS.muted,
        fontWeight: 500,
        lineHeight: 1.34,
        flex: 1,
      }}>
        {description}
      </p>
    </div>
  );
}

// PUBLIC_INTERFACE
// The above file provides the main dashboard and all subcomponents for GoalSaver. All state is in-memory/mock. Add more UI polish as desired.
