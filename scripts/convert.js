const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

async function convertDocx() {
  const files = [
    { 
      name: "kratkie_otvety_PMDK03_qa.docx", 
      type: "theory" 
    },
    { 
      name: "practical_instructions_MDK03_02.docx", 
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
    }
  }

  fs.writeFileSync(path.join(process.cwd(), "data.json"), JSON.stringify(allTickets, null, 2));
}

convertDocx();