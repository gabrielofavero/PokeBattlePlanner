import { changeBackgroundAndOrbs } from "../support/lava-background.js";
import { goToPage } from "./navigation.js";

export function loadPokemonPartiesListeners() {
    const partyPokemons = document.querySelectorAll(".party-pokemon");
    partyPokemons.forEach(el => {
      el.addEventListener("click", () => {
        // partyPokemons.forEach(p => p.classList.remove("selected"));
        // el.classList.add("selected");
        goToPage(document.getElementById('edit-pokemon-container'));
        changeBackgroundAndOrbs('#01408f', ['0x094c9b'])
      });
    });
}

