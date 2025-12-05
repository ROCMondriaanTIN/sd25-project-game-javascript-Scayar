# 🎲 Hoger / Lager – Dobbelspel

Een interactieve browser game waarbij je tegen de computer speelt door te voorspellen of jouw dobbelsteen totaal hoger of lager zal zijn dan dat van de computer.

## 📋 Inhoudsopgave

- [Over het Project](#over-het-project)
- [Features](#features)
- [Architectuur](#architectuur)
- [Installatie](#installatie)
- [Gebruik](#gebruik)
- [Project Structuur](#project-structuur)
- [Technische Details](#technische-details)
- [Game Flow](#game-flow)
- [Technologieën](#technologieën)
- [Auteur](#auteur)

---

## 🎯 Over het Project

**Hoger / Lager – Dobbelspel** is een single-page browser game ontwikkeld met vanilla JavaScript, HTML5 en CSS3. Het project volgt het **MVC (Model-View-Controller)** patroon voor een duidelijke scheiding van verantwoordelijkheden.

### Spelregels

1. **Computer gooien**: De computer gooit eerst twee dobbelstenen
2. **Inzetten**: Jij kiest een voorspelling (Hoger/Lager) en een inzet bedrag
3. **Speler gooien**: Jij gooit je eigen dobbelstenen
4. **Resultaat**: 
   - **Hoger**: Je wint als jouw totaal **hoger** is dan de computer
   - **Lager**: Je wint als jouw totaal **lager** is dan de computer
5. **Saldo**: Bij winst krijg je je inzet erbij, bij verlies gaat je inzet eraf

---

## ✨ Features

- 🎲 **Interactieve dobbelstenen** met animaties
- 💰 **Saldo systeem** - Start met 100 credits
- 📊 **Geschiedenis tabel** - Bekijk je laatste 5 rondes
- 🎨 **Modern UI design** - Donker thema met neon accenten
- 📱 **Responsive design** - Werkt op desktop en mobiel
- ✅ **Input validatie** - Controleert inzet en voorspellingen
- 🎯 **Game Over detectie** - Automatische detectie wanneer saldo op is
- 🔄 **Nieuw spel functie** - Reset het spel naar beginwaarden

---

## 🏗 Architectuur

Het project gebruikt het **MVC (Model-View-Controller)** patroon:

### 🧠 Model (`js/hogerlager.js`)
- Bevat alle game state en logica
- **Geen DOM interactie**
- Object: `HogerLagerGame`

**Belangrijkste variabelen:**
- `saldo` - Huidige speler saldo
- `roundNumber` - Huidige ronde nummer
- `computerDice` / `playerDice` - Dobbelsteen waarden
- `history` - Array met laatste 5 rondes

**Belangrijkste functies:**
- `startNewRoundWithComputerRoll()` - Start nieuwe ronde
- `setBetAndPrediction()` - Valideert en slaat inzet op
- `rollPlayerAndResolve()` - Gooit speler dobbelstenen en lost ronde op
- `resetGame()` - Reset naar beginwaarden

### 🖥 View (`index.html` + `css/style.css`)
- Definieert HTML structuur
- CSS styling en animaties
- **Geen JavaScript logica**

**Belangrijkste elementen:**
- Computer panel (dobbelstenen + totaal)
- Controls panel (saldo, voorspelling, inzet)
- Player panel (dobbelstenen + totaal)
- Result & History section

### 🎮 Controller (`js/controller.js`)
- Handelt alle DOM interacties af
- Event handling
- Communiceert met Model
- Update View

**Belangrijkste functies:**
- `renderComputerState()` - Rendert computer dobbelstenen
- `renderPlayerState()` - Rendert speler dobbelstenen
- `renderResultMessage()` - Toont win/loss bericht
- `renderHistory()` - Update geschiedenis tabel
- `handleComputerRoll()` - Event handler voor computer button
- `handlePlayerRoll()` - Event handler voor speler button

---

## 🚀 Installatie

1. **Clone de repository:**
```bash
git clone https://github.com/ROCMondriaanTIN/sd25-project-game-javascript-Scayar.git
```

2. **Navigeer naar de project folder:**
```bash
cd sd25-project-game-javascript-Scayar
```

3. **Open `index.html` in je browser:**
   - Dubbelklik op `index.html`
   - Of gebruik een local server (bijv. Live Server in VS Code)

**Geen build tools of dependencies nodig!** Het project gebruikt alleen vanilla JavaScript, HTML en CSS.

---

## 🎮 Gebruik

### Spel Starten

1. Open `index.html` in je browser
2. Je start met **100 credits** saldo

### Een Ronde Spelen

1. **Klik op "Computer gooien"**
   - De computer gooit twee dobbelstenen
   - Je ziet het computer totaal

2. **Kies je voorspelling:**
   - Selecteer **Hoger** of **Lager** via radio buttons
   - Voer je **inzet** in (tussen 1 en je huidige saldo)

3. **Klik op "Speler gooien"**
   - Je dobbelstenen worden gegooid
   - Het resultaat wordt getoond
   - Je saldo wordt bijgewerkt

4. **Bekijk het resultaat:**
   - Groen bericht = Gewonnen! 🎉
   - Rood bericht = Verloren... 😢
   - Je geschiedenis wordt bijgewerkt

### Nieuw Spel

- Wanneer je saldo op is (≤ 0), verschijnt de **"Nieuw spel"** button
- Klik erop om alles te resetten naar beginwaarden

---

## 📁 Project Structuur

```
hoger-lager/
│
├── index.html              # Hoofd HTML bestand
├── README.md               # Project documentatie
├── Technisch_Ontwerp.html  # Technische documentatie
│
├── css/
│   └── style.css          # Alle styling en animaties
│
└── js/
    ├── hogerlager.js      # Model - Game logica
    └── controller.js      # Controller - DOM & Events
```

---

## 🔧 Technische Details

### Model (`hogerlager.js`)

**Variabelen:**
| Variabele | Type | Beschrijving |
|-----------|------|--------------|
| `saldo` | number | Huidige speler saldo (start: 100) |
| `lastBet` | number | Laatste inzet bedrag (start: 10) |
| `lastPrediction` | string | Laatste voorspelling ('hoger'/'lager') |
| `roundNumber` | number | Huidige ronde nummer (start: 0) |
| `computerDice` | Array<number> | Computer dobbelstenen [die1, die2] |
| `playerDice` | Array<number> | Speler dobbelstenen [die1, die2] |
| `computerTotal` | number | Som van computer dobbelstenen |
| `playerTotal` | number | Som van speler dobbelstenen |
| `history` | Array<Object> | Geschiedenis van laatste 5 rondes |
| `computerHasRolled` | boolean | Flag of computer heeft gegooid |

**Functies:**
| Functie | Parameters | Return | Beschrijving |
|---------|------------|--------|--------------|
| `rollTwoDice()` | geen | Array<number> | Gooit twee dobbelstenen |
| `startNewRoundWithComputerRoll()` | geen | Object | Start nieuwe ronde, gooit computer dobbelstenen |
| `setBetAndPrediction(bet, pred)` | number, string | Object | Valideert en slaat inzet op |
| `rollPlayerAndResolve()` | geen | Object | Gooit speler dobbelstenen, lost ronde op |
| `resetGame()` | geen | void | Reset naar beginwaarden |
| `isGameOver()` | geen | boolean | Checkt of saldo ≤ 0 |
| `hasComputerRolled()` | geen | boolean | Checkt of computer heeft gegooid |

### Controller (`controller.js`)

**Render Functies:**
- `renderComputerState(data)` - Rendert computer dobbelstenen en totaal
- `renderPlayerState(data)` - Rendert speler dobbelstenen en totaal
- `renderSaldo(newSaldo)` - Update saldo display
- `renderResultMessage(outcome)` - Toont win/loss bericht
- `renderHistory(historyArray)` - Update geschiedenis tabel

**Event Handlers:**
- `handleComputerRoll()` - Handelt "Computer gooien" click af
- `handlePlayerRoll()` - Handelt "Speler gooien" click af
- `handleNewGame()` - Handelt "Nieuw spel" click af
- `initializeUI()` - Initialiseert UI bij page load

---

## 🔄 Game Flow

```
1. Page Load
   └─> initializeUI() → Set default values

2. User clicks "Computer gooien"
   └─> handleComputerRoll()
       └─> HogerLagerGame.startNewRoundWithComputerRoll()
           └─> renderComputerState()
               └─> Enable "Speler gooien" button

3. User selects prediction + bet
   └─> User clicks "Speler gooien"
       └─> handlePlayerRoll()
           └─> Validate input
               └─> HogerLagerGame.setBetAndPrediction()
                   └─> HogerLagerGame.rollPlayerAndResolve()
                       └─> renderPlayerState()
                       └─> renderSaldo()
                       └─> renderResultMessage()
                       └─> renderHistory()
                           └─> Check game over

4. Game Over (saldo ≤ 0)
   └─> showGameOverMessage()
       └─> User clicks "Nieuw spel"
           └─> handleNewGame()
               └─> HogerLagerGame.resetGame()
                   └─> Reset all UI
```

---

## 🎨 Design

### Kleuren Schema

```css
--bg: #020617              /* Donkerblauw achtergrond */
--panel: #0f172a           /* Donker panel */
--accent: #f97316          /* Oranje accent */
--success: #22c55e        /* Groen voor win */
--danger: #f87171         /* Rood voor loss */
--text-main: #e5e7eb      /* Lichtgrijs tekst */
```

### Typografie

- **UI Text**: Poppins (Google Fonts)
- **Numbers**: JetBrains Mono (monospace)

### Responsive Design

- **Desktop (≥ 768px)**: 3-kolom grid layout
- **Tablet (600-900px)**: 2-kolom layout
- **Mobile (< 600px)**: 1-kolom vertical stack

---

## 🛠 Technologieën

- **HTML5** - Structuur
- **CSS3** - Styling, Flexbox, Grid, Animations
- **Vanilla JavaScript (ES6+)** - Geen frameworks
- **Google Fonts** - Poppins & JetBrains Mono

**Geen dependencies of build tools nodig!**

---

## 📊 Geschiedenis Functionaliteit

- Toont laatste **5 rondes**
- Nieuwste ronde **bovenaan**
- Kolommen:
  - Ronde nummer
  - Computer totaal
  - Speler totaal
  - Voorspelling (Hoger/Lager)
  - Resultaat (✓/✗)
  - Saldo na ronde

---

## 🎯 Validatie

### Inzet Validatie

- Moet een **nummer** zijn
- Moet **≥ 1** zijn
- Moet **≤ huidige saldo** zijn
- Error berichten worden getoond bij ongeldige input

### Game Flow Validatie

- Speler kan niet gooien voordat computer heeft gegooid
- Computer moet eerst gooien voor elke nieuwe ronde
- Game over wordt automatisch gedetecteerd

---

## 📝 Technische Documentatie

Voor gedetailleerde technische documentatie, zie:
- **[Technisch_Ontwerp.html](Technisch_Ontwerp.html)** - Volledige technische specificatie met UML diagrams

---

## 👤 Auteur

**Scayar**

- Project voor ROC Mondriaan TIN
- School assignment: JavaScript Game Project

---

## 📄 Licentie

Dit project is ontwikkeld voor educatieve doeleinden.

---

## 🙏 Credits

- **Fonts**: Google Fonts (Poppins, JetBrains Mono)
- **Design**: Custom dark theme met neon accenten
- **Architectuur**: MVC Pattern

---

**Made with ❤️ by Scayar**

