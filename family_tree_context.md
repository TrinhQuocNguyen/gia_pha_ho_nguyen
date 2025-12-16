# Context for Cursor AI – Family Tree Web Application

## Goal
Create a **single-page dynamic family tree web app** using **pure HTML, CSS, and JavaScript** (no frameworks, no build tools). The app should:
- Visually represent people as **cool animated entity elements** (e.g., rounded cards with hover animations, avatar placeholders, nice fonts).
- Allow **expand/collapse functionality** to reveal children for any person or couple.
- Be **dynamic**: The data should come from a JavaScript object/JSON so that **any user can modify the data** to create their own family tree without touching the core code.

---

## Requirements

### 1. Person Representation
- Each person should be shown as a **card** or **circle avatar** with:
  - Name
  - Optional small photo or placeholder
  - Light hover animation (scale or glow)
  - Smooth fade/slide-in animations when appearing

### 2. Couple and Children Display
- If two people are a couple, they should be displayed side-by-side with a **connector line**.
- Beneath them, have a **dropdown-style expandable section** that shows their children.
- Children can also have their own expandable sections if they have children (multi-level nesting).
- The tree should **auto-indent or cascade downwards** for generations.

### 3. Expand/Collapse Animation
- Smooth expand/collapse animation (sliding or fading).
- Initially, only the **root family** is expanded.
- Clicking the dropdown arrow/icon expands the next generation.

### 4. Dynamic Data
- All family members, relationships, and children should be stored in a **single JavaScript object**.
- The structure might look like:

```js
const familyData = {
  name: "John Doe",
  spouse: "Jane Doe",
  children: [
    {
      name: "Alex Doe",
      spouse: "Emma Doe",
      children: [
        { name: "Lucas Doe" },
        { name: "Mia Doe" }
      ]
    },
    { name: "Sophia Doe" }
  ]
};
