const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

async function convertDocx() {
  const files = [
    { 
      name: "theory_answers_mdk03_corrected.docx", 
      type: "theory" 
    },
    { 
      name: "practical_answers_mdk03_detailed.docx", 
      type: "practice" 
    }
  ];

  let allTickets = [];

  for (const file of files) {
    const docxPath = path.join(process.cwd(), file.name);
    
    if (fs.existsSync(docxPath)) {
      const result = await mammoth.convertToHtml({ path: docxPath });
      const html = result.value;

      const sections = html.split(/<h1>|<h2>/).filter(Boolean);
      
      sections.forEach((section, index) => {
        const titleEnd = section.indexOf("</h1>") !== -1 ? section.indexOf("</h1>") : section.indexOf("</h2>");
        const title = section.substring(0, titleEnd).replace(/<[^>]*>/g, "").trim();
        const content = section.substring(titleEnd + 5).trim();

        allTickets.push({
          id: allTickets.length + 1,
          title: title || `Вопрос ${allTickets.length + 1}`,
          content: content,
          type: file.type
        });
      });
    } else {
      console.log(`Файл не найден: ${file.name}`);
    }
  }

  fs.writeFileSync(path.join(process.cwd(), "data.json"), JSON.stringify(allTickets, null, 2));
}

convertDocx();
