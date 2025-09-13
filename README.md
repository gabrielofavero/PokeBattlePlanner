# Pokémon Battle Planner

This little project came to life because I got tired of relying on charts to figure out which Pokémon I should use in important battles.

The idea is simple: search for a type to see which matchups work best, or search for a Pokémon and we’ll pull up its stats for you. You can even add your current party, and we’ll highlight your strongest and weakest options for that fight!

Just keep in mind, this tool has its limits. It doesn’t consider Pokémon levels or the opponent’s moves. Think of it as a helper, not a miracle worker.

## Attributions

This web app was developed by Gabriel Fávero (that’s me!). You can find my LinkedIn here, take a look at my other projects here, and get in touch with me here.

Of course, I didn’t do everything on my own. Here's a list of the assets I used to bring this project to life:

- **Data**: [pokemondb](https://pokemondb.net/)
- **Lava background**: [Nathan Long](https://codepen.io/nathanlong)
- **Pokémon images**: [Official Pokémon assets](https://www.pokemon.com/us/pokedex)
- **Xbox / Switch icons**: [Wikimedia](https://commons.wikimedia.org/wiki/File:Xbox_Certified_controller.svg)
- **Type Icons**: [Elginive](https://github.com/Elginive/pokemon-type-icons/tree/main)
- **Playstation icons**: [Wikimedias](https://www.wikimedia.org/) (Adapted [C](https://upload.wikimedia.org/wikipedia/commons/6/6b/PlayStation_button_C.svg), [S](https://upload.wikimedia.org/wikipedia/commons/4/49/PlayStation_button_S.svg), [X](https://upload.wikimedia.org/wikipedia/commons/8/8f/PlayStation_button_X.svg), [T](https://upload.wikimedia.org/wikipedia/commons/6/69/PlayStation_button_T.svg))
- **Vendor Libraries**: [PixiJS](https://pixijs.com/)

## Usage

You are free to use this app and it’s assets as you wish. Just don’t forget to credit me and the other contributors.

## Tasks

| Type            | Latest | Done | Pending |
| --------------- | ------ | ---- | ------- |
| ⚔️: Epic      | E006   | 3    | 3       |
| 🐞: Bug         | B000   | 0    | 0       |
| 🏆: Feature     | F016   | 8    | 6       |
| 📈: Improvement | I004   | 3    | 1       |

### Pending

- 🏆 **F016:** Trim sprites + add alt pokemon image
- ⚔️ **E004:** Implement Pokémon Type Calculator
  - 🏆 **F009:** [E004] Create elements for party view
  - 🏆 **F010:** [E004] Implement Pokémon + Move calculator
- 🏆 **F011:** Add dynamic colors to lava background (similar to Pokémon Violet)
- 🏆 **F012:** Add full keyboard support
- 🏆 **F013:** Add full controller support
- 🏆 **F014:** Add cursor (similar to Pokémon Violet)
- 🏆 **F015:** Add floating elements (Pokémon, cursor)
- ⚔️ **E005:** Add mobile responsiveness
- ⚔️ **E006:** Add theme support + Legends ZA theme
- 📈 **I004:** Animations overhaul

### Done

- ⚔️ **E001:** Project start
  - 🏆 **F001:** [E001] Create initial HTML structure
  - 🏆 **F002:** [E001] Scrappe Pokémon, types and moves data
  - 🏆 **F003:** [E001] Create initial layout
  - 🏆 **F004:** [E001] Create initial dynamic elements (JavaScript)
  - 🏆 **F005:** [E001] Get initial icons and images
- ⚔️ **E002:** Implement Single Type Calculator
- 📈 **I001:**  Make search boxes adapt according to the selected type / Pokémon + Fade
- 📈 **I002:** Add blur to drop-down elements
- 🏆 **F006:** Add yellow hover and active styling to all buttons
- 📈 **I003:** Improve visibility of chart multipliers (colored circles for 2x, 4x, ½, ¼)
- ⚔️ **E003:** Implement Multi Type Calculator
- ⚔️ **E004:** Implement Pokémon Type Calculator
  - 🏆 **F007:** [E004] Implement type calculator
  - 🏆 **F008:** [E004] Implement Pokémon + Moves registration
