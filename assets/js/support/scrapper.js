
// Pokedex
function parsePokedexObject() {
    const result = [];
    const table = document.getElementById("pokedex");
    if (!table) return result;
  
    const rows = table.querySelectorAll("tbody tr");
  
    rows.forEach(row => {
      const idText = row.querySelector(".infocard-cell-data")?.textContent.trim() || "";
      const id = idText ? parseInt(idText, 10) : null;
  
      const title = row.querySelector(".ent-name")?.textContent.trim() || "";
  
      const subtitle = row.querySelector(".text-muted")?.textContent.trim() || "";
  
      const types = Array.from(row.querySelectorAll(".type-icon")).map(t => t.textContent.trim());
  
      const imgSrc = row.querySelector("img.img-fixed.icon-pkmn")?.getAttribute("src") || "";
      const hrefIcon = imgSrc ? imgSrc.split("/").pop().replace(/\.[^/.]+$/, "") : "";
  
      result.push({ id, title, subtitle, types, hrefIcon });
    });
  
    return result;
  }
  
  function parsePokedexCSV() {
    const table = document.getElementById("pokedex");
    if (!table) return "";
  
    const rows = table.querySelectorAll("tbody tr");
    const result = ["id,title,subtitle,type1,type2"];
  
    rows.forEach(row => {
      const idText = row.querySelector(".infocard-cell-data")?.textContent.trim() || "";
      const id = idText ? parseInt(idText, 10) : "";
  
      const title = row.querySelector(".ent-name")?.textContent.trim() || "";
  
      const subtitle = row.querySelector(".text-muted")?.textContent.trim() || "";
  
      const types = Array.from(row.querySelectorAll(".type-icon")).map(t => t.textContent.trim());
      const type1 = types[0] || "";
      const type2 = types[1] || "";
  
      result.push(`${id},"${title}","${subtitle}",${type1},${type2}`);
    });
  
    return result.join("\n");
  }
  